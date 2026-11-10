// GET /calendar/<event-slug>.ics — one gig as a calendar file, for Apple
// Calendar, Outlook and anything else that opens .ics.

import type { APIRoute } from 'astro';
import { getEvents } from '../../lib/content';
import { icsCalendar } from '../../lib/calendar';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  const { upcoming, past } = await getEvents(db);
  const event = [...upcoming, ...past].find((e) => e.slug === params.slug);
  if (!event) return new Response('Not found', { status: 404 });

  return new Response(icsCalendar([event], 'https://zippydj.com/events'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="dj-zippy-${event.slug}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
