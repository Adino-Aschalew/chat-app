-- ChatApp MySQL schema (InnoDB, utf8mb4)
CREATE DATABASE IF NOT EXISTS chatapp 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE chatapp;

SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ======================
-- USERS
-- ======================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(160) NULL,
  profile_photo VARCHAR(255) NULL,
  is_online TINYINT(1) NOT NULL DEFAULT 0,
  last_seen_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username),
  KEY ix_users_online (is_online, last_seen_at)
) ENGINE=InnoDB;

-- USER SETTINGS
-- ======================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id BIGINT UNSIGNED NOT NULL,
  theme ENUM('dark','light') NOT NULL DEFAULT 'dark',
  notifications_enabled TINYINT(1) NOT NULL DEFAULT 1,
  privacy_last_seen ENUM('everyone','contacts','nobody') NOT NULL DEFAULT 'everyone',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- CHATS
-- ======================
CREATE TABLE IF NOT EXISTS chats (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type ENUM('private','group') NOT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_chats_type (type),
  KEY ix_chats_updated (updated_at),
  CONSTRAINT fk_chats_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- GROUP INFO (only for group chats)
-- ======================
CREATE TABLE IF NOT EXISTS group_info (
  chat_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  photo VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id),
  CONSTRAINT fk_group_info_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- CHAT MEMBERS
-- ======================
CREATE TABLE IF NOT EXISTS chat_members (
  chat_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('admin','member') NOT NULL DEFAULT 'member',
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id, user_id),
  KEY ix_chat_members_user (user_id),
  CONSTRAINT fk_chat_members_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGES
-- ======================
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chat_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  body TEXT NULL,
  status ENUM('sent','delivered','read') NOT NULL DEFAULT 'sent',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_messages_chat (chat_id, created_at),
  KEY ix_messages_sender (sender_id),
  CONSTRAINT fk_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE MEDIA
-- ======================
CREATE TABLE IF NOT EXISTS message_media (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id BIGINT UNSIGNED NOT NULL,
  media_type ENUM('image','video','file') NOT NULL,
  url_path VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NULL,
  mime_type VARCHAR(120) NULL,
  size_bytes BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_message_media_message (message_id),
  CONSTRAINT fk_message_media_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE READS (per-user receipts)
-- ======================
CREATE TABLE IF NOT EXISTS message_reads (
  message_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  KEY ix_message_reads_user (user_id),
  CONSTRAINT fk_message_reads_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_reads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE REACTIONS
-- ======================
CREATE TABLE IF NOT EXISTS message_reactions (
  message_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  reaction VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  CONSTRAINT fk_reactions_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SAMPLE USERS
INSERT INTO users (username, email, password_hash, status, is_online, last_seen_at) VALUES
('alice_johnson', 'alice.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Available for chat', 1, NOW()),
('bob_smith', 'bob.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Working from home', 1, NOW()),
('charlie_brown', 'charlie.brown@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'In a meeting', 0, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('diana_wilson', 'diana.wilson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Busy coding', 1, NOW()),
('ethan_davis', 'ethan.davis@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Away from keyboard', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('fiona_miller', 'fiona.miller@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Available', 1, NOW()),
('george_taylor', 'george.taylor@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'On lunch break', 0, DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
('hannah_anderson', 'hannah.anderson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'In a call', 0, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('ian_thomas', 'ian.thomas@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Working remotely', 1, NOW()),
('julia_jackson', 'julia.jackson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', 'Available for chat', 1, NOW());

-- SAMPLE USER SETTINGS
INSERT INTO user_settings (user_id, theme, notifications_enabled, privacy_last_seen) VALUES
(1, 'dark', 1, 'everyone'),
(2, 'light', 1, 'contacts'),
(3, 'dark', 0, 'nobody'),
(4, 'dark', 1, 'everyone'),
(5, 'light', 1, 'contacts'),
(6, 'dark', 1, 'everyone'),
(7, 'light', 0, 'nobody'),
(8, 'dark', 1, 'contacts'),
(9, 'dark', 1, 'everyone'),
(10, 'light', 1, 'contacts');

-- SAMPLE CHATS (private and group)
INSERT INTO chats (type, created_by) VALUES
('private', 1),
('private', 2),
('group', 1),
('group', 3);

-- SAMPLE GROUP INFO
INSERT INTO group_info (chat_id, name, photo) VALUES
(3, 'Team Chat', 'https://picsum.photos/seed/team/200/200'),
(4, 'Project Updates', 'https://picsum.photos/seed/project/200/200');

-- SAMPLE CHAT MEMBERS
INSERT INTO chat_members (chat_id, user_id, role) VALUES
-- Private chats
(1, 1, 'admin'),
(1, 2, 'member'),
(2, 1, 'admin'),
(2, 3, 'member'),
-- Group chats
(3, 1, 'admin'),
(3, 2, 'member'),
(3, 4, 'member'),
(3, 5, 'member'),
(4, 3, 'admin'),
(4, 6, 'member'),
(4, 7, 'member');

-- SAMPLE MESSAGES
INSERT INTO messages (chat_id, sender_id, body, status) VALUES
(1, 2, 'Hey! How are you doing?', 'read'),
(1, 1, 'I am good! Thanks for asking. How about you?', 'read'),
(1, 2, 'Great! Just working on some code.', 'delivered'),
(2, 3, 'Can we schedule a meeting?', 'sent'),
(3, 2, 'Great work everyone!', 'read'),
(3, 4, 'Thanks! It was a team effort.', 'delivered'),
(4, 6, 'New milestone completed', 'read'),
(4, 7, 'Excellent news! 🎉', 'read');

-- ONLINE STATUS MANAGEMENT QUERIES (for reference)

-- Update user online status
-- UPDATE users SET is_online = 1, last_seen_at = NOW() WHERE id = ?;

-- Update user offline status
-- UPDATE users SET is_online = 0, last_seen_at = NOW() WHERE id = ?;

-- Get all online users
-- SELECT id, username, is_online, last_seen_at FROM users WHERE is_online = 1;

-- Get user status with last seen
-- SELECT id, username, is_online, last_seen_at, 
--        CASE WHEN is_online = 1 THEN 'online' 
--             WHEN last_seen_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'recently'
--             ELSE 'offline' 
--        END as status
-- FROM users;

-- Clean up old offline users (last seen more than 30 days ago)
-- DELETE FROM users WHERE is_online = 0 AND last_seen_at < DATE_SUB(NOW(), INTERVAL 30 DAY);