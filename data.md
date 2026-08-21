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
