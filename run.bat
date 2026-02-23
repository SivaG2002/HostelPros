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
cd ..
cd hostel-static

cd ..
cd campusconnect
REM Open browser
start http://127.0.0.1:5500/hostel-static/index.html
REM Run server
python manage.py runserver




pause