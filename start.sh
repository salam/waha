#!/usr/bin/env bash
# WAHA (WhatsApp HTTP API) — production startup (no Docker)
cd "$(dirname "$0")"

# Load environment
if [[ -f .env.production ]]; then
  export $(grep -v '^#' .env.production | xargs)
fi

# Defaults
export WHATSAPP_DEFAULT_ENGINE="${WHATSAPP_DEFAULT_ENGINE:-NOWEB}"
export WAHA_WORKER_TYPE="${WAHA_WORKER_TYPE:-LOCAL}"

# Ensure session directory exists
mkdir -p .sessions

# Start WAHA
exec node dist/main.js
