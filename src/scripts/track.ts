// What people do on the site, as dataLayer events for GTM (GA4 picks them up
// there) and, when marketing cookies are allowed, as Meta Pixel events.
//
//   contact_click    mailto:, tel:, WhatsApp, Instagram DM      Meta: Contact
//   social_click     Instagram, YouTube, Spotify, Mixcloud, RA… Meta: SocialClick
//   mix_open         a mix card or the hero record              Meta: ViewContent
//   calendar_add     check calendar / Google / .ics / subscribe Meta: AddToCalendar
//   side_switch      the A/B flip or a side filter              Meta: SideSwitch
//   language_switch  EN / SR
// The booking form reports its own booking_form_submit (Footer.astro), and GA4
// measures page views, scrolls and outbound clicks by itself.
// GTM tag "GA4 event - site interactions" forwards these names with their
// parameters; docs/tracking/README.md lists them.

type Params = Record<string, string | undefined>;
type Choice = { analytics: boolean; marketing: boolean };
type Win = Window & {
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
  zippyConsent?: { get(): Choice | null };
};
const w = window as Win;

const PLATFORMS: [RegExp, string][] = [
  [/(^|\.)(instagram\.com|instagr\.am)$/, 'instagram'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)spotify\.com$/, 'spotify'],
  [/(^|\.)mixcloud\.com$/, 'mixcloud'],
  [/(^|\.)soundcloud\.com$/, 'soundcloud'],
  [/(^|\.)deezer\.com$/, 'deezer'],
  [/(^|\.)ra\.co$/, 'resident_advisor'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)music\.apple\.com$/, 'apple_music'],
  [/(^|\.)beatport\.com$/, 'beatport'],
  [/(^|\.)djs\.rs$/, 'djs_rs'],
];

function push(event: string, params: Params) {
  const clean: Params = {};
  Object.entries(params).forEach(([k, v]) => { if (v) clean[k] = v.slice(0, 100); });
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...clean });
}

function meta(kind: 'track' | 'trackCustom', name: string, params: Params = {}) {
  if (!w.zippyConsent?.get()?.marketing || typeof w.fbq !== 'function') return;
  try { w.fbq(kind, name, params); } catch { /* never break a click */ }
}

const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim() || undefined;
const currentSide = () => document.documentElement.dataset.sidePick || 'B';

function platformOf(url: URL): string | undefined {
  const host = url.hostname.replace(/^www\./, '');
  return PLATFORMS.find(([re]) => re.test(host))?.[1];
}

function calendarType(href: string): string | undefined {
  if (href.startsWith('webcal:')) return 'subscribe';
  if (/\.ics(\?|$)/.test(href)) return 'ics';
  if (/calendar\.google\.com/.test(href)) return /action=TEMPLATE/i.test(href) ? 'google' : 'check_day';
  return undefined;
}

function onLink(a: HTMLAnchorElement) {
  const href = a.getAttribute('href') || '';

  // Calendar buttons (the deck, /events)
  const cal = calendarType(href);
  if (cal) {
    const label = a.closest('.cal-actions')?.querySelector('[aria-label]')?.getAttribute('aria-label') ?? '';
    const slug = href.match(/\/calendar\/([^/]+)\.ics/)?.[1] ?? label.split(': ').slice(1).join(': ');
    push('calendar_add', { calendar_type: cal, event_slug: slug || undefined });
    meta('trackCustom', 'AddToCalendar', { calendar_type: cal });
    return;
  }

  // Contact
  if (href.startsWith('mailto:')) { push('contact_click', { contact_method: 'email' }); meta('track', 'Contact', { content_name: 'email' }); return; }
  if (href.startsWith('tel:')) { push('contact_click', { contact_method: 'phone' }); meta('track', 'Contact', { content_name: 'phone' }); return; }

  let url: URL;
  try { url = new URL(href, location.href); } catch { return; }
  if (/^(wa\.me|api\.whatsapp\.com)$/.test(url.hostname) || /(^|\.)ig\.me$/.test(url.hostname) || /(^|\.)m\.me$/.test(url.hostname)) {
    const method = /whatsapp|wa\.me/.test(url.hostname) ? 'whatsapp' : /ig\.me/.test(url.hostname) ? 'instagram_dm' : 'messenger';
    push('contact_click', { contact_method: method });
    meta('track', 'Contact', { content_name: method });
    return;
  }

  // Language switcher
  if (a.closest('[data-lang-switcher]') && a.hreflang) {
    push('language_switch', { language: a.hreflang });
    return;
  }

  if (url.origin === location.origin) return;

  // Mixes: the cards on /mixes and the record at the front of the hero ring
  const card = a.closest<HTMLElement>('.mix-card');
  const ring = a.closest<HTMLElement>('.hring-item');
  if (card || (ring && !ring.hasAttribute('role'))) {
    const title = card ? text(card.querySelector('.mix-card__title')) : ring?.dataset.title;
    const platform = card?.dataset.platform || platformOf(url) || url.hostname;
    const side = card?.dataset.side || currentSide();
    push('mix_open', { mix_title: title, mix_platform: platform, side });
    meta('track', 'ViewContent', { content_name: title, content_category: 'mix', content_type: `side_${side}` });
    return;
  }

  const platform = platformOf(url);
  if (platform) {
    push('social_click', { link_platform: platform, link_url: url.href });
    meta('trackCustom', 'SocialClick', { platform });
  }
}

document.addEventListener('click', (e) => {
  const target = e.target as Element | null;
  if (!target?.closest) return;

  const a = target.closest<HTMLAnchorElement>('a[href]');
  if (a) { onLink(a); return; }

  // The side switches: read the result once sides.ts has applied it.
  const flip = target.closest('[data-side-flip]');
  const filter = target.closest<HTMLElement>('[data-side-filter] [data-side-value]');
  if (flip || filter) {
    const source = flip ? 'header_flip' : 'side_filter';
    setTimeout(() => {
      // The header flip toggles A on and off; off is the B side the site leads with.
      // A side filter can also show both sides ('all').
      const side = document.documentElement.dataset.sidePick || (flip ? 'B' : 'all');
      push('side_switch', { side, side_source: source });
      meta('trackCustom', 'SideSwitch', { side });
    }, 0);
  }
}, true);

export {};
