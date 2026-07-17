#!/usr/bin/env bash
# Start LogIQ UI + backend together.
# Frontend alone is not enough — login needs the API on :8000.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="${LOGIQ_BACKEND_DIR:-$ROOT/../log-analysis-AI-agent}"
API_URL="${VITE_API_BASE_URL:-http://127.0.0.1:8000}"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if ! curl -sf -o /dev/null --max-time 2 "${API_URL%/}/docs"; then
  if [[ ! -d "$BACKEND_DIR" ]]; then
    echo "Backend not running at $API_URL and directory not found:"
    echo "  $BACKEND_DIR"
    echo "Set LOGIQ_BACKEND_DIR or start uvicorn yourself:"
    echo "  cd ../log-analysis-AI-agent && source .venv/bin/activate && uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload"
    exit 1
  fi
  echo "Starting backend at $API_URL ..."
  (
    cd "$BACKEND_DIR"
    # shellcheck disable=SC1091
    source .venv/bin/activate
    exec uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
  ) &
  BACKEND_PID=$!
  for _ in $(seq 1 40); do
    if curl -sf -o /dev/null --max-time 1 "${API_URL%/}/docs"; then
      echo "Backend ready."
      break
    fi
    sleep 0.5
  done
  if ! curl -sf -o /dev/null --max-time 2 "${API_URL%/}/docs"; then
    echo "Backend did not become ready on $API_URL"
    exit 1
  fi
else
  echo "Backend already running at $API_URL"
fi

cd "$ROOT"
echo "Starting frontend at http://localhost:5173/ ..."
npm run dev
