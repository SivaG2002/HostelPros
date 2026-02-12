CREATE DATABASE IF NOT EXISTS hostel_db;
USE hostel_db;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','student') NOT NULL
);

-- =========================
-- ROOMS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomNo VARCHAR(20),
    capacity INT DEFAULT 0,
    occupied INT DEFAULT 0
);

-- =========================
-- STUDENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS students (
    user_id INT PRIMARY KEY,
    rollNo VARCHAR(20) NOT NULL UNIQUE,
    dept VARCHAR(50),
    year INT,
    phone VARCHAR(15),
    room_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- =========================
-- FEES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid','unpaid') DEFAULT 'unpaid',
    payment_date DATE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- PAYMENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    amount DECIMAL(10,2),
    payment_date DATE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- COMPLAINTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending','in_progress','resolved') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- NOTICES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ALLOCATIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    roomId INT,
    bedNo INT,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roomId) REFERENCES rooms(id) ON DELETE CASCADE
);


-- SAMPLE ADMIN
INSERT INTO users (name,email,password_hash,role)
VALUES ('Admin','admin@hostel.com','admin123','admin')
ON DUPLICATE KEY UPDATE email=email;

-- SAMPLE STUDENT
INSERT INTO users (name,email,password_hash,role)
VALUES ('Student One','student1@hostel.com','123','student')
ON DUPLICATE KEY UPDATE email=email;