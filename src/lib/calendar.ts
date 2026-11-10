// Calendar links and .ics output for gigs.
//
// Three things are built from one event: a link that opens the visitor's own
// Google Calendar on the day of the gig (so they can see if they are free), a
// link that opens a pre-filled Google Calendar event, and iCalendar text for
// Apple Calendar / Outlook and for the subscribable feed of all upcoming dates.

import { eventInterval, eventSound, type UIEvent } from './content';

/** Gig times are typed in as local club time. Every venue so far is in Serbia. */
const VENUE_TZ = 'Europe/Belgrade';
/** A gig with a start time but no end time is assumed to run this long. */
const DEFAULT_HOURS = 4;

/** The UTC instant for a wall-clock time ("YYYY-MM-DDTHH:MM:SS") in the venue's zone. */
function zonedToUtcMs(local: string): number {
  const [date, time = '00:00:00'] = local.split('T');
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const guess = Date.UTC(y, mo - 1, d, h || 0, mi || 0);
  // Ask what the wall clock reads in the venue's zone at `guess`; the gap
  // between that reading and `guess` is the zone's offset on that date.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: VENUE_TZ, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(guess));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const wall = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  return guess - (wall - guess);
}

export interface EventTimes {
  startMs: number;
  endMs: number;
  /** No start time is known, only the date. */
  allDay: boolean;
}

export function eventTimes(e: UIEvent): EventTimes {
  const { start, end } = eventInterval(e);
  if (!start.includes('T')) {
    const startMs = zonedToUtcMs(`${e.date}T00:00:00`);
    return { startMs, endMs: startMs + 24 * 3600_000, allDay: true };
  }
  const startMs = zonedToUtcMs(start);
  return { startMs, endMs: end ? zonedToUtcMs(end) : startMs + DEFAULT_HOURS * 3600_000, allDay: false };
}

const utcStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]|\.\d{3}/g, '');
const dayStamp = (date: string) => date.replace(/-/g, '');

function dayAfter(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function calendarTitle(e: UIEvent): string {
  return `DJ Zippy @ ${e.title}`;
}

function calendarDetails(e: UIEvent, pageUrl: string): string {
  const sound = eventSound(e);
  const what = sound.openFormat ? 'Open format' : sound.genres.join(' · ');
  return [sound.name, what, pageUrl].filter(Boolean).join('\n');
}

/** The visitor's own Google Calendar, opened on the day of the gig. */
export function googleDayUrl(e: UIEvent): string {
  const [y, m, d] = e.date.split('-').map(Number);
  return `https://calendar.google.com/calendar/u/0/r/day/${y}/${m}/${d}`;
}

/** A pre-filled "new event" in Google Calendar. */
export function googleSaveUrl(e: UIEvent, pageUrl: string): string {
  const t = eventTimes(e);
  const dates = t.allDay
    ? `${dayStamp(e.date)}/${dayStamp(dayAfter(e.date))}`
    : `${utcStamp(t.startMs)}/${utcStamp(t.endMs)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarTitle(e),
    dates,
    location: `${e.title}, ${e.location}`,
    details: calendarDetails(e, pageUrl),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsText = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

function icsEvent(e: UIEvent, pageUrl: string, stamp: string): string[] {
  const t = eventTimes(e);
  return [
    'BEGIN:VEVENT',
    `UID:${e.slug}@zippydj.com`,
    `DTSTAMP:${stamp}`,
    ...(t.allDay
      ? [`DTSTART;VALUE=DATE:${dayStamp(e.date)}`, `DTEND;VALUE=DATE:${dayStamp(dayAfter(e.date))}`]
      : [`DTSTART:${utcStamp(t.startMs)}`, `DTEND:${utcStamp(t.endMs)}`]),
    `SUMMARY:${icsText(calendarTitle(e))}`,
    `LOCATION:${icsText(`${e.title}, ${e.location}`)}`,
    `DESCRIPTION:${icsText(calendarDetails(e, pageUrl))}`,
    `URL:${pageUrl}`,
    'END:VEVENT',
  ];
}

/** iCalendar text for one or more gigs. Lines end in CRLF, as the format requires. */
export function icsCalendar(events: UIEvent[], pageUrl: string): string {
  const stamp = utcStamp(Date.now());
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//zippydj.com//DJ Zippy gigs//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:DJ Zippy',
    ...events.flatMap((e) => icsEvent(e, pageUrl, stamp)),
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export const icsPath = (e: UIEvent) => `/calendar/${e.slug}.ics`;
export const ICS_FEED_PATH = '/calendar.ics';
