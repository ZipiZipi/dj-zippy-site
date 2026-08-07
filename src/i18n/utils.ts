// URL <-> language plumbing.
//
// Routing shape: English lives at the bare paths (`/`, `/mixes`, `/about`) and
// Serbian mirrors them under `/sr` (`/sr`, `/sr/mixes`, `/sr/about`). The URL is
// the single source of truth for the active language — nothing reads
// Accept-Language and nothing redirects, so a shared link always opens in the
// language it was shared in.

import { defaultLang, ui, htmlLang, months, type Lang, type Dict } from './ui';

export { languages, defaultLang, htmlLang, ogLocale, type Lang, type Dict } from './ui';

/** The active language for a request URL. Anything not under /sr is English. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'sr' ? 'sr' : defaultLang;
}

/** The translation dictionary for a language. */
export function useTranslations(lang: Lang): Dict {
  return ui[lang];
}

/**
 * Prefixes an app-relative path with the language segment.
 * `localize('/mixes', 'sr')` -> `/sr/mixes`; English paths are returned as-is.
 * External URLs, mailto: and bare hashes pass through untouched.
 */
export function localize(path: string, lang: Lang): string {
  if (!path.startsWith('/')) return path;
  if (lang === defaultLang) return path;
  if (path === '/') return '/sr';
  return `/sr${path}`;
}

/** Strips the language prefix, giving the canonical English path. */
export function stripLang(pathname: string): string {
  if (pathname === '/sr') return '/';
  if (pathname.startsWith('/sr/')) return pathname.slice(3);
  return pathname;
}

/**
 * The same page in the other language, preserving path, query and hash — so the
 * switcher on /mixes lands on /sr/mixes rather than dumping you on the home page.
 */
export function alternateUrl(url: URL, lang: Lang): string {
  const base = stripLang(url.pathname);
  const other: Lang = lang === 'sr' ? 'en' : 'sr';
  return localize(base, other) + url.search + url.hash;
}

/** Absolute URLs for every language, used for hreflang and the sitemap. */
export function alternateLinks(url: URL, site: URL | undefined): { lang: Lang; href: string }[] {
  const base = stripLang(url.pathname);
  const origin = site ? site.origin : url.origin;
  return (['en', 'sr'] as Lang[]).map((l) => ({ lang: l, href: origin + localize(base, l) }));
}

/** Split a YYYY-MM-DD string into display parts without timezone surprises. */
export function dateParts(date: string, lang: Lang): { day: string; month: string; year: string } {
  const [y, m, d] = date.split('-');
  const mi = Math.max(1, Math.min(12, parseInt(m || '1', 10))) - 1;
  return { day: (d || '01').padStart(2, '0'), month: months[lang][mi], year: y || '' };
}

/** Locale-aware long/short date, used by the blog. */
export function formatDate(
  date: string,
  lang: Lang,
  month: 'short' | 'long' = 'short',
): string {
  return new Date(date).toLocaleDateString(lang === 'sr' ? 'sr-Latn-RS' : 'en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
  });
}
