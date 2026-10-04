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
  const method = context.request.method;

  // trailingSlash is 'never', so SSR pages (/mixes, /events, /sr…) don't match
  // with a trailing slash and fall through to the 404 catch-all. Prerendered
  // pages are redirected by the assets layer before reaching the worker.
  // The Location is absolute on our own origin and leading slashes are
  // collapsed, so "//evil.com/" can't become a protocol-relative redirect.
  if (
    (method === 'GET' || method === 'HEAD') &&
    pathname.length > 1 &&
    pathname.endsWith('/') &&
    !pathname.startsWith('/api/')
  ) {
    const clean = '/' + pathname.replace(/^\/+|\/+$/g, '');
    return new Response(null, {
      status: 301,
      headers: { Location: context.url.origin + clean + context.url.search },
    });
  }

  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdmin) return next();

  // No Cloudflare Access in local development.
  if (import.meta.env.DEV) return next();

  const accessJwt = context.request.headers.get('Cf-Access-Jwt-Assertion');
  if (!accessJwt) {
    return new Response(
      'Forbidden — this area is protected by Cloudflare Access. ' +
      'Ensure the Access application covers both /admin and /api/admin.',
      { status: 403, headers: { 'Content-Type': 'text/plain' } },
    );
  }

  return next();
});
