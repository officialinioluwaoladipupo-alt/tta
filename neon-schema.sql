CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  photo_public_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL DEFAULT '',
  actor_roles TEXT[] NOT NULL DEFAULT '{}',
  action TEXT NOT NULL,
  content_type TEXT NOT NULL,
  record_id TEXT,
  changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe forward-compatible migrations for databases created from an older schema.
-- These statements only add missing structures; they do not delete or overwrite data.
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS event_id TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE events ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE highlights ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE highlights ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE programs ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE settings ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT '';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_public_id TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_public_id TEXT;
ALTER TABLE highlights ADD COLUMN IF NOT EXISTS image_public_id TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS default_seo_image_public_id TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_email TEXT NOT NULL DEFAULT '';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_roles TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action TEXT NOT NULL DEFAULT 'update';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS record_id TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS changes JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS submissions_created_at_idx ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_type_email_idx ON submissions (type, lower(email));
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS highlights_created_at_idx ON highlights (created_at DESC);
CREATE INDEX IF NOT EXISTS team_members_order_idx ON team_members (sort_order, created_at);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_content_record_idx ON audit_logs (content_type, record_id);

UPDATE team_members SET photo_public_id = regexp_replace(regexp_replace(split_part(photo_url, '/upload/', 2), '^(.*/)?v[0-9]+/', ''), '\\.[^.]+$', '') WHERE photo_public_id IS NULL AND photo_url LIKE '%/upload/%';
UPDATE events SET cover_public_id = regexp_replace(regexp_replace(split_part(data->>'image', '/upload/', 2), '^(.*/)?v[0-9]+/', ''), '\\.[^.]+$', '') WHERE cover_public_id IS NULL AND data->>'image' LIKE '%/upload/%';
UPDATE highlights SET image_public_id = regexp_replace(regexp_replace(split_part(data->>'image', '/upload/', 2), '^(.*/)?v[0-9]+/', ''), '\\.[^.]+$', '') WHERE image_public_id IS NULL AND data->>'image' LIKE '%/upload/%';
UPDATE settings SET default_seo_image_public_id = regexp_replace(regexp_replace(split_part(data->>'defaultSeoImage', '/upload/', 2), '^(.*/)?v[0-9]+/', ''), '\\.[^.]+$', '') WHERE default_seo_image_public_id IS NULL AND data->>'defaultSeoImage' LIKE '%/upload/%';

DO $$
BEGIN
  BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS submissions_newsletter_email_unique_idx
      ON submissions (lower(email))
      WHERE type = 'newsletter';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'duplicate newsletter emails exist, run the dedupe query first';
  END;
END $$;
