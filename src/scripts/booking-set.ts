// The set in the booking form (Footer.astro): which side of Zippy the request
// is for and which part of the night. A fader runs over the night from warm-up
// to closing; the waveform above it lights the part being booked, the genres
// near the fader light up and a line under them describes the moment.
//
// The state lives in plain radios, so the form works without this script:
//   input[name="side"]  data-side-choice="B|A|any"   the side pads
//   input[name="set"]   data-stop="0|1|2" data-at=… the stops under the fader
// This script adds dragging, the lit waveform, genres and line, and fills the
// hidden `genres` field (disabled in the markup, so it is only sent once it is
// kept up to date). Until the visitor picks a side in the form, the form
// follows the site-wide A/B pick (sides.ts); B is the default.
//
// Other code can prefill the form before sending people to #contact:
//   document.dispatchEvent(new CustomEvent('booking:prefill', { detail: { side: 'A', set: 'Closing' } }))
// `side` is 'A' | 'B' | 'any'; `set` is a stop index (0–2) or its English value.

export type BookingSide = 'A' | 'B' | 'any';

interface Strings {
  sides: Record<BookingSide, string>;
  lines: { A: string[]; B: string[]; any: string };
}

/** How far either side of the fader (in % of the night) a genre still lights up. */
const REACH = 22;
/** Half of one part of the night: the stretch of waveform lit around the fader. */
const HALF = 100 / 6;
/** A touch has to travel this far sideways before it moves the fader (a tap jumps straight there). */
const SLOP = 6;

const strings = new WeakMap<HTMLFormElement, Strings>();

const getForm = () => document.getElementById('contact-form') as HTMLFormElement | null;
const sideInputs = (f: HTMLFormElement) => Array.from(f.querySelectorAll<HTMLInputElement>('input[name="side"]'));
const stopInputs = (f: HTMLFormElement) => Array.from(f.querySelectorAll<HTMLInputElement>('input[name="set"]'));
const atOf = (stop: HTMLInputElement) => Number(stop.dataset.at);

function sideOf(f: HTMLFormElement): BookingSide {
  const v = sideInputs(f).find((i) => i.checked)?.dataset.sideChoice;
  return v === 'A' || v === 'B' ? v : 'any';
}

function nearestStop(stops: HTMLInputElement[], pos: number): number {
  let best = 0;
  stops.forEach((s, i) => {
    if (Math.abs(atOf(s) - pos) < Math.abs(atOf(stops[best]) - pos)) best = i;
  });
  return best;
}

function checkSide(f: HTMLFormElement, side: BookingSide) {
  const input = sideInputs(f).find((i) => i.dataset.sideChoice === side);
  if (input) input.checked = true;
}

/** Until the visitor picks a side in the form, it shows the side the site is on. */
function followSite(f: HTMLFormElement, pick: string | null = document.documentElement.getAttribute('data-side-pick')) {
  if (f.dataset.bookTouched) return;
  checkSide(f, pick === 'A' ? 'A' : 'B');
}

/**
 * Draws the set from the checked radios. `pos` (0–100 along the night) is the
 * fader while it is being dragged; at rest the fader sits on the checked stop.
 */
function render(f: HTMLFormElement, pos?: number) {
  const stops = stopInputs(f);
  if (!stops.length) return;
  const side = sideOf(f);
  const str = strings.get(f);
  const checked = Math.max(0, stops.findIndex((s) => s.checked));
  const p = pos ?? atOf(stops[checked]);

  f.dataset.bookSide = side;
  f.querySelector<HTMLElement>('[data-book-fader]')?.style.setProperty('--pos', p.toFixed(2));

  const bars = f.querySelectorAll<HTMLElement>('[data-book-wave] > i');
  bars.forEach((bar, i) => {
    bar.classList.toggle('on', Math.abs(((i + 0.5) / bars.length) * 100 - p) <= HALF);
  });

  // Genres sit evenly along the night in the order they are listed; the ones
  // near the fader light up. "Not sure yet" shows both sides' lists.
  const perList: string[] = [];
  const plain: string[] = [];
  f.querySelectorAll<HTMLElement>('[data-book-genres]').forEach((list) => {
    const which = list.dataset.bookGenres as 'A' | 'B';
    const shown = side === 'any' || side === which;
    list.hidden = !shown;
    if (!shown) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-genre]'));
    const lit: string[] = [];
    items.forEach((li, i) => {
      const at = items.length > 1 ? (i / (items.length - 1)) * 100 : 50;
      const on = Math.abs(at - p) <= REACH;
      li.classList.toggle('on', on);
      if (on) lit.push(li.dataset.genre || li.textContent || '');
    });
    perList.push(side === 'any' ? `${which}: ${lit.join(', ')}` : lit.join(', '));
    lit.forEach((g) => { if (!plain.includes(g)) plain.push(g); });
  });
  const out = f.querySelector<HTMLInputElement>('input[name="genres"]');
  if (out) {
    out.value = perList.join(' | ');   // for the email: "B: Disco, Deep House | A: Funk, 2000s"
    out.dataset.plain = plain.join(', ');   // for analytics: one flat list
  }

  const near = nearestStop(stops, p);
  if (str?.lines && str.sides) {
    const line = f.querySelector<HTMLElement>('[data-book-line]');
    const text = side === 'any' ? str.lines.any : str.lines[side][near] ?? '';
    if (line && line.textContent !== text) line.textContent = text;
    const readout = f.querySelector<HTMLElement>('[data-book-readout]');
    const part = stops[near].nextElementSibling?.textContent?.trim() ?? '';
    if (readout) readout.textContent = `${str.sides[side]} · ${part}`;
  }
}

/** Dragging the fader, or tapping anywhere along it. */
function bindFader(f: HTMLFormElement) {
  const fader = f.querySelector<HTMLElement>('[data-book-fader]');
  if (!fader) return;
  let id: number | null = null;
  let live = false;     // a touch only moves the fader once it is clearly a sideways drag
  let x0 = 0;
  let y0 = 0;

  const posAt = (x: number) => {
    const r = fader.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
  };
  const follow = (x: number) => {
    const p = posAt(x);
    const stops = stopInputs(f);
    const near = stops[nearestStop(stops, p)];
    if (!near.checked) near.checked = true;
    render(f, p);
  };
  const end = (e: PointerEvent, tap: boolean) => {
    if (e.pointerId !== id) return;
    if (tap && !live) follow(e.clientX);
    id = null;
    live = false;
    fader.classList.remove('is-dragging');
    render(f);   // settle on the nearest stop
  };

  fader.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    id = e.pointerId;   // a new press always starts over, so a lost gesture can never block the fader
    x0 = e.clientX;
    y0 = e.clientY;
    live = e.pointerType === 'mouse';
    if (live) {
      e.preventDefault();   // no text selection or focus jump while dragging with a mouse
      fader.classList.add('is-dragging');
      follow(e.clientX);
    }
    try { fader.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  });
  fader.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    if (!live) {
      const dx = Math.abs(e.clientX - x0);
      if (dx < SLOP || dx < Math.abs(e.clientY - y0)) return;
      live = true;
      fader.classList.add('is-dragging');
    }
    follow(e.clientX);
  });
  fader.addEventListener('pointerup', (e) => end(e, true));
  fader.addEventListener('pointercancel', (e) => end(e, false));   // the page took the gesture over to scroll
  fader.addEventListener('lostpointercapture', (e) => end(e, false));
}

function init() {
  bindCopy();
  const f = getForm();
  if (!f || f.dataset.bookReady) return;
  f.dataset.bookReady = '1';
  try {
    strings.set(f, JSON.parse(f.dataset.bookStrings || '{}'));
  } catch { /* the line and readout just keep their server text */ }

  const out = f.querySelector<HTMLInputElement>('input[name="genres"]');
  if (out) out.disabled = false;
  followSite(f);

  f.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'side') f.dataset.bookTouched = '1';
    if (t.name === 'side' || t.name === 'set') render(f);
  });

  // A fader stops at its ends, where radios would wrap around; Home/End jump there.
  f.addEventListener('keydown', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name !== 'set') return;
    const stops = stopInputs(f);
    const i = stops.indexOf(t);
    const last = stops.length - 1;
    let to = -1;
    if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = last;
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && i === last) to = last;
    else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && i === 0) to = 0;
    if (to < 0) return;
    e.preventDefault();
    if (!stops[to].checked) {
      stops[to].checked = true;
      render(f);
    }
    stops[to].focus();
  });

  // After a request is sent the form is reset: back to the defaults, then to the site's side.
  f.addEventListener('reset', () => {
    setTimeout(() => {
      delete f.dataset.bookTouched;
      followSite(f);
      render(f);
    });
  });

  // The line is read out only while the visitor is working in the form, not
  // when the header's A/B switch changes it from afar.
  const line = f.querySelector<HTMLElement>('[data-book-line]');
  f.addEventListener('focusin', () => line?.setAttribute('aria-live', 'polite'));
  f.addEventListener('focusout', () => line?.setAttribute('aria-live', 'off'));

  bindFader(f);
  render(f);
  f.classList.add('is-live');
}

/** The copy button next to the email address, where the browser allows it. */
function bindCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    if (btn.dataset.copyReady) return;
    btn.dataset.copyReady = '1';
    if (!navigator.clipboard || !window.isSecureContext) return;
    btn.hidden = false;
    const status = btn.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    let timer = 0;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy || '').then(() => {
        btn.classList.add('is-done');
        if (status) status.textContent = btn.dataset.copied || '';
        clearTimeout(timer);
        timer = window.setTimeout(() => {
          btn.classList.remove('is-done');
          if (status) status.textContent = '';
        }, 2000);
      }).catch(() => { /* nothing copied: the address is right there to select */ });
    });
  });
}

/** What a request is for, for analytics: read it before the form is reset. */
export function bookingLead(f: HTMLFormElement): { side: BookingSide; set: string; genres: string } {
  const set = stopInputs(f).find((s) => s.checked)?.value ?? '';
  const out = f.querySelector<HTMLInputElement>('input[name="genres"]');
  return { side: sideOf(f), set, genres: out?.dataset.plain ?? '' };
}

document.addEventListener('astro:page-load', init);

document.addEventListener('side:change', (e) => {
  const f = getForm();
  if (!f?.dataset.bookReady) return;   // not set up yet: init reads the pick itself
  followSite(f, (e as CustomEvent).detail);
  render(f);
});

document.addEventListener('booking:prefill', (e) => {
  const f = getForm();
  if (!f) return;
  const d = ((e as CustomEvent).detail ?? {}) as { side?: string; set?: number | string };
  if (d.side === 'A' || d.side === 'B' || d.side === 'any') {
    checkSide(f, d.side);
    f.dataset.bookTouched = '1';
  }
  if (d.set !== undefined) {
    const stops = stopInputs(f);
    const stop = typeof d.set === 'number' ? stops[d.set] : stops.find((s) => s.value === d.set);
    if (stop) stop.checked = true;
  }
  if (f.dataset.bookReady) render(f);
});
