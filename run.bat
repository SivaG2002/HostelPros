@echo off

echo Running Scripts ....

timeout /t 3 >nul

echo Creating database ...

timeout /t 3 >nul
mysql -u root -p < database_setup.sql

if %errorlevel% equ 0 (
    echo [32mDatabase created successfully![0m
) else (
    echo [31mFailed to create database.[0m
)



pause
