// Higgsfield teaser pipeline — site side of the automation.
// (Cloudflare Access protects /api/admin/*; automation authenticates with an
//  Access service token. Full loop: docs/teaser-pipeline.md)
//
// GET  /api/admin/teaser
//   → upcoming events whose teaser is pending, each with a ready-made
//     Higgsfield video prompt built from the event facts.
//
// POST /api/admin/teaser  { event_id, video_url, set_hero? = true }
//   → downloads the generated video, stores it in R2 (teasers/<slug>.mp4),
//     marks the event done and (by default) sets it as the homepage hero
//     video + "Download Promo Video" target.

import type { APIRoute } from 'astro';
import { uploadVideoFromURL } from '../../../lib/r2';

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Prompt template for the 9:16 club teaser. Tuned for Seedance/Kling-class models. */
function teaserPrompt(e: { title: string; location: string; date: string; subtitle?: string }) {
  const [y, m, d] = e.date.split('-');
  const niceDate = `${d}.${m}.${y}`;
  return (
    `Vertical 9:16 nightclub promo teaser. Dark moody club interior, ` +
    `silhouetted crowd dancing, hands up, strobe and orange neon lights (#FF5500 accent), ` +
    `DJ behind the decks, haze and light beams, energetic but premium cinematic look. ` +
    `Bold typography overlays appear in rhythm: "DJ ZIPPY", "${(e.subtitle || 'HOUSE MUSIC THERAPY').toUpperCase()}", ` +
    `"${e.title.toUpperCase()} — ${e.location.toUpperCase()}", "${niceDate}". ` +
    `Fast cuts, club energy, no faces in close-up, loopable ending.`
  );
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const res = await db
      .prepare(
        `SELECT id, slug, title, subtitle, location, date, time
         FROM events WHERE status='upcoming' AND teaser_status='pending' ORDER BY date ASC`,
      )
      .all();
    const rows = (res.results || []) as any[];
    return json({
      success: true,
      count: rows.length,
      data: rows.map(e => ({
        ...e,
        prompt: teaserPrompt(e),
        generation: { aspect_ratio: '9:16', duration: 6, resolution: '720p' },
      })),
    });
  } catch (error) {
    console.error('Teaser queue error:', error);
    return json({ success: false, error: 'Failed to read teaser queue' }, 500);
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as {
      event_id?: number;
      video_url?: string;
      poster_url?: string;
      set_hero?: boolean;
    };
    const { event_id, video_url, poster_url, set_hero = true } = body;
    if (!event_id || !video_url) {
      return json({ success: false, error: 'Missing event_id or video_url' }, 400);
    }

    const db = locals.runtime.env.DB;
    const r2 = locals.runtime.env.R2;

    const event = await db
      .prepare('SELECT id, slug, title FROM events WHERE id=?')
      .bind(event_id)
      .first();
    if (!event) return json({ success: false, error: 'Event not found' }, 404);

    const key = `teasers/${event.slug || `event-${event.id}`}.mp4`;
    const upload = await uploadVideoFromURL(r2, video_url, key);
    if (!upload.success) {
      return json({ success: false, error: upload.error || 'R2 upload failed' }, 502);
    }
    // Serve through the site's own /media route — no CDN domain dependency.
    const servedUrl = `/media/${key}`;

    await db
      .prepare(
        `UPDATE events SET teaser_status='done', teaser_video_url=?, teaser_poster_url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      )
      .bind(servedUrl, poster_url || null, event_id)
      .run();

    if (set_hero) {
      await db
        .prepare(
          `INSERT INTO site_settings (key, value, updated_at) VALUES ('hero_video_url', ?, CURRENT_TIMESTAMP)
           ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP`,
        )
        .bind(servedUrl)
        .run();
    }

    return json({
      success: true,
      message: `Teaser ingested for "${event.title}"`,
      video_url: servedUrl,
      hero_updated: !!set_hero,
    });
  } catch (error) {
    console.error('Teaser ingest error:', error);
    return json({ success: false, error: 'Failed to ingest teaser' }, 500);
  }
};
