// Names as each language spells them. Gigs are typed into the admin and the
// sheet by hand, so the same city turns up as "Beograd" and "Belgrade" and a
// venue as "RayBar" next to "Ray Bar"; the pages show one spelling per language
// and count it as one place.
import type { Lang } from '../i18n/utils';
import { eventSound, type UIEvent } from './content';

const PLACES: Record<string, Record<Lang, string>> = {
  beograd: { en: 'Belgrade', sr: 'Beograd' },
  belgrade: { en: 'Belgrade', sr: 'Beograd' },
  zakynthos: { en: 'Zakynthos', sr: 'Zakintos' },
  zakintos: { en: 'Zakynthos', sr: 'Zakintos' },
};

const lookup = (name: string) => PLACES[name.trim().toLowerCase()];

/** The place as this language writes it ("Beograd" on /sr, "Belgrade" on /). */
export function placeName(name: string, lang: Lang): string {
  return lookup(name)?.[lang] ?? name.trim();
}

/** One key per place, whichever spelling the data used. */
export function placeKey(name: string): string {
  return (lookup(name)?.en ?? name).trim().toLowerCase();
}

// Venues whose name the data writes differently from the venue itself. The key
// is the name in lower case with spaces and punctuation taken out.
const VENUES: Record<string, string> = {
  raybar: 'Ray Bar',
  // one venue, two names over the years
  kulturnicentarlab: 'KC Lab',
  kclab: 'KC Lab',
  cafekriviput: 'Krivi Put',
  kriviput: 'Krivi Put',
};

const squash = (name: string) => name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** The venue as it writes its own name ("RayBar" in the data reads "Ray Bar"). */
export function venueName(title: string): string {
  return VENUES[squash(title)] ?? title.trim();
}

// What a gig was, in Serbian. The admin and the sheet take these notes in
// English; names of nights and series (Core Memories, House Music Therapy,
// Millenial Shuffle) are not translated and pass through as they are.
const SUBTITLES_SR: Record<string, string> = {
  'first public party': 'Prva javna žurka',
  'first major festival stage': 'Prva velika festivalska bina',
  'first dance arena set': 'Prvi set na Dance Areni',
  'late-night house set': 'Kasnonoćni house set',
  'first residency': 'Početak rezidencije',
  'house techno session': 'House i techno sesija',
  'house groove tech set': 'House, groove i tech set',
  'silent disco party': 'Silent disco žurka',
  'open air session': 'Open air sesija',
};

/** A gig's subtitle in this language (descriptions are translated, names are not). */
export function subtitleText(sub: string | undefined, lang: Lang): string {
  const s = (sub ?? '').trim();
  if (!s || lang !== 'sr') return s;
  return SUBTITLES_SR[s.toLowerCase().replace(/\s+/g, ' ')] ?? s;
}

/**
 * A gig's name as the pages show it and the structured data gives it: the venue,
 * then the night's own name if it has one ("Lazino Tele — Core Memories"). The
 * House Music Therapy brand is never used as a name (see eventSound()).
 */
export function eventName(e: UIEvent, lang: Lang): string {
  const venue = venueName(e.title);
  const night = subtitleText(eventSound(e).name, lang);
  if (!night) return venue;
  return venue.includes('—') ? `${venue}, ${night}` : `${venue} — ${night}`;
}
