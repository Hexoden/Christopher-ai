#!/usr/bin/env bash
set -euo pipefail

HOST_IP="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

detect_host_ip() {
  local ip=""

  # Linux path
  if command -v hostname >/dev/null 2>&1; then
    ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
  fi

  # macOS fallback
  if [[ -z "${ip}" ]] && command -v ipconfig >/dev/null 2>&1; then
    ip="$(ipconfig getifaddr en0 2>/dev/null || true)"
    if [[ -z "${ip}" ]]; then
      ip="$(ipconfig getifaddr en1 2>/dev/null || true)"
    fi
  fi

  printf "%s" "${ip}"
}

if [[ $EUID -ne 0 ]]; then
  exec sudo -E bash "$0" "$@"
fi

if [[ -z "${HOST_IP}" ]]; then
  HOST_IP="$(detect_host_ip)"
fi

if [[ -z "${HOST_IP}" ]]; then
  echo "Could not detect host IP automatically. Pass it explicitly: sudo bash ./setup.sh <host-ip>"
  exit 1
fi

cat > "${SCRIPT_DIR}/.env" <<EOF
HOST_IP=${HOST_IP}
EOF

mkdir -p "${SCRIPT_DIR}/certs"
if command -v openssl >/dev/null 2>&1; then
  openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days 825 \
    -keyout "${SCRIPT_DIR}/certs/server.key" \
    -out "${SCRIPT_DIR}/certs/server.crt" \
    -subj "/CN=${HOST_IP}" \
    -addext "subjectAltName=IP:${HOST_IP}" >/dev/null 2>&1
elif command -v docker >/dev/null 2>&1; then
  docker run --rm -v "${SCRIPT_DIR}/certs:/certs" alpine:3.20 sh -lc \
    "apk add --no-cache openssl >/dev/null && \
     openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days 825 \
       -keyout /certs/server.key \
       -out /certs/server.crt \
       -subj '/CN=${HOST_IP}' \
       -addext 'subjectAltName=IP:${HOST_IP}'" >/dev/null 2>&1
else
  echo "Could not generate HTTPS certificate. Install OpenSSL or ensure Docker is available, then rerun setup."
  exit 1
fi

# Remove stale Christopher containers that may exist from older compose project names.
for c in christopher-ollama christopher-app christopher-caddy; do
  docker rm -f "$c" >/dev/null 2>&1 || true
done

# Start or update the stack
if command -v docker >/dev/null 2>&1; then
  docker compose -p christopher up -d --build --remove-orphans
else
  echo "Docker is not installed or not on PATH."
  exit 1
fi

MODEL_NAME="llama3.2:1b"
echo "Ensuring Ollama model ${MODEL_NAME} is available..."

ready=0
for i in {1..30}; do
  if docker compose -p christopher exec -T ollama ollama list >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done

if [[ $ready -ne 1 ]]; then
  echo "Ollama did not become ready in time. Check: docker compose -p christopher logs --tail=120 ollama"
  exit 1
fi

if ! docker compose -p christopher exec -T ollama ollama pull "${MODEL_NAME}"; then
  echo "Failed to pull model ${MODEL_NAME}. Check network access and Ollama logs."
  exit 1
fi

cat <<EOF

Christopher is starting.

Secure URL:
  https://${HOST_IP}:3001

HTTP fallback (optional):
  http://${HOST_IP}:3002

No DNS or hosts-file setup is required.
Open the secure URL from any device on the LAN.

EOF