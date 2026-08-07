// Sitemap XML Generator
// Emits every indexable page once per language, with reciprocal xhtml:link
// alternates so Google can pair /about with /sr/about instead of treating them
// as duplicates.

import type { APIRoute } from 'astro';
import { localize, htmlLang, type Lang } from '../i18n/utils';

const LOCALES: Lang[] = ['en', 'sr'];

// Indexable pages, as canonical (English) paths. /gallery and /blog are
// deliberately absent — both are noindex.
const pages: { path: string; priority: string; changefreq: string; extra?: string }[] = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    extra: `
    <image:image>
      <image:loc>https://zippydj.com/images/dj-zippy-house-music-dj.webp</image:loc>
      <image:title>DJ Zippy — House Music Therapy</image:title>
    </image:image>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/pbT603mKdsc/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>EXIT 2024 | Zippy live at AS FM Stage FULL SHOW</video:title>
      <video:description>Zippy live performance at EXIT Festival 2024, AS FM Stage.</video:description>
      <video:player_loc>https://www.youtube.com/embed/pbT603mKdsc</video:player_loc>
      <video:duration>3608</video:duration>
      <video:publication_date>2024-08-09T00:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`,
  },
  {
    path: '/mixes',
    priority: '0.9',
    changefreq: 'weekly',
    extra: `
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/IzkAZcbyCSI/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>House Music Therapy / #LetsMixIt Contest</video:title>
      <video:description>DJ Zippy's high-energy rooftop set recorded in Novi Sad for the #LetsMixIt competition.</video:description>
      <video:player_loc>https://www.youtube.com/embed/IzkAZcbyCSI</video:player_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/c1M_dMg_CcU/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>House Music Therapy / Deep &amp; Tech Grooves</video:title>
      <video:description>DJ Zippy's curated mix blending deep basslines with rhythmic tech house elements.</video:description>
      <video:player_loc>https://www.youtube.com/embed/c1M_dMg_CcU</video:player_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`,
  },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/links', priority: '0.6', changefreq: 'monthly' },
];

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://zippydj.com')).origin;
  const now = new Date().toISOString();

  const url = (path: string, lang: Lang) => `${origin}${localize(path, lang)}`;

  const entries = pages.flatMap((page) =>
    LOCALES.map((lang) => {
      const alternates = LOCALES.map(
        (alt) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[alt]}" href="${url(page.path, alt)}" />`,
      ).join('\n');

      return `  <url>
    <loc>${url(page.path, lang)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.path, 'en')}" />${page.extra ?? ''}
  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
