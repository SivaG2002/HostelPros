@echo off
echo =====================================
echo Django Project - First Time Setup
echo =====================================

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo Applying migrations...
python manage.py migrate

echo Collecting static files...
python manage.py collectstatic --noinput


echo.
echo Creating default superuser...

REM ---- AUTO SUPERUSER SECTION ----
set DJANGO_SUPERUSER_USERNAME=admin
set DJANGO_SUPERUSER_EMAIL=admin@gmail.com
set DJANGO_SUPERUSER_PASSWORD=admin123

python manage.py createsuperuser --noinput
start http://127.0.0.1:8000/admin
python manage.py runserve

echo =====================================
echo Setup Completed Successfully
echo You can now run run_project.bat
echo =====================================

pause