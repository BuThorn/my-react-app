-- Import this file in phpMyAdmin to create the My React App database.
-- This script is for a new installation. It does not delete existing data.

CREATE DATABASE IF NOT EXISTS my_app_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE my_app_db;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cover_image LONGTEXT NULL,
    description TEXT NULL,
    skills VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS team_members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS conversations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    avatar LONGTEXT NULL,
    customer_id VARCHAR(100) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    preview VARCHAR(255) NULL,
    `time` VARCHAR(50) NULL,
    unread INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT UNSIGNED NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    `time` VARCHAR(50) NOT NULL,
    attachment_name VARCHAR(255) NULL,
    attachment_data LONGTEXT NULL,
    reply_to_id INT UNSIGNED NULL,
    edited_at DATETIME NULL,
    deleted_at DATETIME NULL,
    read_at DATETIME NULL,
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_reply
        FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_messages_conversation_id (conversation_id),
    INDEX idx_messages_reply_to_id (reply_to_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
