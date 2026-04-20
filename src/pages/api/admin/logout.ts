// Admin Logout API Endpoint
// POST /api/admin/logout - Clear session cookie and redirect to login

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Clear the session cookie
  cookies.delete('admin_session', { path: '/' });

  // Redirect to login page
  return redirect('/admin/login');
};
