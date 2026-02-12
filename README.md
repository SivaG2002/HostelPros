# Hostel Management System – Setup Guide

If you have any queries or doubts feel free to text me on Whatsapp

```+91 6282684814```

## 1. Prerequisites (Install Manually)

Install the following software before starting:

- **MySQL**  
  Download: https://dev.mysql.com/downloads/file/?id=548821  
  After installation:
  - Set MySQL `bin` path in Environment Variables  
  - Remember your MySQL root password  

- **Python**  
  Download and install the latest stable version from: https://www.python.org/downloads/  
  - Ensure `python` is added to Environment Variables  

---

## 2. Node.js Installation (If Not Installed)

If Node.js is not installed:

Run:
```
nodejs.bat
```

This will:
- Install Node.js  
- Automatically set the Environment Variable  

---

## 3. Database Setup

After successfully installing MySQL:

### Step 1: Run Setup Script

Run:
```
run.bat
```

- It will prompt for your MySQL password.  
- This will create the required database and tables.  

### Step 2: Update MySQL Password in Backend

Open:

```
engine\main.py
```

Modify the `DB_CONFIG` section:

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_mysql_password",
    "database": "hostel_db"
}
```

Replace `"your_mysql_password"` with your actual MySQL root password.

---

## 4. Build Project (One-Time Setup)

After database configuration:

Run:
```
build.bat
```

This will:
- Install Node.js dependencies  
- Install Python packages  

You do not need to run this every time.

---

## 5. Run the Application

To execute the program:

Run:

```
run.vbs
```

This will start:
- Backend (Python)  
- Frontend (Node)  
- Open the application automatically  

---

## Notes

- Perform installation and build steps only once.  
- Always ensure MySQL service is running before executing the project.  
- If any error occurs, verify:
  - MySQL path is set correctly  
  - Python path is set correctly  
  - Correct password is updated in `main.py`  
