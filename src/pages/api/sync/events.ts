// Google Sheets → D1 sync for upcoming events.
// POST /api/sync/events   Authorization: Bearer <SYNC_TOKEN>
// Body: { events: [{ date: "YYYY-MM-DD", time?, title, subtitle? }] }
//
// The Apps Script bound to the gig sheet sends every row above its
// "PAST EVENTS" divider. This lives outside /api/admin because Cloudflare
// Access guards that prefix and a Google script can't pass its login; the
// shared SYNC_TOKEN secret (`wrangler secret put SYNC_TOKEN`) stands in for it.
//
// Rows are matched on date + venue title, so an event already entered by hand
// in the admin is updated instead of duplicated. Sheet-created events that
// disappear from the payload are deleted if still in the future (cancelled or
// moved) and flipped to `past` once their date has gone by. Any upcoming event
// whose date has passed, sheet-made or not, is moved to `past` as well.

import type { APIRoute } from 'astro';

export const prerender = false;

interface SheetEvent {
  date: string;
  time?: string;
  title: string;
  subtitle?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Today's date in Serbia, where every gig on the sheet happens. */
function todayBelgrade(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade' }).format(new Date());
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'dj')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Constant-time compare so the token can't be guessed byte by byte. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const expected: string | undefined = env.SYNC_TOKEN;
  const given = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!expected || !safeEqual(given, expected)) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }

  let events: SheetEvent[];
  try {
    const body = (await request.json()) as { events?: SheetEvent[] };
    events = Array.isArray(body.events) ? body.events : [];
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }

  const bad = events.find((e) => !e?.title?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(e?.date ?? ''));
  if (bad) return json({ success: false, error: 'Every event needs title and YYYY-MM-DD date', row: bad }, 400);

  const db = env.DB;
  const today = todayBelgrade();
  const seen = new Set<number>();
  let inserted = 0;
  let updated = 0;

  try {
    for (const e of events) {
      const title = e.title.trim();
      const time = (e.time ?? '').trim();
      const subtitle = (e.subtitle ?? '').trim();
      const status = e.date >= today ? 'upcoming' : 'past';

      const existing = await db
        .prepare('SELECT id FROM events WHERE date = ? AND lower(title) = lower(?) LIMIT 1')
        .bind(e.date, title)
        .first<{ id: number }>();

      if (existing) {
        await db
          .prepare(
            `UPDATE events SET time = ?, subtitle = COALESCE(NULLIF(?, ''), subtitle), status = ?,
               updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          )
          .bind(time, subtitle, status, existing.id)
          .run();
        seen.add(existing.id);
        updated++;
        continue;
      }

      // The sheet only has the venue; reuse the city from its last appearance.
      const known = await db
        .prepare(
          `SELECT location, country FROM events WHERE lower(title) = lower(?) AND location != ''
           ORDER BY date DESC LIMIT 1`,
        )
        .bind(title)
        .first<{ location: string; country: string | null }>();

      const res = await db
        .prepare(
          `INSERT INTO events (slug, title, subtitle, location, country, date, time, status, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        )
        .bind(
          `sheet-${slugify(title)}-${e.date}`,
          title,
          subtitle || null,
          known?.location ?? 'Novi Sad',
          known?.country ?? 'RS',
          e.date,
          time,
          status,
        )
        .run();
      seen.add(Number(res.meta.last_row_id));
      inserted++;
    }

    // Sheet-owned upcoming events no longer on the sheet.
    const stale = await db
      .prepare(`SELECT id, date FROM events WHERE slug LIKE 'sheet-%' AND status = 'upcoming'`)
      .all<{ id: number; date: string }>();
    let removed = 0;
    let archived = 0;
    for (const row of stale.results ?? []) {
      if (seen.has(row.id)) continue;
      if (row.date >= today) {
        await db.prepare('DELETE FROM events WHERE id = ?').bind(row.id).run();
        removed++;
      } else {
        await db.prepare(`UPDATE events SET status = 'past' WHERE id = ?`).bind(row.id).run();
        archived++;
      }
    }

    // Nothing flips status on its own, so gone-by admin entries linger as upcoming too.
    const flipped = await db
      .prepare(`UPDATE events SET status = 'past' WHERE status = 'upcoming' AND date < ?`)
      .bind(today)
      .run();
    archived += flipped.meta.changes ?? 0;

    return json({ success: true, inserted, updated, removed, archived });
  } catch (error) {
    console.error('Sheet sync error:', error);
    return json({ success: false, error: 'Sync failed' }, 500);
  }
};
