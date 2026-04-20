// Astro middleware — runs on every request
// Protects /admin/* and /api/admin/* routes

import { defineMiddleware } from 'astro:middleware';
import { validateSessionToken } from './auth';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/admin/login',
  '/api/admin/login',
  '/api/admin/logout',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Only intercept admin routes
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi  = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return next();
  }

  // Always allow public routes through
  if (PUBLIC_ROUTES.includes(pathname)) {
    return next();
  }

  // Check session cookie
  const token = cookies.get('admin_session')?.value;
  const authenticated = token ? validateSessionToken(token) : false;

  if (!authenticated) {
    // API routes return 401 JSON, page routes redirect to login
    if (isAdminApi) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }
    return redirect('/admin/login');
  }

  return next();
});
