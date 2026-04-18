@echo off
echo ========================================
echo  Multi-Agent Orchestrator - Backend
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

python main.py

pause
