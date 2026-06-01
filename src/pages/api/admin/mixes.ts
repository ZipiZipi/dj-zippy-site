// Admin Mixes CRUD API
// GET    /api/admin/mixes        - List all mixes
// POST   /api/admin/mixes        - Create mix
// PUT    /api/admin/mixes?id=N   - Update mix
// DELETE /api/admin/mixes?id=N   - Delete mix

import type { APIRoute } from 'astro';
import type { Mix } from '../../../types/database';

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const db = locals.runtime.env.DB;
    const published = url.searchParams.get('published'); // 'true' or 'false'
    const featured = url.searchParams.get('featured'); // 'true' or 'false'
    const genre = url.searchParams.get('genre');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM mixes WHERE 1=1';
    const params: (string | number | boolean)[] = [];

    if (published !== null) {
      query += ' AND published = ?';
      params.push(published === 'true');
    }

    if (featured !== null) {
      query += ' AND featured = ?';
      params.push(featured === 'true');
    }

    if (genre) {
      query += ' AND genre = ?';
      params.push(genre);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await db.prepare(query).bind(...params).all<Mix>();

    return new Response(
      JSON.stringify({
        success: true,
        data: result.results || [],
        count: (result.results || []).length,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch mixes',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (request.method !== 'POST') return new Response(null, { status: 405 });

    const db = locals.runtime.env.DB;
    const body = await request.json();

    const { title, slug, genre, platform, link, description, cover_image, published, featured } = body;

    if (!title || !slug || !platform || !link || !genre) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields (title, platform, link, genre)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();
    const query = `
      INSERT INTO mixes (title, slug, genre, platform, link, duration, description, cover_image, published, featured, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db
      .prepare(query)
      .bind(title, slug, genre, platform, link, 0, description || null, cover_image || null, published ? 1 : 0, featured ? 1 : 0, now, now)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mix created successfully',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create mix',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request, locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    const body = await request.json() as Partial<Mix> & { platform?: string; link?: string };
    const { title, slug, genre, platform, link, description, cover_image, published, featured } = body;

    if (!title || !slug || !platform || !link || !genre) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields (title, platform, link, genre)' }), { status: 400 });
    }

    await locals.runtime.env.DB.prepare(
      `UPDATE mixes SET title=?, slug=?, genre=?, platform=?, link=?, description=?, cover_image=?, published=?, featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(title, slug, genre, platform, link, description||null, cover_image||null, published?1:0, featured?1:0, id).run();

    return new Response(JSON.stringify({ success: true, message: 'Mix updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update mix' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    await locals.runtime.env.DB.prepare('DELETE FROM mixes WHERE id=?').bind(id).run();

    return new Response(JSON.stringify({ success: true, message: 'Mix deleted' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete mix' }), { status: 500 });
  }
};
