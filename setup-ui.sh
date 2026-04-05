#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_IP="${1:-}"
LOG_FILE="${SCRIPT_DIR}/.setup-ui.log"

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

if [[ -z "${HOST_IP}" ]]; then
  HOST_IP="$(detect_host_ip)"
fi

if [[ -z "${HOST_IP}" ]]; then
  echo "Could not detect host IP automatically."
  echo "Usage: bash ./setup-ui.sh <host-ip>"
  exit 1
fi

: > "${LOG_FILE}"

# Avoid background sudo password prompts by validating credentials up front.
if [[ $EUID -ne 0 ]]; then
  echo "[setup-ui] Requesting sudo access..."
  sudo -v
fi

# Run the real setup in the background so we can render an animated loader.
if [[ $EUID -eq 0 ]]; then
  bash "${SCRIPT_DIR}/setup.sh" "${HOST_IP}" >"${LOG_FILE}" 2>&1 &
else
  sudo -E bash "${SCRIPT_DIR}/setup.sh" "${HOST_IP}" >"${LOG_FILE}" 2>&1 &
fi
SETUP_PID=$!
START_TS=$(date +%s)
TICK=0
LAST_PRINTED_SEC=-1
IS_INTERACTIVE=0
NON_INTERACTIVE_NOTIFIED=0

if [[ -t 1 && "${TERM:-dumb}" != "dumb" ]]; then
  IS_INTERACTIVE=1
fi

cleanup() {
  if (( IS_INTERACTIVE == 1 )); then
    tput cnorm >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if (( IS_INTERACTIVE == 1 )); then
  tput civis >/dev/null 2>&1 || true
fi

print_banner() {
  printf "  CHRISTOPHER DEPLOYMENT LOADER\n"
  printf "\n"
  printf "        :) ✨\n"
  printf "\n"
  printf "  Host Target : https://%s:3001\n" "$HOST_IP"
  printf "  Fallback    : http://%s:3002\n" "$HOST_IP"
  printf "  Dev Log     : %s\n" "$LOG_FILE"
  printf "\n"
}

build_bar() {
  local elapsed pct width filled wave i bar cols
  elapsed=$(( $(date +%s) - START_TS ))

  # Placeholder progress: creeps to 95% while setup runs, then finalizes at completion.
  pct=$(( elapsed * 2 ))
  if (( pct > 95 )); then
    pct=95
  fi

  if (( IS_INTERACTIVE == 1 )); then
    cols=$(tput cols 2>/dev/null || echo 80)
    width=$(( cols - 66 ))
    if (( width < 12 )); then
      width=12
    elif (( width > 36 )); then
      width=36
    fi
  else
    width=24
  fi
  filled=$(( pct * width / 100 ))
  wave=$(( TICK % width ))
  bar=""

  for (( i=0; i<width; i++ )); do
    if (( i == wave )); then
      bar+="~"
    elif (( i < filled )); then
      bar+="#"
    else
      bar+="-"
    fi
  done

  printf "%s|%d" "$bar" "$pct"
}

render_interactive() {
  local built bar pct elapsed
  built="$(build_bar)"
  bar="${built%|*}"
  pct="${built##*|}"
  elapsed=$(( $(date +%s) - START_TS ))
  printf "\r  Initializing local stack and downloading model... [%s] %3d%%  t+%02ds" "$bar" "$pct" "$elapsed"
}

render_non_interactive() {
  if (( NON_INTERACTIVE_NOTIFIED == 0 )); then
    printf "[setup-ui] Running in compact mode (non-interactive terminal). Following log: %s\n" "$LOG_FILE"
    NON_INTERACTIVE_NOTIFIED=1
  fi
}

if (( IS_INTERACTIVE == 1 )); then
  print_banner
fi

while kill -0 "$SETUP_PID" 2>/dev/null; do
  if (( IS_INTERACTIVE == 1 )); then
    render_interactive
  else
    render_non_interactive
  fi
  TICK=$(( TICK + 1 ))
  sleep 0.15
done

wait "$SETUP_PID"
RC=$?

if (( IS_INTERACTIVE == 1 )); then
  printf "\n\n"
fi
if (( RC == 0 )); then
  printf "  CHRISTOPHER IS READY\n\n"
  printf "  [####################################################] 100%%\n\n"
  printf "  Open the app:\n"
  printf "  Secure URL : https://%s:3001\n" "$HOST_IP"
  printf "  Fallback   : http://%s:3002\n\n" "$HOST_IP"
  printf "  Full setup log:\n"
  printf "  %s\n\n" "$LOG_FILE"
  printf "  Tip: You can minimize this terminal; it remains available for developer diagnostics.\n"
else
  printf "  CHRISTOPHER SETUP FAILED (exit %d)\n\n" "$RC"
  printf "  Check log:\n"
  printf "  %s\n\n" "$LOG_FILE"
  printf "  Last output:\n"
  tail -n 25 "$LOG_FILE" 2>/dev/null
  exit "$RC"
fi
