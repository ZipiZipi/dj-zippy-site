// Track previews for the dates deck on the home page.
//
// Picking a gig on the deck plays a few short clips of what that night sounds
// like. Clips are looked up in two steps, so most gigs need no work at all:
//
//   1. EVENT_PREVIEWS[slug]  — clips chosen for one specific gig, if any
//   2. SIDE_PREVIEWS[side]   — otherwise the pool for the gig's side
//                              (A = open format, B = underground)
//
// To add a track, drop the audio file in public/audio/previews/ and add a line
// below, e.g.
//
//   { title: 'Track name', artist: 'Artist', src: '/audio/previews/track.mp3', start: 62 }
//
// `start` is where the clip begins (seconds into the file, default 0) and
// `length` is how long it plays (default PREVIEW_SECONDS). While both pools
// are empty the preview strip stays hidden on the live site.

import { eventSide, type Side, type UIEvent } from './content';

export interface PreviewTrack {
  title: string;
  artist: string;
  /** URL of the audio file. */
  src: string;
  /** Seconds into the file where the clip starts. */
  start?: number;
  /** Seconds the clip plays for. */
  length?: number;
}

export const PREVIEW_SECONDS = 20;

export const SIDE_PREVIEWS: Record<Side, PreviewTrack[]> = {
  A: [],
  B: [],
};

/** Keyed by event slug. */
export const EVENT_PREVIEWS: Record<string, PreviewTrack[]> = {};

export function previewsFor(e: UIEvent): PreviewTrack[] {
  return EVENT_PREVIEWS[e.slug] ?? SIDE_PREVIEWS[eventSide(e)];
}
