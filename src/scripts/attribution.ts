// Where a visitor came from, and what a campaign link asks the site to open.
//
// Campaign links (Instagram bio and stories, ads, WhatsApp, press) carry UTM
// tags; docs/tracking/README.md has the convention and ready-made links. On the
// first page of a visit this module:
//   - picks the side the link asks for: ?side=a|b, or a utm_campaign /
//     utm_content / utm_term that names it (a-side, open-format, core-memories ->
//     A; b-side, underground, hmt, house-music-therapy -> B);
//   - switches language when the link says so (?lang=sr on an English page, or
//     ?lang=en on a Serbian one), keeping every other parameter;
//   - works out the source of the visit (UTM tags first, then click IDs, then the
//     referrer) and remembers it for the rest of the visit.
// The booking form gets that source in a hidden field ([data-attribution]), so a
// booking email says how the person found the site. The very first source is
// also kept in localStorage for 90 days, but only once analytics is allowed.

type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  landing: string;
  referrer?: string;
  date: string;
};
type Choice = { analytics: boolean; marketing: boolean };

const STORE = 'zippy_ft';
const KEEP_DAYS = 90;

const SIDE_A = /(?:^|[^a-z])(?:a[-_ ]?side|side[-_ ]?a|open[-_ ]?format|core[-_ ]?memories)(?:[^a-z]|$)/i;
const SIDE_B = /(?:^|[^a-z])(?:b[-_ ]?side|side[-_ ]?b|underground|hmt|house[-_ ]?music[-_ ]?therapy)(?:[^a-z]|$)/i;
const SEARCH = /(?:^|\.)(google|bing|duckduckgo|yahoo|yandex|ecosia|search\.brave)\./i;
const SOCIAL = /(?:^|\.)(instagram|facebook|fb|messenger|t|twitter|x|tiktok|youtube|linkedin|threads|reddit|snapchat|whatsapp|telegram)\.(?:com|me|co|net|org)$/i;

const consent = (): Choice | null =>
  (window as unknown as { zippyConsent?: { get(): Choice | null } }).zippyConsent?.get() ?? null;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function externalReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const host = new URL(document.referrer).hostname;
    return host && host !== location.hostname ? host.replace(/^www\./, '') : undefined;
  } catch {
    return undefined;
  }
}

function touchFromLanding(): Touch | null {
  const p = new URLSearchParams(location.search);
  const utm = (k: string) => p.get(`utm_${k}`)?.trim() || undefined;
  const referrer = externalReferrer();
  let source = utm('source');
  let medium = utm('medium');
  if (!source) {
    if (p.get('gclid') || p.get('gbraid') || p.get('wbraid')) { source = 'google'; medium = 'cpc'; }
    else if (p.get('fbclid')) { source = referrer?.includes('instagram') ? 'instagram' : 'facebook'; medium ??= 'social'; }
    else if (referrer) {
      source = referrer;
      medium = SEARCH.test(referrer) ? 'organic' : SOCIAL.test(referrer) ? 'social' : 'referral';
    } else return null;
  }
  return {
    source,
    medium: medium ?? '(none)',
    campaign: utm('campaign'),
    content: utm('content'),
    landing: location.pathname,
    referrer,
    date: today(),
  };
}

function loadFirst(): Touch | null {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Touch & { keepUntil?: number };
    if (!saved.keepUntil || saved.keepUntil < Date.now()) { localStorage.removeItem(STORE); return null; }
    return saved;
  } catch {
    return null;
  }
}

function saveFirst(t: Touch) {
  try {
    if (localStorage.getItem(STORE)) return;
    localStorage.setItem(STORE, JSON.stringify({ ...t, keepUntil: Date.now() + KEEP_DAYS * 864e5 }));
  } catch { /* storage blocked: the visit's own source still goes into the form */ }
}

const describe = (t: Touch) =>
  [t.source, t.medium, t.campaign, t.content].filter(Boolean).join(' / ');

// ---- the first page of the visit -------------------------------------------------

const landing = touchFromLanding();
let stored = loadFirst();
const visit: Touch = landing ?? { source: '(direct)', medium: '(none)', landing: location.pathname, date: today() };

function summary(): string {
  const parts = [describe(visit), `landing ${visit.landing}`];
  if (visit.referrer && visit.referrer !== visit.source) parts.push(`ref ${visit.referrer}`);
  const first = stored;
  if (first && consent()?.analytics && describe(first) !== describe(visit)) parts.push(`first visit ${first.date} via ${describe(first)}`);
  return parts.join(' · ');
}

function fill() {
  const text = summary();
  document.querySelectorAll<HTMLInputElement>('input[data-attribution]').forEach((input) => { input.value = text; });
}

function remember() {
  const c = consent();
  if (c && !c.analytics) {
    try { localStorage.removeItem(STORE); } catch { /* storage blocked */ }
    stored = null;
    return;
  }
  if (landing && c?.analytics) saveFirst(landing);
}

function sideFromLink(): 'A' | 'B' | null {
  const p = new URLSearchParams(location.search);
  const s = (p.get('side') ?? '').trim().toUpperCase();
  if (s === 'A' || s === 'B') return s;
  const said = ['utm_campaign', 'utm_content', 'utm_term'].map((k) => p.get(k) ?? '').join(' ');
  if (SIDE_A.test(said)) return 'A';
  if (SIDE_B.test(said)) return 'B';
  return null;
}

function languageRedirect(): boolean {
  const p = new URLSearchParams(location.search);
  const want = (p.get('lang') ?? '').toLowerCase();
  if (want !== 'sr' && want !== 'en') return false;
  const onSr = location.pathname === '/sr' || location.pathname.startsWith('/sr/');
  p.delete('lang');
  const query = p.toString() ? `?${p}` : '';
  if (want === 'sr' && !onSr) {
    location.replace(`/sr${location.pathname === '/' ? '' : location.pathname}${query}${location.hash}`);
    return true;
  }
  if (want === 'en' && onSr) {
    location.replace(`${location.pathname.replace(/^\/sr/, '') || '/'}${query}${location.hash}`);
    return true;
  }
  return false;
}

const redirecting = languageRedirect();
const linkSide = redirecting ? null : sideFromLink();
let sideApplied = false;
// Right away, before the first paint settles: sides.ts (imported first) is
// already listening, and the page's controls are parsed by now.
if (linkSide) {
  sideApplied = true;
  document.dispatchEvent(new CustomEvent('side:set', { detail: linkSide }));
}

remember();
document.addEventListener('zippy:consent', remember);

document.addEventListener('astro:page-load', () => {
  fill();
  if (linkSide && !sideApplied) {
    sideApplied = true;
    document.dispatchEvent(new CustomEvent('side:set', { detail: linkSide }));
  }
});
// The booking form reads its fields on submit: make sure the source is there first.
document.addEventListener('submit', fill, true);

// Pages without view transitions (the links page) never get astro:page-load.
if (document.readyState !== 'loading') fill();
else document.addEventListener('DOMContentLoaded', fill, { once: true });

export {};
