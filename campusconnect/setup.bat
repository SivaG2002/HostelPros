@echo off
echo =====================================
echo Django Project - First Time Setup
echo =====================================

echo Creating virtual environment...
cd /d "%~dp0"
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Upgrading pip...
python -m pip install --upgrade pip

echo Installing dependencies...
pip install -r requirements.txt

echo Applying migrations...
python manage.py migrate

echo Collecting static files...
python manage.py collectstatic --noinput

echo Creating default superuser if not exists...


echo Creating fresh admin user...

python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); User.objects.filter(username='admin').delete(); User.objects.create_superuser('admin','a@gmail.com','admin123')"
echo Starting server...
start "" cmd /k python manage.py runserver

timeout /t 3 >nul
start http://127.0.0.1:8000/admin

echo =====================================
echo Setup Completed Successfully
echo =====================================

pause
