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

-- ADMIN
INSERT INTO users (name,email,password_hash,role)
VALUES ('Admin','admin@hostel.com','admin123','admin');

-- ROOMS
INSERT INTO rooms (roomNo,capacity,occupied) VALUES
('A101',3,2),
('A102',3,3),
('A103',2,1),
('A104',2,0),
('A105',4,0),
('A106',3,0),
('A107',2,0);

-- STUDENTS USERS
INSERT INTO users (name,email,password_hash,role) VALUES
('Fathima','s1@mail.com','123','student'),
('Rahul','s2@mail.com','123','student'),
('Akhil','s3@mail.com','123','student'),
('Meera','s4@mail.com','123','student'),
('Nikhil','s5@mail.com','123','student'),
('Arjun','s6@mail.com','123','student'),
('Diya','s7@mail.com','123','student'),
('Vivek','s8@mail.com','123','student'),
('Anjali','s9@mail.com','123','student'),
('Kiran','s10@mail.com','123','student'),
('Riya','s11@mail.com','123','student'),
('Manu','s12@mail.com','123','student'),
('Sneha','s13@mail.com','123','student');

-- STUDENT DETAILS
INSERT INTO students (user_id,rollNo,dept,year,phone,room_id) VALUES
(2,'CS001','CSE',3,'9000000001',1),
(3,'CS002','CSE',3,'9000000002',1),
(4,'CS003','CSE',2,'9000000003',3),
(5,'CS004','CSE',2,'9000000004',2),
(6,'CS005','ECE',3,'9000000005',2),
(7,'CS006','ECE',1,'9000000006',2),
(8,'CS007','EEE',2,'9000000007',3),
(9,'CS008','EEE',3,'9000000008',NULL),
(10,'CS009','ME',1,'9000000009',NULL),
(11,'CS010','ME',2,'9000000010',NULL),
(12,'CS011','CIVIL',4,'9000000011',NULL),
(13,'CS012','CSE',2,'9000000012',NULL),
(14,'CS013','ECE',1,'9000000013',NULL);

-- FEES
INSERT INTO fees (studentId,amount,due_date,status) VALUES
(2,50000,'2026-03-01','unpaid'),
(3,48000,'2026-03-01','paid'),
(4,47000,'2026-03-01','unpaid'),
(5,52000,'2026-03-01','paid'),
(6,51000,'2026-03-01','unpaid'),
(7,46000,'2026-03-01','paid'),
(8,53000,'2026-03-01','unpaid'),
(9,49000,'2026-03-01','paid'),
(10,50000,'2026-03-01','unpaid'),
(11,48000,'2026-03-01','paid'),
(12,47000,'2026-03-01','unpaid'),
(13,52000,'2026-03-01','paid'),
(14,50000,'2026-03-01','unpaid');

-- PAYMENTS (sample history)
INSERT INTO payments (studentId,amount,payment_date) VALUES
(3,48000,'2026-01-10'),
(5,52000,'2026-01-12'),
(7,46000,'2026-01-14'),
(9,49000,'2026-01-15'),
(11,48000,'2026-01-18'),
(13,52000,'2026-01-20');

-- NOTICES
INSERT INTO notices (title,content,summary) VALUES
('Hostel Meeting','There will be a hostel meeting on Monday at 5 PM in the auditorium.','Mandatory meeting regarding hostel rules.'),
('Water Maintenance','Water supply will be interrupted tomorrow from 10 AM to 2 PM.','Temporary water shutdown notice.');

-- COMPLAINTS
INSERT INTO complaints (student_id,title,description,status) VALUES
(2,'Water Issue','No water in bathroom','pending'),
(4,'Fan Not Working','Ceiling fan is not working','in_progress'),
(6,'Light Problem','Tube light flickering','resolved');