-- MySQL compatible migration for users, articles, connections and security events
-- Date: 2025-10-04

-- Note: MySQL lacks some Postgres features (tsvector, pgcrypto). This script uses UUIDs via CHAR(36) and functions like UUID().

CREATE DATABASE IF NOT EXISTS starlab;
USE starlab;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  email VARCHAR(320) NOT NULL,
  username VARCHAR(100),
  display_name VARCHAR(200),
  password_hash VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(1024),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  updated_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE UNIQUE INDEX users_email_unique ON users ((LOWER(email)));
CREATE INDEX idx_users_username ON users ((LOWER(username)));
CREATE INDEX idx_users_created_at ON users (created_at);

-- ARTICLES
CREATE TABLE IF NOT EXISTS articles (
  id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  author_id CHAR(36) NOT NULL,
  title TEXT NOT NULL,
  slug VARCHAR(300) NOT NULL,
  content LONGTEXT,
  excerpt TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  tags JSON DEFAULT (JSON_ARRAY()),
  views_count INT DEFAULT 0,
  published_at DATETIME(6),
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  updated_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX articles_slug_unique ON articles (slug);
CREATE INDEX idx_articles_author ON articles (author_id);
CREATE INDEX idx_articles_published_at ON articles (published_at);

-- CONNECTIONS
CREATE TABLE IF NOT EXISTS connections (
  id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  requester_id CHAR(36) NOT NULL,
  addressee_id CHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  responded_at DATETIME(6),
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Prevent identical pairs in either direction: enforced by application logic or a trigger. Here's a unique constraint on an ordered pair using LEAST/GREATEST is not available in MySQL; implement via trigger or normalized "connection_pair" column.
CREATE UNIQUE INDEX connections_unique_pair_idx ON connections (requester_id, addressee_id);
CREATE INDEX idx_connections_requester ON connections (requester_id);
CREATE INDEX idx_connections_addressee ON connections (addressee_id);

-- SECURITY EVENTS
CREATE TABLE IF NOT EXISTS security_events (
  id CHAR(36) PRIMARY KEY NOT NULL DEFAULT (UUID()),
  user_id CHAR(36),
  event_type VARCHAR(100) NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  details JSON,
  created_at DATETIME(6) DEFAULT (CURRENT_TIMESTAMP(6)),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_security_events_user ON security_events (user_id);
CREATE INDEX idx_security_events_event_type ON security_events (event_type);
CREATE INDEX idx_security_events_created_at ON security_events (created_at);

-- Notes:
-- 1) MySQL does not support case-insensitive unique constraint on lower(email) directly; depending on collation, email columns may be case-insensitive (utf8mb4_general_ci). Adjust if necessary.
-- 2) Use application-level checks to prevent self-connections and duplicate pairs if required.
-- 3) Store password hashes (bcrypt/argon2) in `password_hash`.

-- Optional: trigger to prevent self-connections
DELIMITER $$
CREATE TRIGGER trg_connections_no_self BEFORE INSERT ON connections
FOR EACH ROW
BEGIN
  IF NEW.requester_id = NEW.addressee_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'requester and addressee cannot be the same';
  END IF;
END$$
DELIMITER ;
