// Public newsletter signup (lead magnet).
// POST /api/subscribe  { email, source?, website? }
// `website` is a honeypot — real visitors leave it empty; bots that fill it
// get a fake success and nothing is stored.

import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: { email?: string; source?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid request' }, 400);
  }

  // Honeypot tripped — pretend everything is fine.
  if (payload.website) return json({ success: true });

  const email = (payload.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ success: false, error: 'Please enter a valid email address' }, 400);
  }
  const source = ['inline', 'popup'].includes(payload.source || '') ? payload.source : 'site';

  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return json({ success: false, error: 'Temporarily unavailable' }, 503);
    await db
      .prepare('INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)')
      .bind(email, source)
      .run();
    return json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return json({ success: false, error: 'Temporarily unavailable' }, 503);
  }
};
