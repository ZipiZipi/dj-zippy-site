// Admin Login API Endpoint
// POST /api/admin/login - Authenticate and create session cookie

import type { APIRoute } from 'astro';
import { verifyAdminPassword, generateSessionToken } from '../../../middleware/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const body = await request.json() as { password?: string };
    const { password } = body;

    if (!password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Password is required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Verify password
    if (!verifyAdminPassword(password)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid password',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Set secure cookie (7 days) — path '/' so it's sent to /admin/* AND /api/admin/*
    cookies.set('admin_session', sessionToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: import.meta.env.PROD,   // false on localhost, true on Cloudflare
      sameSite: 'strict',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
