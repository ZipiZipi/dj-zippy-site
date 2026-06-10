// Admin Image Upload Endpoint
// POST /api/admin/upload - Upload image to R2 and return public URL

import type { APIRoute } from 'astro';
import { uploadImage, generateR2URL } from '../../../lib/r2';

export const prerender = false;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const adminSession = request.headers.get('cookie')?.includes('admin_session');
    if (!adminSession) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: 'File size exceeds 10MB limit' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const r2 = locals.runtime.env.R2;
    if (!r2) {
      return new Response(
        JSON.stringify({ success: false, error: 'R2 storage not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Upload to R2
    const result = await uploadImage(r2, file, 'posts');

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Upload failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: result.url,
        key: result.key,
        message: 'Image uploaded successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Upload error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
