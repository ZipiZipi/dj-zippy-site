-- New YouTube mix: ZIPPY Live @ RAY BAR 2 YRS.
-- Idempotent (unique slug). created_at defaults to now, and the Mixes page
-- orders by created_at DESC, so this lands first in the YouTube tab.

INSERT OR IGNORE INTO mixes (slug, title, genre, platform, link, cover_image, description, duration, published, featured) VALUES
('ray-bar-2yrs','ZIPPY Live @ RAY BAR 2 YRS','House / Tech House','youtube','https://www.youtube.com/watch?v=nCtGqbvYe38','https://img.youtube.com/vi/nCtGqbvYe38/maxresdefault.jpg','DJ Zippy''s live set from RAY BAR''s 2nd anniversary night in Novi Sad.',0,1,0);
