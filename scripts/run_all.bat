@echo off
echo ========================================================
echo Launching Full FarmPulse AI Platform (Backend + Frontend)
echo ========================================================
cd /d "%~dp0\.."
start "FarmPulse AI Backend" cmd /k ".\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak >nul
start "FarmPulse AI Frontend" cmd /k "cd frontend && npm.cmd run dev"
echo Backend running at http://127.0.0.1:8000
echo Frontend running at http://localhost:5173
