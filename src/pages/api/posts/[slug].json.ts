// API endpoint: GET /api/posts/[slug].json
// Returns a single published post by slug from D1 database

export const prerender = false;

import type { APIRoute } from 'astro';
import type { Post, ApiResponse } from '../../../types/database';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { slug } = params;

    if (!slug) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Slug parameter is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const db = locals.runtime.env.DB;

    const post = await db
      .prepare('SELECT * FROM posts WHERE slug = ? AND published = 1')
      .bind(slug)
      .first<Post>();

    if (!post) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Post not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const response: ApiResponse<Post> = {
      success: true,
      data: post,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Post Detail API Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
