@echo off
echo ========================================
echo  Multi-Agent Orchestrator - Frontend
echo ========================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes on first run.
    call npm install
)

echo.
echo Starting React development server...
echo Frontend will be available at: http://localhost:3000
echo.

call npm start

pause
