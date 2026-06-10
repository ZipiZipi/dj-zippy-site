// Astro middleware — runs on every request.
// Admin auth is handled by Cloudflare Access (Zero Trust) at the edge: it
// protects /admin* and /api/admin* and injects a signed `Cf-Access-Jwt-Assertion`
// header on authenticated requests (Cloudflare strips any client-supplied value).
// We fail closed: any admin request that arrives WITHOUT that header (i.e. a path
// not covered by the Access application, or a bypass attempt) is rejected.
//
// Local dev (`astro dev`) has no Access in front, so the check is skipped there.

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  // /epk (press kit for agents) gets the same fail-closed Access treatment as
  // the admin area — it needs its own Access application in the CF dashboard.
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname === '/epk';
  if (!isProtected) return next();

  // No Cloudflare Access in local development.
  if (import.meta.env.DEV) return next();

  const accessJwt = context.request.headers.get('Cf-Access-Jwt-Assertion');
  if (!accessJwt) {
    return new Response(
      'Forbidden — this area is protected by Cloudflare Access. ' +
      'Ensure an Access application covers this path (/admin, /api/admin, /epk).',
      { status: 403, headers: { 'Content-Type': 'text/plain' } },
    );
  }

  return next();
});
