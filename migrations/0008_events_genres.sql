-- B11: what the upcoming list shows on the right instead of "House Music Therapy".
-- genres: NULL = the default house list (DEFAULT_GENRES in src/lib/content.ts),
--         'open_format' = open-format party (blue card + OPEN FORMAT chip),
--         anything else = comma-separated genres for that gig.
-- Run ONCE per database (local, then remote).

ALTER TABLE events ADD COLUMN genres TEXT;

UPDATE events SET subtitle = 'Core Memories', genres = 'open_format', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'sheet-lazino-tele-2026-10-31';
