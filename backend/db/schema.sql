-- ChatApp MySQL schema (InnoDB, utf8mb4)
CREATE DATABASE IF NOT EXISTS chatapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chatapp;

SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- USERS
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
  KEY ix_users_username (username),
  KEY ix_users_online (is_online, last_seen_at)
) ENGINE=InnoDB;

-- USER SETTINGS
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
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chat_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  body TEXT NULL,
  status ENUM('sent','delivered','read') NOT NULL DEFAULT 'sent',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_messages_chat (chat_id, id),
  KEY ix_messages_sender (sender_id, created_at),
  CONSTRAINT fk_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE MEDIA
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
  KEY ix_message_media_type (media_type),
  CONSTRAINT fk_message_media_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE READS (per-user receipts)
CREATE TABLE IF NOT EXISTS message_reads (
  message_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  KEY ix_message_reads_user (user_id, read_at),
  CONSTRAINT fk_message_reads_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_reads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MESSAGE REACTIONS
CREATE TABLE IF NOT EXISTS message_reactions (
  message_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  reaction VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  KEY ix_reactions_message (message_id),
  CONSTRAINT fk_reactions_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  CONSTRAINT fk_reactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

