-- Phase 1 seed: load the original hardcoded events into D1.
-- Idempotent: INSERT OR IGNORE keyed on the unique slug, so re-running is safe
-- and will not duplicate or overwrite events you later edit in the admin.

INSERT OR IGNORE INTO events (slug, title, subtitle, location, country, date, time, status, featured) VALUES
('event-raybar-2026-05-23','RayBar','House Music Therapy','Novi Sad','RS','2026-05-23','20:00 - 01:00','upcoming',0),
('event-kc-lab-2026-05-09','KC Lab','House Music Therapy','Novi Sad','RS','2026-05-09','20:00 - 01:00','upcoming',0),
('event-lazino-tele-2026-05-02','Lazino Tele','Millenial Shuffle','Novi Sad','RS','2026-05-02','22:00 - 03:00','upcoming',0),
('event-raybar-2026-04-25','RayBar','House Music Therapy','Novi Sad','RS','2026-04-25','20:00 - 01:00','upcoming',0),
('event-lazino-tele-2026','Lazino Tele','Millenial Shuffle','Novi Sad','RS','2026-03-27','22:00 - 03:00','past',0),
('event-krivi-put-2026','Krivi Put','House Music Therapy','Smederevo','RS','2026-03-21','20:00 - 01:00','past',0),
('event-club-kult-2026','Club Kult','House Music Therapy','Beograd','RS','2026-03-18','21:00 - 22:00','past',1),
('event-raybar-2026-mar','RayBar','House Music Therapy','Novi Sad','RS','2026-03-07','20:00 - 01:00','past',0),
('event-raybar-2026','RayBar','First Residency','Novi Sad','RS','2026-01-24','','past',0),
('event-charlie-bar-2026','Charlie Bar','House Techno Session','Smederevo','RS','2026-01-10','','past',0),
('event-kult-2025','Club Kult','House Groove Tech Set','Belgrade','RS','2025-11-20','','past',1),
('event-toucan-2025','Toucan Nightclub','','Zakynthos','GR','2025-08-19','','past',1),
('event-exit-dance-arena-2025','Exit Festival — Dance Arena','First Dance Arena Set','Novi Sad','RS','2025-07-12','','past',1),
('event-exit-students-2025','Exit Festival — Students Stage','Late-Night House Set','Novi Sad','RS','2025-07-12','','past',1),
('event-borisov-atelje-2024','Borisov Atelje','','Petrovaradin','RS','2024-09-07','','past',1),
('event-capital-nightclub-2024','Capital Night Club','','Lefkada','GR','2024-07-23','','past',1),
('event-exit-asfm-2024','Exit Festival — AS FM Stage','First Major Festival Stage','Novi Sad','RS','2024-07-12','','past',1),
('event-kst-2024','Klub Studenata Tehnike','','Belgrade','RS','2024-04-09','','past',0),
('event-kc-lab-2023','Kulturni Centar LAB','Silent Disco Party','Novi Sad','RS','2023-09-02','','past',0),
('event-krivi-put-2022','Cafe Krivi Put','First Public Party','Smederevo','RS','2022-07-30','','past',0);
