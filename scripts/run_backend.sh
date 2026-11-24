#!/usr/bin/env bash
echo "Starting FarmPulse AI Backend..."
cd "$(dirname "$0")/.."
source .venv/bin/activate 2>/dev/null || true
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
