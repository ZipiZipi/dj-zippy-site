-- New MixCloud set: Zippy Live At Ray.
-- Idempotent (unique slug). created_at defaults to now, and the Mixes page
-- orders by created_at DESC, so this lands first in the MixCloud tab.

INSERT OR IGNORE INTO mixes (slug, title, genre, platform, link, cover_image, description, duration, published, featured) VALUES
('ray-bar-live-mc','Zippy Live At Ray','House / Tech House','mixcloud','https://www.mixcloud.com/zovumezippy/zippy-live-at-ray/','','DJ Zippy''s live set recorded at RAY BAR in Novi Sad — full audio on MixCloud.',0,1,0);
