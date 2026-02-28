@echo off
title Django Project Launcher

echo ==========================================
echo        Django Project Auto Launcher
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python is not installed.
    echo Please install Python from https://www.python.org/
    pause
    exit
)

cd campusconnect

REM Activate virtual environment
call venv\Scripts\activate

echo.
echo Starting Django development server...
echo.

REM Start server in background
start "" cmd /k python manage.py runserver

REM Wait for server to start
timeout /t 3 >nul

set URL=http://localhost:8000/

REM Check common Chrome install locations
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%URL%"
    goto end
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%URL%"
    goto end
)

REM If Chrome not found, open in default browser
start "" "%URL%"

:end
pause