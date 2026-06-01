-- Phase 2 migration: switch mixes to the link-model used by the public site.
-- Additive only (no data loss). Run ONCE per database (local, then remote).
-- If a column already exists, that single statement will error — safe to ignore.
-- `cover_image` is reused as the thumbnail URL. `duration`/`bpm`/`audio_url`
-- stay in the schema but are unused by the public pages.

ALTER TABLE mixes ADD COLUMN platform TEXT;
ALTER TABLE mixes ADD COLUMN link TEXT;

CREATE INDEX IF NOT EXISTS idx_mixes_platform ON mixes(platform);
