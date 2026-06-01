-- Phase 1 migration: extend events for Past Highlights + stable slugs.
-- Additive only (no data loss). Run ONCE per database (local, then remote).
-- If a column already exists, that single statement will error — safe to ignore.

ALTER TABLE events ADD COLUMN featured INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN slug TEXT;
ALTER TABLE events ADD COLUMN country TEXT DEFAULT 'RS';

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
