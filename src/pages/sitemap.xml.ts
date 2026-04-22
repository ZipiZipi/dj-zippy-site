// Sitemap XML Generator
// Generates sitemap for all pages
// Helps Googlebot discover and index all content

import type { APIRoute } from 'astro';

// Static pages (always included)
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/mixes', priority: '0.9', changefreq: 'weekly' },
  { url: '/events', priority: '0.9', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { url: '/links', priority: '0.6', changefreq: 'monthly' },
];

export const GET: APIRoute = async ({ site }) => {
  const now = new Date().toISOString();

  const sitemapEntries = staticPages.map((page) => ({
    url: page.url,
    lastmod: now,
    priority: page.priority,
    changefreq: page.changefreq,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${site}images/dj-zippy-house-music-dj.webp</image:loc>
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
    </video:video>
  </url>
  <url>
    <loc>${site}mixes</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/IzkAZcbyCSI/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>House Music Therapy / #LetsMixIt Contest</video:title>
      <video:description>DJ Zippy's high-energy rooftop set recorded in Novi Sad for the #LetsMixIt competition.</video:description>
      <video:player_loc>https://www.youtube.com/embed/IzkAZcbyCSI</video:player_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/c1M_dMg_CcU/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>House Music Therapy / Deep & Tech Grooves</video:title>
      <video:description>DJ Zippy's curated mix blending deep basslines with rhythmic tech house elements.</video:description>
      <video:player_loc>https://www.youtube.com/embed/c1M_dMg_CcU</video:player_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>
  ${sitemapEntries
    .filter((e) => e.url !== '/' && e.url !== '/mixes')
    .map(
      (entry) => `<url>
    <loc>${site}${entry.url.replace(/^\//, '')}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n  ')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
