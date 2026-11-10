// Sitemap XML
// Every indexable page once per language, with reciprocal xhtml:link
// alternates so Google pairs /about with /sr/about instead of treating them as
// duplicates. noindex pages (/gallery, /blog, 404s) stay out: listing a page
// the site asks not to index only earns a Search Console warning.
//
// <lastmod> has to be honest or Google learns to ignore it, so it is never
// the build or request time. The sitemap is rendered on demand and reads the
// dates from what actually changes each page:
//   /events  the newest gig added, or the last gig that has since been played
//            (it moves from the upcoming list to the archive)
//   /mixes   the newest mix added or edited
//   /        whichever of those two is newer: the home page shows both
// plus TEMPLATE_EDITED, the last time the page templates or copy changed.
// `events.updated_at` is not used: the gig-sheet sync touches it on every run
// even when nothing changed.
//
// Bump TEMPLATE_EDITED (or a page's own `edited`) when page copy or layout
// changes in a deploy.

import type { APIRoute } from 'astro';
import { localize, htmlLang, type Lang } from '../i18n/utils';

export const prerender = false;

const LOCALES: Lang[] = ['en', 'sr'];
const TEMPLATE_EDITED = '2026-11-10';

type Source = 'events' | 'mixes';

// Indexable pages, as canonical (English) paths.
const pages: { path: string; priority: string; changefreq: string; sources?: Source[]; edited?: string; image?: boolean }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly', sources: ['events', 'mixes'], image: true },
  { path: '/events', priority: '0.9', changefreq: 'weekly', sources: ['events'] },
  { path: '/mixes', priority: '0.9', changefreq: 'weekly', sources: ['mixes'] },
  { path: '/about', priority: '0.8', changefreq: 'monthly', image: true },
  { path: '/links', priority: '0.6', changefreq: 'monthly' },
];

/** Today in Serbia, where the gigs happen. */
const todayBelgrade = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Belgrade' }).format(new Date());

/** 'YYYY-MM-DD…' (D1 timestamps are 'YYYY-MM-DD HH:MM:SS') → 'YYYY-MM-DD', or '' if it is not a date. */
const day = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : '');

const newest = (...dates: string[]) => dates.filter(Boolean).sort().pop() ?? '';

async function sourceDates(db: any): Promise<Record<Source, string>> {
  const out: Record<Source, string> = { events: '', mixes: '' };
  if (!db) return out;
  const today = todayBelgrade();
  try {
    const ev = await db
      .prepare('SELECT MAX(created_at) AS added, MAX(CASE WHEN date <= ?1 THEN date END) AS played FROM events')
      .bind(today)
      .first();
    out.events = newest(day(ev?.added), day(ev?.played));
  } catch { /* no events table: fall back to the template date */ }
  try {
    const mx = await db
      .prepare('SELECT MAX(created_at) AS added, MAX(updated_at) AS edited FROM mixes WHERE published = 1')
      .first();
    out.mixes = newest(day(mx?.added), day(mx?.edited));
  } catch { /* same */ }
  // A timestamp from the future (clock skew, a typo in the admin) is never passed on.
  for (const k of Object.keys(out) as Source[]) if (out[k] > today) out[k] = today;
  return out;
}

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site, locals }) => {
  const origin = (site ?? new URL('https://zippydj.com')).origin;
  const db = (locals as any).runtime?.env?.DB;
  const dates = await sourceDates(db);

  const url = (path: string, lang: Lang) => `${origin}${localize(path, lang)}`;

  const entries = pages.flatMap((page) => {
    const lastmod = newest(TEMPLATE_EDITED, page.edited ?? '', ...(page.sources ?? []).map((s) => dates[s]));
    const alternates = LOCALES.map(
      (alt) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[alt]}" href="${url(page.path, alt)}" />`,
    ).join('\n');
    // The portrait is on the page (home intro, About hero); Google reads only image:loc.
    const image = page.image
      ? `\n    <image:image>\n      <image:loc>${escapeXml(`${origin}/images/dj-zippy-house-music-dj.webp`)}</image:loc>\n    </image:image>`
      : '';

    return LOCALES.map((lang) => `  <url>
    <loc>${url(page.path, lang)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.path, 'en')}" />${image}
  </url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
