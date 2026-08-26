-- For phpMyAdmin imports, use database.sql in the project root.
-- This file contains historical setup notes and one-time migration statements.

-- ១. បង្កើត Database ឈ្មោះថា my_app_db
CREATE DATABASE IF NOT EXISTS my_app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ២. ចូលទៅប្រើប្រាស់ Database នោះ
USE my_app_db;

-- ៣. បង្កើតតារាង users សម្រាប់ផ្ទុកគណនី
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cover_image LONGTEXT,
    description TEXT,
    skills VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Run these statements once if the users table already existed before Profile Settings was added.
ALTER TABLE users ADD COLUMN cover_image LONGTEXT NULL;
ALTER TABLE users ADD COLUMN description TEXT NULL;
ALTER TABLE users ADD COLUMN skills VARCHAR(500) NULL;




-- ១. បង្កើតតារាងបញ្ជីទំនាក់ទំនងសន្ទនា
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar LONGTEXT,
    customer_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    preview VARCHAR(255),
    time VARCHAR(50),
    unread INT DEFAULT 0
);

-- Run these statements once if the conversations table already existed.
ALTER TABLE conversations ADD COLUMN phone VARCHAR(50) NULL;
ALTER TABLE conversations ADD COLUMN avatar LONGTEXT NULL;
ALTER TABLE conversations ADD COLUMN customer_id VARCHAR(100) NULL;
ALTER TABLE conversations ADD COLUMN status VARCHAR(50) DEFAULT 'Active';

-- ២. បង្កើតតារាងរក្សាទុកប្រវត្តិនៃសារនីមួយៗ
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    attachment_name VARCHAR(255),
    attachment_data LONGTEXT,
    reply_to_id INT NULL,
    edited_at DATETIME NULL,
    deleted_at DATETIME NULL,
    read_at DATETIME NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Run these statements once if the messages table already existed.
ALTER TABLE messages ADD COLUMN attachment_name VARCHAR(255) NULL;
ALTER TABLE messages ADD COLUMN attachment_data LONGTEXT NULL;
ALTER TABLE messages ADD COLUMN reply_to_id INT NULL;
ALTER TABLE messages ADD COLUMN edited_at DATETIME NULL;
ALTER TABLE messages ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE messages ADD COLUMN read_at DATETIME NULL;

-- ៣. បញ្ចូលទិន្នន័យគំរូដើម្បីតេស្ត (Optional)
INSERT INTO conversations (name, email, phone, customer_id, status, preview, time, unread) VALUES 
('Alex Johnson', 'alex@example.com', '+1 555-0101', 'CUS-001', 'Active', 'The latest dashboard numbers are ready.', '09:42', 2),
('Olivia Martin', 'olivia@example.com', '+1 555-0102', 'CUS-002', 'Active', 'Can we move the client call to tomorrow?', 'Yesterday', 0);

INSERT INTO messages (conversation_id, author, text, time) VALUES 
(1, 'Alex Johnson', 'The latest dashboard numbers are ready.', '09:42'),
(1, 'You', 'Great, I will review them this morning.', '09:47'),
(2, 'Olivia Martin', 'Can we move the client call to tomorrow?', 'Yesterday');
