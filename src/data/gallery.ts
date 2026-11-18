// Gallery photos, in the order the page shows them: B side first (Exit, Kult,
// Paleta, Capital), then A side (Lazino Tele, Hangar, London Pub).
//
// Files live in public/images/gallery/ as dj-zippy-<slug>.webp (long side
// 1600 px, ≤ 200 KB) plus dj-zippy-<slug>-600.webp for the grid. They were
// made from the originals in the E:\DJ archive with sharp; the originals are
// never touched. The words (caption, place, alt) are in ui.ts under
// gallery.groups and gallery.shots, in en and sr.

export type GalleryGroup =
  | 'danceArena'
  | 'studentsStage'
  | 'kult'
  | 'paleta'
  | 'capital'
  | 'lazino'
  | 'hangar'
  | 'londonPub2025'
  | 'londonPub2024';

// Where and when each night was, for the ImageObject schema (contentLocation,
// dateCreated). Dates are from the gig sheet and the photos' EXIF; the Students
// Stage set ran 02–04 h over the night of 12/13 July, so only the month is given.
export const galleryPlaces: Record<GalleryGroup, { venue: string; city: string; country: string; date: string }> = {
  danceArena: { venue: 'Exit Festival, Dance Arena', city: 'Novi Sad', country: 'RS', date: '2025-07-13' },
  studentsStage: { venue: 'Exit Festival, Students Stage', city: 'Novi Sad', country: 'RS', date: '2025-07' },
  kult: { venue: 'Club Kult', city: 'Belgrade', country: 'RS', date: '2025-11-20' },
  paleta: { venue: 'Paleta', city: 'Novi Sad', country: 'RS', date: '2026-04-30' },
  capital: { venue: 'Capital Night Club', city: 'Lefkada', country: 'GR', date: '2024-07-23' },
  lazino: { venue: 'Lazino Tele', city: 'Novi Sad', country: 'RS', date: '2025' },
  hangar: { venue: 'Hangar', city: 'Ohrid', country: 'MK', date: '2025-12-31' },
  londonPub2025: { venue: 'London Pub', city: 'Novi Sad', country: 'RS', date: '2025-01-25' },
  londonPub2024: { venue: 'London Pub', city: 'Novi Sad', country: 'RS', date: '2024-05-24' },
};

export type GalleryPhoto = {
  slug: string;
  group: GalleryGroup;
  w: number; // full size
  h: number;
  tw: number; // 600 px version
  th: number;
  credit?: string; // photographer, when known
  date?: string; // when it differs from the night's date in galleryPlaces
};

const JOVANA = 'Jovana Semiz';
const SKILLA = 'Miloš Lakićević Skilla';

export const galleryPhotos: GalleryPhoto[] = [
  { slug: 'exit-2025-dance-arena-01', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400, credit: JOVANA },
  { slug: 'exit-2025-dance-arena-02', group: 'danceArena', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'exit-2025-dance-arena-03', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400 },
  { slug: 'exit-2025-dance-arena-04', group: 'danceArena', w: 1200, h: 1600, tw: 450, th: 600 },
  { slug: 'exit-2025-dance-arena-05', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400, credit: JOVANA },
  { slug: 'exit-2025-dance-arena-06', group: 'danceArena', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'exit-2025-dance-arena-07', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400 },
  { slug: 'exit-2025-dance-arena-08', group: 'danceArena', w: 1200, h: 1600, tw: 450, th: 600 },
  { slug: 'exit-2025-dance-arena-09', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400, credit: JOVANA },
  { slug: 'exit-2025-dance-arena-10', group: 'danceArena', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'exit-2025-dance-arena-11', group: 'danceArena', w: 1600, h: 1067, tw: 600, th: 400 },
  { slug: 'exit-2025-dance-arena-12', group: 'danceArena', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'exit-2025-dance-arena-13', group: 'danceArena', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'exit-2025-students-stage-01', group: 'studentsStage', w: 1600, h: 1096, tw: 600, th: 411, credit: SKILLA },
  { slug: 'exit-2025-students-stage-02', group: 'studentsStage', w: 1231, h: 1600, tw: 461, th: 600, credit: SKILLA },
  { slug: 'exit-2025-students-stage-03', group: 'studentsStage', w: 1065, h: 1600, tw: 399, th: 600, credit: SKILLA },
  { slug: 'exit-2025-students-stage-04', group: 'studentsStage', w: 1065, h: 1600, tw: 399, th: 600, credit: SKILLA },
  { slug: 'exit-2025-students-stage-05', group: 'studentsStage', w: 1205, h: 1600, tw: 452, th: 600 },
  { slug: 'club-kult-2025-01', group: 'kult', w: 1200, h: 1600, tw: 450, th: 600 },
  { slug: 'club-kult-2025-02', group: 'kult', w: 1600, h: 1200, tw: 600, th: 450 },
  { slug: 'paleta-2026', group: 'paleta', w: 1200, h: 1600, tw: 450, th: 600 },
  { slug: 'capital-lefkada-2024', group: 'capital', w: 1600, h: 1600, tw: 600, th: 600 },
  { slug: 'lazino-tele-2025-01', group: 'lazino', w: 1067, h: 1600, tw: 400, th: 600, date: '2025-09-06' },
  { slug: 'lazino-tele-2025-02', group: 'lazino', w: 900, h: 1600, tw: 338, th: 600, date: '2025-09' },
  { slug: 'lazino-tele-2025-03', group: 'lazino', w: 1080, h: 1351, tw: 480, th: 600, date: '2025-05' },
  { slug: 'hangar-ohrid-2025', group: 'hangar', w: 1200, h: 1600, tw: 450, th: 600 },
  { slug: 'london-pub-2025', group: 'londonPub2025', w: 900, h: 1600, tw: 338, th: 600 },
  { slug: 'london-pub-2024', group: 'londonPub2024', w: 1068, h: 1600, tw: 400, th: 600 },
];

export const photoSrc = (slug: string) => `/images/gallery/dj-zippy-${slug}.webp`;
export const thumbSrc = (slug: string) => `/images/gallery/dj-zippy-${slug}-600.webp`;
