@echo off
echo ========================================================
echo Starting FarmPulse AI FastAPI Backend Server
echo API Base URL: http://127.0.0.1:8000
echo OpenAPI Docs: http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0\.."
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
