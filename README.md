#!/bin/bash
echo "🚀 Starting PRISMO backend..."
cd "$(dirname "$0")/backend"

# Create venv if needed
if [ ! -d ".venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt -q

echo "✅ Starting API on http://localhost:8000"
uvicorn main:app --reload --port 8000
