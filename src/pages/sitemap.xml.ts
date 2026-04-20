// Sitemap XML Generator
// Generates sitemap for all pages and posts
// Helps Googlebot discover and index all content

import type { APIRoute } from 'astro';
import type { Post } from '../types/database';

// Mock posts (will be fetched from D1 in production)
const posts: Post[] = [
  {
    id: 1,
    title: 'The Evolution of House Music',
    slug: 'evolution-of-house-music',
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    content: 'House music emerged in Chicago...',
    date: '2026-04-19',
    seo_description: 'Explore the rich history and evolution of house music from Chicago to the world.',
    author: 'DJ Zippy',
    published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Deep House Vibes for Summer',
    slug: 'deep-house-summer',
    cover_image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200',
    content: 'Summer is the perfect season...',
    date: '2026-04-15',
    seo_description: 'Discover the best deep house tracks for summer 2026.',
    author: 'DJ Zippy',
    published: true,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Static pages (always included)
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/mixes', priority: '0.9', changefreq: 'weekly' },
  { url: '/events', priority: '0.9', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'weekly' },
  { url: '/links', priority: '0.6', changefreq: 'monthly' },
];

export const GET: APIRoute = async ({ site }) => {
  // Get published posts only
  const publishedPosts = posts.filter((p) => p.published);

  // Build sitemap entries
  const sitemapEntries = [
    ...staticPages.map((page) => ({
      url: page.url,
      lastmod: new Date().toISOString(),
      priority: page.priority,
      changefreq: page.changefreq,
    })),
    ...publishedPosts.map((post) => ({
      url: `/blog/${post.slug}`,
      lastmod: post.updated_at || post.date,
      priority: '0.8',
      changefreq: 'never',
    })),
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${site}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
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
  ${sitemapEntries
    .filter((e) => e.url !== '/')
    .map(
      (entry) => `
  <url>
    <loc>${site}${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>
    `,
    )
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
