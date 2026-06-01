// Shared content access layer.
// Public pages read events/mixes from D1 when available, and fall back to the
// built-in seed data below so the site keeps rendering before/if the DB is empty
// or unavailable (e.g. local dev without bindings). The same seed data is what
// the one-time migration loads into D1.

export interface UIEvent {
  id?: number;
  slug: string;
  date: string;        // YYYY-MM-DD
  time?: string;       // "20:00 - 01:00" or ""
  title: string;
  subtitle?: string;
  location: string;
  country?: string;    // ISO-2, used for schema
  status: 'upcoming' | 'past';
  featured: boolean;   // pin to top of Past Highlights
}

// --- Seed / fallback events (mirror of the original hardcoded lists) ---
export const EVENTS_FALLBACK: UIEvent[] = [
  { slug: "event-raybar-2026-05-23", date: "2026-05-23", time: "20:00 - 01:00", title: "RayBar", subtitle: "House Music Therapy", location: "Novi Sad", country: "RS", status: "upcoming", featured: false },
  { slug: "event-kc-lab-2026-05-09", date: "2026-05-09", time: "20:00 - 01:00", title: "KC Lab", subtitle: "House Music Therapy", location: "Novi Sad", country: "RS", status: "upcoming", featured: false },
  { slug: "event-lazino-tele-2026-05-02", date: "2026-05-02", time: "22:00 - 03:00", title: "Lazino Tele", subtitle: "Millenial Shuffle", location: "Novi Sad", country: "RS", status: "upcoming", featured: false },
  { slug: "event-raybar-2026-04-25", date: "2026-04-25", time: "20:00 - 01:00", title: "RayBar", subtitle: "House Music Therapy", location: "Novi Sad", country: "RS", status: "upcoming", featured: false },
  { slug: "event-lazino-tele-2026", date: "2026-03-27", time: "22:00 - 03:00", title: "Lazino Tele", subtitle: "Millenial Shuffle", location: "Novi Sad", country: "RS", status: "past", featured: false },
  { slug: "event-krivi-put-2026", date: "2026-03-21", time: "20:00 - 01:00", title: "Krivi Put", subtitle: "House Music Therapy", location: "Smederevo", country: "RS", status: "past", featured: false },
  { slug: "event-club-kult-2026", date: "2026-03-18", time: "21:00 - 22:00", title: "Club Kult", subtitle: "House Music Therapy", location: "Beograd", country: "RS", status: "past", featured: true },
  { slug: "event-raybar-2026-mar", date: "2026-03-07", time: "20:00 - 01:00", title: "RayBar", subtitle: "House Music Therapy", location: "Novi Sad", country: "RS", status: "past", featured: false },
  { slug: "event-raybar-2026", date: "2026-01-24", time: "", title: "RayBar", subtitle: "First Residency", location: "Novi Sad", country: "RS", status: "past", featured: false },
  { slug: "event-charlie-bar-2026", date: "2026-01-10", time: "", title: "Charlie Bar", subtitle: "House Techno Session", location: "Smederevo", country: "RS", status: "past", featured: false },
  { slug: "event-kult-2025", date: "2025-11-20", time: "", title: "Club Kult", subtitle: "House Groove Tech Set", location: "Belgrade", country: "RS", status: "past", featured: true },
  { slug: "event-toucan-2025", date: "2025-08-19", time: "", title: "Toucan Nightclub", subtitle: "", location: "Zakynthos", country: "GR", status: "past", featured: true },
  { slug: "event-exit-dance-arena-2025", date: "2025-07-12", time: "", title: "Exit Festival — Dance Arena", subtitle: "First Dance Arena Set", location: "Novi Sad", country: "RS", status: "past", featured: true },
  { slug: "event-exit-students-2025", date: "2025-07-12", time: "", title: "Exit Festival — Students Stage", subtitle: "Late-Night House Set", location: "Novi Sad", country: "RS", status: "past", featured: true },
  { slug: "event-borisov-atelje-2024", date: "2024-09-07", time: "", title: "Borisov Atelje", subtitle: "", location: "Petrovaradin", country: "RS", status: "past", featured: true },
  { slug: "event-capital-nightclub-2024", date: "2024-07-23", time: "", title: "Capital Night Club", subtitle: "", location: "Lefkada", country: "GR", status: "past", featured: true },
  { slug: "event-exit-asfm-2024", date: "2024-07-12", time: "", title: "Exit Festival — AS FM Stage", subtitle: "First Major Festival Stage", location: "Novi Sad", country: "RS", status: "past", featured: true },
  { slug: "event-kst-2024", date: "2024-04-09", time: "", title: "Klub Studenata Tehnike", subtitle: "", location: "Belgrade", country: "RS", status: "past", featured: false },
  { slug: "event-kc-lab-2023", date: "2023-09-02", time: "", title: "Kulturni Centar LAB", subtitle: "Silent Disco Party", location: "Novi Sad", country: "RS", status: "past", featured: false },
  { slug: "event-krivi-put-2022", date: "2022-07-30", time: "", title: "Cafe Krivi Put", subtitle: "First Public Party", location: "Smederevo", country: "RS", status: "past", featured: false },
];

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

/** Split a YYYY-MM-DD string into display parts without timezone surprises. */
export function dateParts(date: string): { day: string; month: string; year: string } {
  const [y, m, d] = date.split('-');
  const mi = Math.max(1, Math.min(12, parseInt(m || '1', 10))) - 1;
  return { day: (d || '01').padStart(2, '0'), month: MONTHS[mi], year: y || '' };
}

function mapRow(row: any): UIEvent {
  return {
    id: row.id,
    slug: row.slug ?? `event-${row.id}`,
    date: row.date,
    time: row.time ?? '',
    title: row.title,
    subtitle: row.subtitle ?? '',
    location: row.location,
    country: row.country ?? 'RS',
    status: row.status,
    featured: !!row.featured,
  };
}

function sortUpcoming(a: UIEvent, b: UIEvent) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

// Past Highlights: featured pinned first, then everything by date descending.
function sortPast(a: UIEvent, b: UIEvent) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

/**
 * Returns split upcoming/past event lists. Reads from D1 when `db` is provided
 * and has rows; otherwise uses the built-in seed data.
 */
export async function getEvents(db: any): Promise<{ upcoming: UIEvent[]; past: UIEvent[] }> {
  let all: UIEvent[] | null = null;
  if (db) {
    try {
      const res = await db.prepare('SELECT * FROM events').all();
      const rows = (res?.results ?? []) as any[];
      if (rows.length) all = rows.map(mapRow);
    } catch { /* fall back to seed */ }
  }
  if (!all) all = EVENTS_FALLBACK.slice();

  const upcoming = all.filter(e => e.status === 'upcoming').sort(sortUpcoming);
  const past = all.filter(e => e.status === 'past').sort(sortPast);
  return { upcoming, past };
}

// ============================ MIXES ============================

export type Platform = 'youtube' | 'mixcloud' | 'spotify' | 'soundcloud' | 'deezer';

export interface UIMix {
  id?: number;
  slug: string;
  title: string;
  genre: string;
  description: string;
  platform: Platform;
  link: string;
  thumbnail: string;   // cover_image / thumbnail URL ('' = use platform fallback icon)
  featured: boolean;   // show in home coverflow
  alt: string;
}

// Ordered list of platform tabs shown on the Mixes page.
export const MIX_PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: 'youtube',    label: 'YouTube',    icon: 'fa-brands fa-youtube' },
  { id: 'mixcloud',   label: 'MixCloud',   icon: 'fa-brands fa-mixcloud' },
  { id: 'spotify',    label: 'Spotify',    icon: 'fa-brands fa-spotify' },
  { id: 'soundcloud', label: 'SoundCloud', icon: 'fa-brands fa-soundcloud' },
  { id: 'deezer',     label: 'Deezer',     icon: 'fa-brands fa-deezer' },
];

/** "Listen Now" link icon per platform (YouTube uses a play glyph, like the original). */
export function mixIcon(platform: string): string {
  switch (platform) {
    case 'youtube':    return 'fa-solid fa-play';
    case 'mixcloud':   return 'fa-brands fa-mixcloud';
    case 'spotify':    return 'fa-brands fa-spotify';
    case 'soundcloud': return 'fa-brands fa-soundcloud';
    case 'deezer':     return 'fa-brands fa-deezer';
    default:           return 'fa-solid fa-play';
  }
}

/** Background glyph used when a card has no thumbnail image. */
export function mixFallbackIcon(platform: string): string {
  return MIX_PLATFORMS.find(p => p.id === platform)?.icon ?? 'fa-brands fa-youtube';
}

export const MIXES_FALLBACK: UIMix[] = [
  { slug: 'letsmixit-contest', title: 'House Music Therapy / #LetsMixIt Contest', genre: 'House / Tech House', description: "DJ Zippy's high-energy rooftop set recorded in Novi Sad for the #LetsMixIt competition.", platform: 'youtube', link: 'https://www.youtube.com/watch?v=IzkAZcbyCSI', thumbnail: 'https://img.youtube.com/vi/IzkAZcbyCSI/maxresdefault.jpg', featured: true, alt: "DJ Zippy's Let's Mix It Submission - House and Tech House mix" },
  { slug: 'deep-tech-grooves-yt', title: 'House Music Therapy / Deep & Tech Grooves', genre: 'Deep House / Tech House', description: "DJ Zippy's curated mix blending deep basslines with rhythmic tech house elements.", platform: 'youtube', link: 'https://www.youtube.com/watch?v=c1M_dMg_CcU', thumbnail: 'https://img.youtube.com/vi/c1M_dMg_CcU/maxresdefault.jpg', featured: true, alt: "DJ Zippy's House Therapy Session - Deep House mix" },
  { slug: 'exit-2024-asfm-live', title: 'EXIT 2024 | AS FM Stage Live', genre: 'Tech House', description: "DJ Zippy's full live performance recording from the AS FM stage at Exit Festival 2024.", platform: 'youtube', link: 'https://www.youtube.com/watch?v=pbT603mKdsc', thumbnail: 'https://img.youtube.com/vi/pbT603mKdsc/maxresdefault.jpg', featured: true, alt: "DJ Zippy's live set at EXIT 2024 AS FM Stage house music selection" },
  { slug: 'exit-2024-asfm-full', title: 'EXIT 2024 | AS FM Stage Full Show', genre: 'Tech House', description: "DJ Zippy's complete high-energy audio recording from the Exit Festival performance.", platform: 'mixcloud', link: 'https://www.mixcloud.com/zovumezippy/exit-2024-zippy-live-at-as-fm-stage-full-show/', thumbnail: '', featured: true, alt: "DJ Zippy's House Music Therapy - MixCloud set" },
  { slug: 'deep-tech-grooves-mc', title: 'House Music Therapy / Deep & Tech Grooves (MixCloud)', genre: 'Deep Tech', description: "DJ Zippy's mix focused on sophisticated, deeper layers of house music.", platform: 'mixcloud', link: 'https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-deep-and-tech-grooves/', thumbnail: '', featured: true, alt: "DJ Zippy's Deep & Tech Grooves - MixCloud set" },
  { slug: 'singing-forest-mc', title: 'House Music Therapy / Live from Singing Forest', genre: 'House / Organic House', description: "DJ Zippy's live set recorded in Singing Forest, blending house rhythms with a jazzy vibe.", platform: 'mixcloud', link: 'https://www.mixcloud.com/zovumezippy/house-music-therapy-with-dj-zippy-live-from-singing-forest/', thumbnail: '', featured: false, alt: "DJ Zippy's Live from Singing Forest - MixCloud set" },
  { slug: 'letsmixit-soundcloud', title: 'Zippy — #LetsMixIt DJ Takmičenje', genre: 'House / Tech House', description: "DJ Zippy's competition entry for the LetsMixIt DJ contest — full set on SoundCloud.", platform: 'soundcloud', link: 'https://soundcloud.com/zovumezippy/zippy-letsmixit-dj-takmicenje', thumbnail: '', featured: false, alt: "Zippy LetsMixIt DJ Takmicenje - SoundCloud" },
  { slug: 'house-therapy-3-sc', title: 'House Music Therapy #3 / Live from Singing Forest', genre: 'House / Organic House', description: "Full House Therapy session #3 recorded live in Singing Forest — available on SoundCloud.", platform: 'soundcloud', link: 'https://soundcloud.com/zovumezippy/dj-zippy-house-therapy-3-live-from-singing-forest', thumbnail: '', featured: false, alt: "DJ Zippy House Therapy 3 Live from Singing Forest - SoundCloud" },
  { slug: 'playlist-hmt-spotify', title: 'House Music Therapy with DJ Zippy', genre: 'Spotify Playlist', description: "DJ Zippy's selection of tracks that never leave his USB.", platform: 'spotify', link: 'https://open.spotify.com/playlist/1760y5mR1hdF7PdnAErYRA', thumbnail: '', featured: false, alt: "DJ Zippy's Selector Choice House - Spotify playlist" },
  { slug: 'playlist-guilty-spotify', title: 'Guilty Trep Pleasures with DJ Zippy', genre: 'Spotify Playlist', description: "DJ Zippy's playlist for when the lights go down and the mood gets darker.", platform: 'spotify', link: 'https://open.spotify.com/playlist/17bauJGzLkXVRa89n3WEF0', thumbnail: '', featured: false, alt: "DJ Zippy's Afterhours guilty pleasure - Spotify playlist" },
  { slug: 'playlist-balkan-spotify', title: 'Chill Balkan RnB Vibes with DJ Zippy', genre: 'Spotify Playlist', description: "DJ Zippy's chill summer vibes with a Balkan twist.", platform: 'spotify', link: 'https://open.spotify.com/playlist/5wyLKeoY4Jf3FrGcPj9ly2', thumbnail: '', featured: false, alt: "DJ Zippy's Chill Balkan RnB Vibe Essentials - Spotify playlist" },
  { slug: 'playlist-hmt-deezer', title: 'House Music Therapy with DJ Zippy', genre: 'Deezer Playlist', description: "DJ Zippy's House Music Therapy selection on Deezer.", platform: 'deezer', link: 'https://www.deezer.com/en/playlist/15339042363', thumbnail: '', featured: false, alt: "DJ Zippy's House Music Therapy - Deezer playlist" },
];

function mapMix(row: any): UIMix {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    genre: row.genre ?? '',
    description: row.description ?? '',
    platform: (row.platform ?? 'youtube') as Platform,
    link: row.link ?? '',
    thumbnail: row.cover_image ?? '',
    featured: !!row.featured,
    alt: row.title,
  };
}

/**
 * Returns published mixes plus the featured subset (home coverflow).
 * Reads from D1 when available and populated; otherwise uses the seed data.
 */
export async function getMixes(db: any): Promise<{ all: UIMix[]; featured: UIMix[] }> {
  let all: UIMix[] | null = null;
  if (db) {
    try {
      const res = await db.prepare('SELECT * FROM mixes WHERE published = 1 ORDER BY created_at DESC').all();
      const rows = (res?.results ?? []) as any[];
      if (rows.length) all = rows.filter(r => r.platform && r.link).map(mapMix);
    } catch { /* fall back to seed */ }
  }
  if (!all || !all.length) all = MIXES_FALLBACK.slice();

  let featured = all.filter(m => m.featured);
  if (featured.length === 0) featured = all.slice(0, 5);
  return { all, featured };
}
