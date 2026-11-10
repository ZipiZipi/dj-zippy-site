// The dates deck (DatesDeck.astro): upcoming gigs as cue points on a waveform.
//
// The waveform is a timeline that starts today. Dragging across it moves a
// playhead through the coming weeks and the display follows with the next gig
// from that point on. Each gig also has a numbered marker on the waveform and a
// pad underneath. Choosing a gig plays its track previews (src/lib/previews.ts).

interface Track { title: string; artist: string; src: string; start: number; length: number }
interface Gig {
  n: number;
  side: 'A' | 'B';
  sideShort: string;
  sideText: string;
  title: string;
  name: string;
  meta: string;
  sound: string;
  startMs: number;
  endMs: number;
  allDay: boolean;
  tracks: Track[];
}
type Intent = 'click' | 'hover' | 'none';

const DAY = 86_400_000;
const MUTE_KEY = 'zippy-preview-muted';
const FADE = 0.4;        // seconds of fade at each end of a clip
const START_DELAY = 220; // ms a gig has to stay selected before its preview starts

function initDeck() {
  const root = document.getElementById('deck');
  if (!root || root.dataset.deckReady) return;
  root.dataset.deckReady = '1';

  const gigs: Gig[] = JSON.parse(root.dataset.gigs || '[]');
  const str: Record<string, string> = JSON.parse(root.dataset.strings || '{}');
  if (!gigs.length) return;

  const part = <T extends HTMLElement = HTMLElement>(name: string) => root.querySelector<T>(`[data-deck="${name}"]`);
  const wave = part('wave')!, barsEl = part('bars')!, ph = part('ph')!, phLabel = part('phlabel')!;
  const cue = part('cue')!, count = part('count')!, title = part('title')!, nameEl = part('name')!, meta = part('meta')!, sound = part('sound')!;
  const pads = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-deck-pad]'));
  const marks = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-deck-mark]'));
  const cals = Array.from(root.querySelectorAll<HTMLElement>('[data-deck-cal]'));
  const dateFmt = new Intl.DateTimeFormat(root.dataset.lang === 'sr' ? 'sr-Latn-RS' : 'en-GB', { day: 'numeric', month: 'short' });
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  // --- the timeline: today on the left, a little past the last gig on the right ---
  const now = Date.now();
  const t0 = Math.min(now, gigs[0].startMs);
  const span = Math.max(gigs[gigs.length - 1].startMs + 3 * DAY, t0 + 28 * DAY) - t0;
  const posOf = (g: Gig) => clamp01((g.startMs - t0) / span);

  // Bars are drawn once. The shape is fixed noise that swells around each gig,
  // so the nights read as the loud parts of the track.
  const N = window.innerWidth < 640 ? 48 : 84;
  const bars: HTMLElement[] = [];
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) / N;
    const noise = Math.abs(Math.sin(i * 0.9)) * 0.5 + Math.abs(Math.sin(i * 0.37)) * 0.3 + Math.abs(Math.sin(i * 2.3)) * 0.2;
    let h = 0.16 + 0.26 * noise;
    for (const g of gigs) h += 0.6 * Math.exp(-((u - posOf(g)) ** 2) / (2 * 0.03 ** 2));
    const bar = document.createElement('i');
    bar.style.setProperty('--h', `${Math.round(Math.min(1, h) * 100)}%`);
    barsEl.appendChild(bar);
    bars.push(bar);
  }
  marks.forEach((m, i) => { m.style.left = `${(posOf(gigs[i]) * 100).toFixed(2)}%`; });

  let sel = -1;
  let p = 0;   // playhead, 0..1 along the timeline
  let pick = document.documentElement.dataset.sidePick ?? 'all';
  const visible = (g: Gig) => pick === 'all' || g.side === pick;

  function setPlayhead(v: number) {
    p = clamp01(v);
    bars.forEach((b, i) => b.classList.toggle('on', (i + 0.5) / N <= p));
    ph.style.left = `${(p * 100).toFixed(2)}%`;
    const at = t0 + p * span;
    const label = Math.abs(at - Date.now()) < DAY / 2 ? str.today : dateFmt.format(new Date(at));
    phLabel.textContent = label;
    ph.dataset.edge = p < 0.07 ? 'start' : p > 0.93 ? 'end' : '';
    ph.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    ph.setAttribute('aria-valuetext', label);
  }

  /** The next visible gig from the playhead on; the last one once the playhead is past them all. */
  function gigAt(v: number): number {
    let last = -1;
    for (let i = 0; i < gigs.length; i++) {
      if (!visible(gigs[i])) continue;
      if (posOf(gigs[i]) >= v - 0.004) return i;
      last = i;
    }
    return last;
  }

  function tick() {
    const g = gigs[sel];
    if (!g) return;
    const ms = g.startMs - Date.now();
    if (ms <= 0) { count.textContent = Date.now() < g.endMs ? str.onNow : str.played; return; }
    if (g.allDay) { count.textContent = `−${Math.ceil(ms / DAY)}d`; return; }
    const s = Math.floor(ms / 1000);
    const two = (n: number) => String(n).padStart(2, '0');
    count.textContent = `−${Math.floor(s / 86400)}d ${two(Math.floor((s % 86400) / 3600))}:${two(Math.floor((s % 3600) / 60))}:${two(s % 60)}`;
  }
  const timer = window.setInterval(() => {
    if (!root.isConnected) { clearInterval(timer); return; }   // page swapped by a view transition
    tick();
  }, 1000);

  function select(i: number, opts: { move: boolean; play: Intent }) {
    const g = gigs[i];
    if (!g) return;
    sel = i;
    root!.dataset.side = g.side;
    cue.textContent = `${str.cue} ${g.n} · ${g.sideText}`;
    title.textContent = g.title;
    nameEl.textContent = g.name ? ` — ${g.name}` : '';
    meta.textContent = g.meta;
    sound.textContent = g.sound;
    pads.forEach((el, n) => el.setAttribute('aria-pressed', n === i ? 'true' : 'false'));
    marks.forEach((el, n) => (n === i ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current')));
    cals.forEach((el, n) => {
      el.hidden = n !== i;
      if (n !== i) el.querySelector<HTMLDetailsElement>('details[open]')?.removeAttribute('open');
    });
    if (opts.move) setPlayhead(posOf(g));
    tick();
    player.load(g, opts.play);
  }

  // --- track previews ---
  const player = (() => {
    const strip = part('preview');
    const label = part('pvlabel'), track = part('pvtrack'), fill = part('pvfill');
    const muteBtn = part<HTMLButtonElement>('mute'), muteText = part('mutetext');
    const audio = new Audio();
    audio.preload = 'none';

    let tracks: Track[] = [];
    let sideShort = '';
    let ti = 0;
    let playing = false;
    let startTimer = 0;
    let raf = 0;
    let muted = false;
    try { muted = sessionStorage.getItem(MUTE_KEY) === '1'; } catch { /* storage blocked */ }
    // Browsers only let sound start after the visitor has clicked or tapped
    // something, so a preview on hover has to wait for that first gesture.
    let unlocked = !!(navigator as any).userActivation?.hasBeenActive;
    document.addEventListener('pointerdown', () => { unlocked = true; }, { once: true, capture: true });

    function render() {
      if (!strip) return;
      strip.classList.toggle('is-playing', playing);
      strip.classList.toggle('is-empty', tracks.length === 0);
      const tr = tracks[ti];
      if (label) label.textContent = tracks.length ? `${str.preview} ${ti + 1}/${tracks.length} · ${sideShort}` : `${str.preview} · ${sideShort}`;
      if (track) track.textContent = tr ? `${tr.artist} — ${tr.title}` : str.previewEmpty;
      if (muteBtn) muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      if (muteText) muteText.textContent = muted ? str.soundOff : str.soundOn;
    }
    function progress(v: number) { if (fill) fill.style.width = `${(clamp01(v) * 100).toFixed(1)}%`; }

    function stop() {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      audio.pause();
      playing = false;
      progress(0);
      render();
    }
    function frame() {
      const tr = tracks[ti];
      if (!playing || !tr) return;
      const el = audio.currentTime - tr.start;
      audio.volume = clamp01(Math.min(el / FADE, (tr.length - el) / FADE));
      progress(el / tr.length);
      if (el >= tr.length) { advance(); return; }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      const tr = tracks[ti];
      if (!tr || muted) return;
      cancelAnimationFrame(raf);
      audio.src = tr.src;
      audio.volume = 0;
      audio.addEventListener('loadedmetadata', () => { try { audio.currentTime = tr.start; } catch { /* not seekable */ } }, { once: true });
      audio.play().then(() => {
        playing = true;
        unlocked = true;
        render();
        raf = requestAnimationFrame(frame);
      }).catch(() => { playing = false; render(); });
    }
    function advance() {
      if (ti + 1 >= tracks.length) { ti = 0; stop(); return; }
      ti += 1;
      render();
      start();
    }
    audio.addEventListener('ended', () => { if (playing) advance(); });
    audio.addEventListener('error', () => { if (playing || tracks.length) advance(); });

    muteBtn?.addEventListener('click', () => {
      muted = !muted;
      try { sessionStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* storage blocked */ }
      if (muted) stop();
      else { ti = 0; render(); start(); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    document.addEventListener('astro:before-swap', stop, { once: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { if (!entries[0].isIntersecting) stop(); }).observe(root!);
    }

    return {
      load(g: Gig, intent: Intent) {
        stop();
        tracks = g.tracks;
        sideShort = g.sideShort;
        ti = 0;
        render();
        if (!tracks.length || muted || intent === 'none') return;
        if (intent === 'click' || unlocked) startTimer = window.setTimeout(start, START_DELAY);
      },
    };
  })();

  // --- scrubbing ---
  function scrubTo(v: number, intent: Intent) {
    setPlayhead(v);
    const i = gigAt(p);
    if (i >= 0 && i !== sel) select(i, { move: false, play: intent });
  }
  let scrubbing = false;
  wave.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('[data-deck-mark]')) return;
    scrubbing = true;
    try { wave.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    wave.classList.add('is-scrubbing');
    const r = barsEl.getBoundingClientRect();
    scrubTo((e.clientX - r.left) / r.width, 'click');
  });
  wave.addEventListener('pointermove', (e) => {
    if (!scrubbing) return;
    const r = barsEl.getBoundingClientRect();
    scrubTo((e.clientX - r.left) / r.width, 'click');
  });
  const endScrub = () => { scrubbing = false; wave.classList.remove('is-scrubbing'); };
  wave.addEventListener('pointerup', endScrub);
  wave.addEventListener('pointercancel', endScrub);
  ph.addEventListener('keydown', (e) => {
    const stepDay = DAY / span;
    const to = e.key === 'ArrowLeft' ? p - stepDay : e.key === 'ArrowRight' ? p + stepDay : e.key === 'Home' ? 0 : e.key === 'End' ? 1 : null;
    if (to === null) return;
    e.preventDefault();
    scrubTo(to, 'none');
  });

  marks.forEach((m, i) => {
    m.addEventListener('click', () => { if (visible(gigs[i])) select(i, { move: true, play: 'click' }); });
    m.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && !scrubbing && i !== sel && visible(gigs[i])) select(i, { move: false, play: 'hover' });
    });
  });
  pads.forEach((pad, i) => {
    pad.addEventListener('click', () => { if (visible(gigs[i])) select(i, { move: true, play: 'click' }); });
  });

  // --- A side / B side switch ---
  function applyPick() {
    gigs.forEach((g, i) => {
      const off = !visible(g);
      pads[i]?.classList.toggle('is-off', off);
      marks[i]?.classList.toggle('is-off', off);
      if (pads[i]) pads[i].disabled = off;
    });
    if (sel < 0 || !visible(gigs[sel])) {
      const first = gigs.findIndex(visible);
      if (first >= 0) select(first, { move: sel >= 0, play: 'none' });
    }
  }
  document.addEventListener('side:change', (e) => {
    if (!root.isConnected) return;
    pick = (e as CustomEvent).detail;
    applyPick();
  });

  setPlayhead((now - t0) / span);
  select(Math.max(0, gigAt(p)), { move: false, play: 'none' });
  applyPick();
}

document.addEventListener('astro:page-load', initDeck);
