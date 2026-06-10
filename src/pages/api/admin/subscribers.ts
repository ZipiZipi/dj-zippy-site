// Admin Subscribers API (Cloudflare Access protects /api/admin/* via middleware)
// GET /api/admin/subscribers              - JSON list (newest first)
// GET /api/admin/subscribers?format=csv   - CSV export for any ESP import

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const db = locals.runtime.env.DB;
    const result = await db
      .prepare('SELECT id, email, source, created_at FROM subscribers ORDER BY created_at DESC')
      .all();
    const rows = (result.results || []) as Array<{ id: number; email: string; source: string; created_at: string }>;

    if (url.searchParams.get('format') === 'csv') {
      const csv = ['email,source,created_at']
        .concat(rows.map(r => `${r.email},${r.source},${r.created_at}`))
        .join('\n');
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="zippy-subscribers.csv"',
        },
      });
    }

    return new Response(JSON.stringify({ success: true, data: rows, count: rows.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch subscribers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
