-- Migration: create schema for users, articles, connections and security events
-- Date: 2025-10-04

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- for trigram indexes if needed

-- Helper function to maintain updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- USERS
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  username text,
  display_name text,
  password_hash text, -- store bcrypt/argon2 hashes, never plain text
  bio text,
  avatar_url text,
  role text DEFAULT 'user',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.users
  ADD CONSTRAINT users_email_unique UNIQUE (lower(email));

CREATE INDEX idx_users_username ON public.users (lower(username));
CREATE INDEX idx_users_created_at ON public.users (created_at);

-- ARTICLES
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content text,
  excerpt text,
  status text DEFAULT 'draft', -- draft|published|archived
  tags jsonb DEFAULT '[]'::jsonb,
  views_count int DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.articles
  ADD CONSTRAINT articles_slug_unique UNIQUE (slug);

CREATE INDEX idx_articles_author ON public.articles (author_id);
CREATE INDEX idx_articles_published_at ON public.articles (published_at);

-- Full-text search vector (Portuguese + fallback to simple search)
ALTER TABLE public.articles
  ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('pg_catalog.english', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(content,'')), 'B')
  ) STORED;

CREATE INDEX idx_articles_search_vector ON public.articles USING GIN (search_vector);

-- CONNECTIONS (social graph / friendships)
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending|accepted|rejected|blocked
  created_at timestamptz DEFAULT now() NOT NULL,
  responded_at timestamptz
);

-- Prevent duplicate pairs in either direction (enforce ordered pair)
ALTER TABLE public.connections
  ADD CONSTRAINT connections_no_self CHECK (requester_id <> addressee_id);

CREATE UNIQUE INDEX connections_unique_pair_idx ON public.connections (LEAST(requester_id, addressee_id), GREATEST(requester_id, addressee_id));
CREATE INDEX idx_connections_requester ON public.connections (requester_id);
CREATE INDEX idx_connections_addressee ON public.connections (addressee_id);

-- SECURITY / AUDIT LOGS
CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  event_type text NOT NULL, -- login, logout, password_change, failed_login, permission_change, etc.
  ip inet,
  user_agent text,
  details jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_security_events_user ON public.security_events (user_id);
CREATE INDEX idx_security_events_event_type ON public.security_events (event_type);
CREATE INDEX idx_security_events_created_at ON public.security_events (created_at);

-- Triggers to keep updated_at current
CREATE TRIGGER trg_users_set_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trg_articles_set_timestamp BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trg_connections_set_timestamp BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Row-level security (RLS) placeholders: enable RLS but leave policies to be defined by application needs
-- Note: enabling RLS will restrict access; define policies in Supabase or application as needed.
-- Uncomment the following lines if you plan to manage policies immediately.
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Best-practice notes (not executed):
-- 1) Store password hashes using a strong algorithm (bcrypt/argon2) and never store plaintext passwords.
-- 2) Log security-relevant events in `security_events` (failed logins, password resets, suspicious IPs).
-- 3) Consider rate-limiting endpoints that trigger security events and store counters for anomaly detection.
-- 4) Limit sensitive columns via RLS policies so users can only access their own data.

COMMIT;
