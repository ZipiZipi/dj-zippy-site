// API endpoint: GET /api/posts.json
// Returns all published posts from D1 database, optionally filtered by featured

import type { APIRoute } from 'astro';
import type { Post, PaginatedResponse } from '../../types/database';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const featured = url.searchParams.get('featured') === 'true';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query based on filters
    let baseQuery = `SELECT * FROM posts WHERE published = 1`;
    if (featured) {
      baseQuery += ` AND featured = 1`;
    }

    // Get total count
    const countResult = await db
      .prepare(baseQuery.replace('SELECT *', 'SELECT COUNT(*) as count'))
      .first<{ count: number }>();

    const total = countResult?.count || 0;

    // Get paginated results
    const postsResult = await db
      .prepare(`
        ${baseQuery}
        ORDER BY date DESC
        LIMIT ? OFFSET ?
      `)
      .bind(limit, offset)
      .all<Post>();

    const posts = (postsResult.results as Post[]) || [];

    const response: PaginatedResponse<Post> = {
      success: true,
      data: posts,
      meta: {
        count: posts.length,
        page,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Posts API Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        meta: { count: 0, page: 1, total: 0, pages: 0 },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
