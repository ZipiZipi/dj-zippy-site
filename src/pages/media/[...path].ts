// Streams objects from the R2 bucket (e.g. /media/teasers/<slug>.mp4).
// Avoids depending on a custom CDN domain for the bucket: the same relative
// URL works in local dev (miniflare R2) and production. Range requests are
// supported so <video> seeking works.

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const key = params.path;
  if (!key) return new Response('Not found', { status: 404 });

  const r2 = (locals as any).runtime?.env?.R2;
  if (!r2) return new Response('Storage unavailable', { status: 503 });

  const range = request.headers.get('Range');
  let object;
  try {
    object = range
      ? await r2.get(key, { range: parseRange(range) })
      : await r2.get(key);
  } catch {
    object = await r2.get(key); // malformed Range header — serve the whole object
  }
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers({
    'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
    ETag: object.httpEtag,
  });

  if (range && object.range) {
    const r = object.range as { offset: number; length: number };
    headers.set('Content-Range', `bytes ${r.offset}-${r.offset + r.length - 1}/${object.size}`);
    headers.set('Content-Length', String(r.length));
    return new Response(object.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(object.size));
  return new Response(object.body, { status: 200, headers });
};

function parseRange(header: string): { offset: number; length?: number } | undefined {
  const m = header.match(/^bytes=(\d+)-(\d*)$/);
  if (!m) return undefined;
  const offset = parseInt(m[1], 10);
  if (m[2]) return { offset, length: parseInt(m[2], 10) - offset + 1 };
  return { offset };
}
