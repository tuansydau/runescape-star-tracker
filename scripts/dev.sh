#!/usr/bin/env bash
set -euo pipefail

port="${PORT:-3000}"

while lsof -i ":${port}" -sTCP:LISTEN >/dev/null 2>&1; do
  if [ "${port}" -eq "${PORT:-3000}" ]; then
    echo "Port ${port} is in use, trying the next port..."
  fi
  port=$((port + 1))
done

echo "Starting dev server on http://localhost:${port}"
exec next dev --turbopack -p "${port}"
