// Electronic Press Kit — single source of truth for /epk.
// Edit this file to update the press kit; the page renders from it.

import { EVENTS_FALLBACK, type UIEvent } from './content';

export const EPK_BIO = {
  tagline: 'Not a Producer. A Selector.',
  short:
    'DJ Zippy (Veljko Nedeljković) is a House and Tech-House DJ and selector from Belgrade, Serbia — ' +
    'creator of the House Music Therapy mix series, with performances at Exit Festival (Dance Arena, ' +
    'AS FM and Students stages) and leading regional clubs.',
  long: [
    "DJ Zippy's brand, House Music Therapy, is built on the belief that the right groove can heal. " +
      'While his foundation is strictly House, Zippy adapts to the energy of the night, shifting into ' +
      'Techno when the atmosphere demands darker, driving rhythms.',
    'In an era dominated by production credits, the art of selection is the true therapy. DJ Zippy ' +
      'specializes in reading the room, bridging the gap between the DJ booth and the dancefloor.',
    'Reliability is key. Through collaborations with Kult Talents, Izuvanje and Go2 Travel, DJ Zippy ' +
      'has proven his adaptability, making him a safe and exciting bet for any promoter.',
  ],
  genres: ['House', 'Tech House', 'Deep House', 'Organic House', 'Techno'],
  base: 'Belgrade, Serbia',
  affiliations: ['Kult Talents', 'Izuvanje', 'Go2 Travel'],
};

/** Derived career stats; computed from the live event list when D1 is available. */
export function epkStats(events: UIEvent[]) {
  const all = events.length ? events : EVENTS_FALLBACK;
  const shows = all.length;
  const countries = new Set(all.map(e => e.country || 'RS')).size;
  const festivalStages = all.filter(e => e.title.toLowerCase().includes('festival')).length;
  const firstYear = Math.min(...all.map(e => parseInt(e.date.slice(0, 4), 10)));
  const yearsActive = new Date().getFullYear() - firstYear;
  return { shows, countries, festivalStages, yearsActive };
}

export const EPK_FEATURED_VIDEO = {
  title: 'EXIT 2024 — AS FM Stage (Live)',
  youtubeId: 'pbT603mKdsc',
};

export const EPK_PHOTOS = [
  {
    label: 'Primary press photo (1200×1200)',
    url: '/images/dj-zippy-house-music-dj.webp',
    download: 'dj-zippy-press-photo.webp',
  },
  // Add hi-res photos here as they land on cdn.zippydj.com, e.g.:
  // { label: 'Exit Festival 2025 — Dance Arena', url: 'https://cdn.zippydj.com/press/exit-2025.jpg', download: 'dj-zippy-exit-2025.jpg' },
];

export const EPK_TECH_RIDER = {
  players: '2× Pioneer CDJ-3000 (minimum: CDJ-2000NXS2), linked via Pro DJ Link, latest firmware',
  mixer: 'Pioneer DJM-A9 / DJM-900NXS2 (4-channel)',
  monitors: '2× active booth monitors with independent level control (e.g. Pioneer XPRS or equivalent)',
  booth: 'Stable, vibration-free booth ≥ 2m width; clean power outlets (2× 230V) at the booth',
  sound: 'Professional full-range PA adequate for the venue, stereo, with subs',
  notes: 'Plays from USB (rekordbox). No laptop stand required. Backup USB on site.',
};

export const EPK_HOSPITALITY = [
  'Still water at the booth',
  'Parking / load-in info advanced 48h before the event',
  'Set time confirmed no later than 7 days before the event',
];

export const EPK_CONTACTS = {
  bookings: 'veljkoned@gmail.com',
  press: 'veljkoned@gmail.com',
  ra: 'https://ra.co/dj/zippy-2',
  instagram: 'https://www.instagram.com/zovumezippy',
};
