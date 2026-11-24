@echo off
echo ========================================================
echo Starting FarmPulse AI Vite Frontend Server
echo Frontend URL: http://localhost:5173
echo ========================================================
cd /d "%~dp0\..\frontend"
call npm.cmd run dev
