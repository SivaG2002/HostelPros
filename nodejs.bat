@echo off
echo ==============================
echo Installing Node.js (LTS)
echo ==============================
echo.

:: Check if winget exists
where winget >nul 2>nul
if %errorlevel% neq 0 (
    echo winget is not installed or not available.
    echo Please update Windows or install App Installer from Microsoft Store.
    pause
    exit /b
)

:: Install Node.js LTS
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

echo.
echo ==============================
echo Installation Complete
echo ==============================
echo.

:: Refresh PATH for current session
set PATH=%PATH%;C:\Program Files\nodejs

:: Verify installation
node -v
npm -v

pause
    