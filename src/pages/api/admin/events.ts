// Admin Events CRUD API
// GET    /api/admin/events         - List all events
// POST   /api/admin/events         - Create event
// PUT    /api/admin/events?id=N    - Update event
// DELETE /api/admin/events?id=N    - Delete event

import type { APIRoute } from 'astro';
import type { Event } from '../../../types/database';

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const db = locals.runtime.env.DB;
    const status = url.searchParams.get('status'); // 'upcoming' or 'past'

    let query = 'SELECT * FROM events';
    const params: string[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY date ' + (status === 'past' ? 'DESC' : 'ASC');

    const result = await db.prepare(query).bind(...params).all<Event>();

    return new Response(
      JSON.stringify({
        success: true,
        data: result.results || [],
        count: (result.results || []).length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Get events error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch events' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as Partial<Event>;
    const { title, location, date, status, time, subtitle, description, link, featured } = body;

    // Validate required fields
    if (!title || !location || !date || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const db = locals.runtime.env.DB;

    // New upcoming events are queued for a Higgsfield promo teaser
    // (picked up via GET /api/admin/teaser — see docs/teaser-pipeline.md).
    const teaserStatus = status === 'upcoming' ? 'pending' : 'none';

    const result = await db
      .prepare(
        `INSERT INTO events (title, location, date, status, time, subtitle, description, link, featured, teaser_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(title, location, date, status, time || null, subtitle || null, description || null, link || null, featured ? 1 : 0, teaserStatus)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { id: result.meta.last_row_id, ...body },
        message: 'Event created successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Create event error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create event' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const PUT: APIRoute = async ({ request, locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    const body = (await request.json()) as Partial<Event>;
    const { title, location, date, status, time, subtitle, description, link, featured } = body;

    if (!title || !location || !date || !status) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
    }

    const db = locals.runtime.env.DB;

    // Re-queue the promo teaser when the facts it was generated from change.
    const prev = await db.prepare('SELECT title, location, date FROM events WHERE id=?').bind(id).first();
    const factsChanged = prev && (prev.title !== title || prev.location !== location || prev.date !== date);

    await db.prepare(
      `UPDATE events SET title=?, location=?, date=?, status=?, time=?, subtitle=?, description=?, link=?, featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(title, location, date, status, time||null, subtitle||null, description||null, link||null, featured ? 1 : 0, id).run();

    if (factsChanged && status === 'upcoming') {
      await db.prepare(`UPDATE events SET teaser_status='pending' WHERE id=?`).bind(id).run();
    }

    return new Response(JSON.stringify({ success: true, message: 'Event updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update event' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    await locals.runtime.env.DB.prepare('DELETE FROM events WHERE id=?').bind(id).run();

    return new Response(JSON.stringify({ success: true, message: 'Event deleted' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete event' }), { status: 500 });
  }
};
