-- SQLite migration for users, articles, connections and security_events
-- Date: 2025-10-04

PRAGMA foreign_keys = ON;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
  email TEXT NOT NULL,
  username TEXT,
  display_name TEXT,
  password_hash TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  is_active INTEGER DEFAULT 1,
  email_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (lower(email));
CREATE INDEX IF NOT EXISTS idx_users_username ON users (lower(username));

-- ARTICLES
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  status TEXT DEFAULT 'draft',
  tags TEXT DEFAULT '[]', -- store JSON as text
  views_count INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_unique ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles (author_id);

-- CONNECTIONS
CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
  requester_id TEXT NOT NULL,
  addressee_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  responded_at TEXT,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections (requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addressee ON connections (addressee_id);

-- SECURITY EVENTS
CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)))),
  user_id TEXT,
  event_type TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  details TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events (user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events (event_type);

-- Trigger to update updated_at on row update
CREATE TRIGGER IF NOT EXISTS users_updated_at_trigger
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS articles_updated_at_trigger
AFTER UPDATE ON articles
FOR EACH ROW
BEGIN
  UPDATE articles SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS connections_updated_at_trigger
AFTER UPDATE ON connections
FOR EACH ROW
BEGIN
  UPDATE connections SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Prevent self-connections via trigger
CREATE TRIGGER IF NOT EXISTS connections_no_self
BEFORE INSERT ON connections
FOR EACH ROW
BEGIN
  SELECT CASE WHEN NEW.requester_id = NEW.addressee_id THEN RAISE(ABORT, 'requester and addressee cannot be the same') END;
END;
