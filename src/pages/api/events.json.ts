// API endpoint: GET /api/events.json
// Returns all upcoming and past events from D1 database

import type { APIRoute } from 'astro';
import type { Event, ApiResponse } from '../../types/database';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime.env.DB;

    // Query upcoming events (sorted by date ascending)
    const upcomingEvents = await db
      .prepare(`
        SELECT * FROM events
        WHERE status = 'upcoming'
        ORDER BY date ASC
      `)
      .all<Event>();

    // Query past events (sorted by date descending)
    const pastEvents = await db
      .prepare(`
        SELECT * FROM events
        WHERE status = 'past'
        ORDER BY date DESC
      `)
      .all<Event>();

    const response: ApiResponse<{
      upcoming: Event[];
      past: Event[];
    }> = {
      success: true,
      data: {
        upcoming: (upcomingEvents.results as Event[]) || [],
        past: (pastEvents.results as Event[]) || [],
      },
      meta: {
        count: ((upcomingEvents.results as Event[])?.length || 0) +
               ((pastEvents.results as Event[])?.length || 0),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Events API Error:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events',
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
