@echo off
echo ========================================
echo  Multi-Agent Orchestrator - Full Setup
echo ========================================
echo.

:: Setup Backend
echo [1/4] Setting up Backend...
cd /d "%~dp0backend"

if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt

:: Setup Frontend
echo.
echo [2/4] Setting up Frontend...
cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo Installing Node.js dependencies...
    echo This may take a few minutes...
    call npm install
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env
echo 2. Add your OpenAI or OpenRouter API key to .env
echo 3. Run run-backend.bat to start the backend
echo 4. Run run-frontend.bat to start the frontend
echo.

pause
