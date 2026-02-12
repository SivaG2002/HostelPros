@echo off
echo ====================================
echo  Building HostelPro Project
echo ====================================

echo.
echo Installing Frontend Dependencies...
cd index
call npm install

echo.
echo Building Next.js Frontend...
call npm run build

echo.
echo Going back to root...
cd ..

echo.
echo Creating Python Virtual Environment...
python -m venv venv

echo.
echo Activating Virtual Environment...
call venv\Scripts\activate

echo.
echo Installing Backend Dependencies...
pip install -r requirement.txt

echo.
echo ====================================
echo  Build Completed Successfully
echo ====================================
pause
