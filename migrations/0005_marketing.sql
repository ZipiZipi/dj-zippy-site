-- Phase 3/4 migration: marketing modules (lead magnet, site settings, video teasers).
-- Additive only (no data loss). Run ONCE per database (local, then remote).
-- If a column/table already exists, that single statement will error — safe to ignore.

-- Newsletter / lead-magnet subscribers ("Unlock unreleased mixes")
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'site',          -- inline | popup | other campaign tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at);

-- Simple key/value site settings (hero teaser video, future toggles)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Higgsfield teaser pipeline state on events
ALTER TABLE events ADD COLUMN teaser_status TEXT DEFAULT 'none';  -- none | pending | done | skipped
ALTER TABLE events ADD COLUMN teaser_video_url TEXT;
ALTER TABLE events ADD COLUMN teaser_poster_url TEXT;
