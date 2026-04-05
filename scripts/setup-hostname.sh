#!/usr/bin/env bash
set -euo pipefail

HOST_IP="${1:-}"
HOSTNAME="${2:-christopher.home.arpa}"

if [[ -z "${HOST_IP}" ]]; then
  echo "Usage: sudo bash ./scripts/setup-hostname.sh <host_ip> [hostname]"
  echo "Example: sudo bash ./scripts/setup-hostname.sh <host-ip> christopher.home.arpa"
  exit 1
fi

if ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required."
  exit 1
fi

ENTRY="${HOST_IP} ${HOSTNAME}"

if grep -qE "[[:space:]]${HOSTNAME}(\s|$)" /etc/hosts; then
  sudo sed -i.bak "/[[:space:]]${HOSTNAME}\(\s\|$\)/d" /etc/hosts
fi

if ! grep -qF "${ENTRY}" /etc/hosts; then
  echo "${ENTRY}" | sudo tee -a /etc/hosts >/dev/null
fi

echo "Updated /etc/hosts with: ${ENTRY}"
echo "Verify with: getent hosts ${HOSTNAME}"