-- ១. បង្កើត Database ឈ្មោះថា my_app_db
CREATE DATABASE IF NOT EXISTS my_app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ២. ចូលទៅប្រើប្រាស់ Database នោះ
USE my_app_db;

-- ៣. បង្កើតតារាង users សម្រាប់ផ្ទុកគណនី
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- ១. បង្កើតតារាងបញ្ជីទំនាក់ទំនងសន្ទនា
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preview VARCHAR(255),
    time VARCHAR(50),
    unread INT DEFAULT 0
);

-- ២. បង្កើតតារាងរក្សាទុកប្រវត្តិនៃសារនីមួយៗ
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- ៣. បញ្ចូលទិន្នន័យគំរូដើម្បីតេស្ត (Optional)
INSERT INTO conversations (name, email, preview, time, unread) VALUES 
('Alex Johnson', 'alex@example.com', 'The latest dashboard numbers are ready.', '09:42', 2),
('Olivia Martin', 'olivia@example.com', 'Can we move the client call to tomorrow?', 'Yesterday', 0);

INSERT INTO messages (conversation_id, author, text, time) VALUES 
(1, 'Alex Johnson', 'The latest dashboard numbers are ready.', '09:42'),
(1, 'You', 'Great, I will review them this morning.', '09:47'),
(2, 'Olivia Martin', 'Can we move the client call to tomorrow?', 'Yesterday');
