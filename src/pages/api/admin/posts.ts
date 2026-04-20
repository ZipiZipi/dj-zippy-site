// Admin Posts CRUD API
// GET /api/admin/posts - List all posts
// POST /api/admin/posts - Create post
// PUT /api/admin/posts/[id] - Update post
// DELETE /api/admin/posts/[id] - Delete post

import type { APIRoute } from 'astro';
import type { Post } from '../../../types/database';

export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const db = locals.runtime.env.DB;
    const published = url.searchParams.get('published'); // 'true' or 'false'
    const featured = url.searchParams.get('featured'); // 'true' or 'false'
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = 'SELECT * FROM posts WHERE 1=1';
    const params: (string | number | boolean)[] = [];

    if (published !== null) {
      query += ' AND published = ?';
      params.push(published === 'true');
    }

    if (featured !== null) {
      query += ' AND featured = ?';
      params.push(featured === 'true');
    }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await db.prepare(query).bind(...params).all<Post>();

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM posts WHERE 1=1';
    if (published !== null) countQuery += ' AND published = ?';
    if (featured !== null) countQuery += ' AND featured = ?';

    const countResult = await db
      .prepare(countQuery)
      .bind(...params.slice(0, params.length - 2))
      .first<{ count: number}>();

    return new Response(
      JSON.stringify({
        success: true,
        data: result.results || [],
        count: (result.results || []).length,
        total: countResult?.count || 0,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Get posts error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch posts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = (await request.json()) as Partial<Post>;
    const {
      title,
      slug,
      cover_image,
      content,
      date,
      seo_description,
      author,
      published = true,
      featured = false,
    } = body;

    // Validate required fields
    if (!title || !slug || !content || !date || !seo_description) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Check slug uniqueness
    const existingPost = await locals.runtime.env.DB.prepare('SELECT id FROM posts WHERE slug = ?')
      .bind(slug)
      .first();

    if (existingPost) {
      return new Response(
        JSON.stringify({ success: false, error: 'Slug already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const db = locals.runtime.env.DB;

    const result = await db
      .prepare(
        `INSERT INTO posts (title, slug, cover_image, content, date, seo_description, author, published, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        title,
        slug,
        cover_image || null,
        content,
        date,
        seo_description,
        author || 'DJ Zippy',
        published ? 1 : 0,
        featured ? 1 : 0,
      )
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { id: result.meta.last_row_id, ...body },
        message: 'Post created successfully',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Create post error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const PUT: APIRoute = async ({ request, locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    const body = (await request.json()) as Partial<Post>;
    const { title, slug, cover_image, content, date, seo_description, author, published = true, featured = false } = body;

    if (!title || !slug || !content || !date || !seo_description) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
    }

    const db = locals.runtime.env.DB;
    await db.prepare(
      `UPDATE posts SET title=?, slug=?, cover_image=?, content=?, date=?, seo_description=?, author=?, published=?, featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(title, slug, cover_image||null, content, date, seo_description, author||'DJ Zippy', published?1:0, featured?1:0, id).run();

    return new Response(JSON.stringify({ success: true, message: 'Post updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to update post' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ locals, url }) => {
  try {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ success: false, error: 'Missing id' }), { status: 400 });

    await locals.runtime.env.DB.prepare('DELETE FROM posts WHERE id=?').bind(id).run();

    return new Response(JSON.stringify({ success: true, message: 'Post deleted' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete post' }), { status: 500 });
  }
};
