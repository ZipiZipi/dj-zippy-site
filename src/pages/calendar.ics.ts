// GET /calendar.ics — every upcoming gig as one subscribable calendar.
// Calendar apps re-fetch it on their own schedule, so new dates show up there
// without the visitor doing anything.

import type { APIRoute } from 'astro';
import { getEvents } from '../lib/content';
import { icsCalendar } from '../lib/calendar';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  const { upcoming } = await getEvents(db);
  return new Response(icsCalendar(upcoming, 'https://zippydj.com/events'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
