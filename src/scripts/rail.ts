// Drag rail: a horizontal row of cards that moves the way the hero ring does.
// It follows the pointer, a flick carries it on with momentum, and it always
// comes to rest with a card on the left edge. Same easing and timing constants
// as the ring in HomePage.astro, so the two feel like one control.
//
// Markup:
//   <div data-rail>
//     <div data-rail-viewport><div data-rail-track> …cards… </div></div>
//     <button data-rail-prev>, <button data-rail-next>, <div data-rail-bar><span></span></div>
//   </div>
// Without JS the viewport is an ordinary sideways-scrolling box. With JS it
// never scrolls natively: the track is moved with a transform, and anything
// the browser scrolls on its own (focus, find in page) is handed over to it.
// After the set of visible cards changes, dispatch `rail:refresh` on the root.
//
// Input: drag / flick (mouse, pen, touch; grabbing a moving row stops it),
// a sideways trackpad swipe, shift+wheel (one card per notch), the arrow
// buttons, and ArrowLeft / ArrowRight on a card or on the buttons. Tabbing to a
// card that is off screen brings it in.

const TAU_STEP = 160;   // arrows, keys and mouse-wheel notches: one card per press
const TAU_SNAP = 200;   // settling after a slow drag or a wheel gesture
const TAU_FLING = 480;  // coasting after a flick
const TAU_WHEEL = 110;  // a big sideways wheel delta glides instead of jumping
const EDGE_PULL = 0.35; // how far the row gives when dragged past either end
const WHEEL_NOTCH = 50; // shift+wheel: this much delta turns one card
const WHEEL_NUDGE = 24; // a sideways swipe at least this long settles on the next card that way
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Rails on the current page, so the document-wide listeners below reach them
// and a page swap can let go of them.
const live = new Map<HTMLElement, { refresh: () => void; dispose: () => void }>();

function initRail(root: HTMLElement) {
  if (root.dataset.railReady) return;
  const viewport = root.querySelector<HTMLElement>('[data-rail-viewport]');
  const track = root.querySelector<HTMLElement>('[data-rail-track]');
  if (!viewport || !track) return;
  root.dataset.railReady = '1';
  root.classList.add('rail--js');
  viewport.scrollLeft = 0;

  const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
  const thumb = root.querySelector<HTMLElement>('[data-rail-bar] > *');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let x = 0;          // how far the track is pulled left, in px
  let target = 0;     // where the current animation will rest
  let max = 0;        // furthest pull that still fills the viewport
  let snaps = [0];    // resting positions, one per visible card
  let anim: { to: number; amp: number; start: number; tau: number } | null = null;
  let raf = 0;

  const clamp = (v: number) => Math.max(0, Math.min(max, v));
  const nearest = (v: number) => snaps.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best), snaps[0]);
  const rest = () => (anim ? target : x);
  const cards = () => (Array.from(track!.children) as HTMLElement[]).filter((el) => el.offsetParent !== null);
  const cardOf = (node: EventTarget | null) =>
    node instanceof Node ? (Array.from(track!.children) as HTMLElement[]).find((el) => el.contains(node)) : undefined;

  function render() {
    track!.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
    // the thumb is as wide as the share of the row on screen; moving it with a
    // transform keeps the bar off the layout path while the row is moving
    const vw = viewport!.clientWidth;
    if (thumb && vw) thumb.style.transform = `translate3d(${((clamp(x) / vw) * 100).toFixed(3)}%,0,0)`;
    const r = rest();
    if (prev) prev.disabled = r <= 0.5;
    if (next) next.disabled = r >= max - 0.5;
  }

  function measure() {
    const list = cards();
    max = Math.max(0, track!.scrollWidth - viewport!.clientWidth);
    const first = list.length ? list[0].offsetLeft : 0;
    snaps = [...new Set(list.map((el) => Math.min(max, el.offsetLeft - first)))];
    if (!snaps.length) snaps = [0];
    root.toggleAttribute('data-rail-fits', max <= 1);
    const vw = viewport!.clientWidth;
    if (thumb) thumb.style.width = vw ? `${((vw / (max + vw)) * 100).toFixed(3)}%` : '100%';
    anim = null;
    x = target = nearest(clamp(x));
    render();
  }

  function tick(now: number) {
    raf = 0;
    if (!anim) return;
    const d = anim.amp * Math.exp(-(now - anim.start) / anim.tau);
    if (Math.abs(d) < 0.3) { x = anim.to; anim = null; render(); return; }
    x = anim.to - d;
    render();
    raf = requestAnimationFrame(tick);
  }
  function animateTo(to: number, tau: number) {
    target = clamp(to);
    if (reduceMotion) { anim = null; x = target; render(); return; }
    anim = { to: target, amp: target - x, start: performance.now(), tau };
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function stop() { anim = null; target = x; }

  // Presses stack up, so holding a key or clicking fast keeps the row moving.
  function step(dir: number) {
    const from = nearest(rest());
    const i = Math.max(0, Math.min(snaps.length - 1, snaps.indexOf(from) + dir));
    animateTo(snaps[i], TAU_STEP);
  }

  /** Moves the row just enough for this card to be fully on screen. */
  function reveal(card: HTMLElement) {
    const list = cards();
    if (!list.length) return;
    const left = card.offsetLeft - list[0].offsetLeft;
    const pos = rest();
    if (left < pos - 0.5 || left + card.offsetWidth > pos + viewport!.clientWidth + 0.5) {
      animateTo(nearest(left), TAU_SNAP);
    }
  }

  // --- drag / flick ---
  let drag: { id: number; startX: number; startPos: number; moved: boolean; wasMoving: boolean; samples: { t: number; p: number }[] } | null = null;
  // a click this soon after a drag (or after a tap that stopped the row) is not a click
  let suppressUntil = 0;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || max <= 1) return;
    suppressUntil = 0;
    // grabbing a moving row stops it under the finger, as on the hero ring
    const wasMoving = !!anim && Math.abs(target - x) > 2;
    stop();
    drag = { id: e.pointerId, startX: e.clientX, startPos: x, moved: false, wasMoving, samples: [{ t: e.timeStamp, p: x }] };
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      try { viewport.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
      root.classList.add('is-dragging');
    }
    const raw = drag.startPos - dx;
    x = raw < 0 ? raw * EDGE_PULL : raw > max ? max + (raw - max) * EDGE_PULL : raw;
    drag.samples.push({ t: e.timeStamp, p: x });
    while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 100) drag.samples.shift();
    render();
  });
  function release(e: PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    root.classList.remove('is-dragging');
    if (!d.moved) {
      // a tap that stopped the row must not also open the card under it
      if (d.wasMoving) { suppressUntil = e.timeStamp + 400; animateTo(nearest(clamp(x)), TAU_SNAP); }
      return;
    }
    suppressUntil = e.timeStamp + 400;
    // flick velocity (px per ms) over the last ~100ms of the gesture
    const s = d.samples.filter((p) => e.timeStamp - p.t < 100);
    let v = 0;
    if (s.length >= 2) {
      const dt = s[s.length - 1].t - s[0].t;
      if (dt > 0) v = (s[s.length - 1].p - s[0].p) / dt;
    }
    const fling = Math.abs(v) > 0.3;
    // project where the momentum would coast to, then rest on the nearest card
    animateTo(nearest(clamp(x + (fling ? v * TAU_FLING : 0))), fling ? TAU_FLING : TAU_SNAP);
  }
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('dragstart', (e) => e.preventDefault());
  // a drag that ends over a card must not open it
  viewport.addEventListener('click', (e) => {
    if (e.timeStamp < suppressUntil) { suppressUntil = 0; e.preventDefault(); e.stopPropagation(); }
  }, true);

  // Sideways wheel. A trackpad swipe moves the row 1:1 (its own momentum
  // included; a big delta, or one arriving mid-glide, eases there instead of
  // jumping) and settles on a card once the gesture ends, on the next card in
  // the swipe's direction when it was a real swipe. A mouse wheel with shift
  // turns one card per notch, the way the arrow buttons do.
  let wheelTimer = 0;
  let wheelStart = 0;   // where the row was when the current gesture began
  let notchSum = 0;     // shift+wheel delta not yet turned into a card
  const snapToward = (from: number, dir: number) =>
    dir > 0 ? snaps.find((s) => s > from + 0.5) ?? max : [...snaps].reverse().find((s) => s < from - 0.5) ?? 0;
  function settleWheel() {
    wheelTimer = 0;
    notchSum = 0;
    const pos = rest();
    const moved = pos - wheelStart;
    let to = nearest(clamp(pos));
    if (moved > WHEEL_NUDGE && to <= wheelStart + 0.5) to = snapToward(wheelStart, 1);
    else if (moved < -WHEEL_NUDGE && to >= wheelStart - 0.5) to = snapToward(wheelStart, -1);
    animateTo(to, TAU_SNAP);
  }
  viewport.addEventListener('wheel', (e) => {
    if (max <= 1) return;
    let delta = e.deltaX;
    if (Math.abs(delta) <= Math.abs(e.deltaY)) {
      if (!e.shiftKey) return;   // an ordinary vertical scroll belongs to the page
      delta = e.deltaY;          // shift+wheel reported as vertical
    }
    delta *= e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? viewport.clientWidth : 1;
    e.preventDefault();
    clearTimeout(wheelTimer);
    if (e.shiftKey || e.deltaMode !== 0) {
      // a wheel: notches stack up like presses of the arrow buttons
      notchSum += delta;
      if (Math.abs(notchSum) >= WHEEL_NOTCH) {
        animateTo(snapToward(nearest(rest()), Math.sign(notchSum)), TAU_STEP);
        notchSum = 0;
      }
      wheelTimer = window.setTimeout(() => { wheelTimer = 0; notchSum = 0; }, 140);
      return;
    }
    if (!wheelTimer) wheelStart = rest();
    if (anim || Math.abs(delta) >= 50) {
      animateTo(rest() + delta, TAU_WHEEL);
    } else {
      x = target = clamp(x + delta);
      render();
    }
    wheelTimer = window.setTimeout(settleWheel, 140);
  }, { passive: false });

  prev?.addEventListener('click', () => step(-1));
  next?.addEventListener('click', () => step(1));

  // ArrowLeft / ArrowRight: on a card, focus walks to the next card (and the row
  // follows); on the arrow buttons, the row steps. Other controls inside the
  // root (tabs, switches) keep their own arrow keys.
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const card = cardOf(e.target);
    if (card) {
      e.preventDefault();
      const list = cards();
      const to = list[list.indexOf(card) + dir];
      const el = to && (to.matches(FOCUSABLE) ? to : to.querySelector<HTMLElement>(FOCUSABLE));
      if (el) el.focus({ preventScroll: true });   // focusin below brings it in
      return;
    }
    if (e.target instanceof Element && e.target.closest('[data-rail-prev], [data-rail-next]')) {
      e.preventDefault();
      step(dir);
    }
  });
  track.addEventListener('focusin', (e) => {
    const card = cardOf(e.target);
    if (card) reveal(card);
  });
  // The browser scrolls an overflow:hidden box too (to show a focused card, a
  // find-in-page match). Take that scroll back and move the row instead.
  viewport.addEventListener('scroll', () => {
    const s = viewport.scrollLeft;
    if (!s) return;
    viewport.scrollLeft = 0;
    const focused = cardOf(document.activeElement);
    if (focused) reveal(focused);
    else animateTo(nearest(clamp(rest() + s)), TAU_SNAP);
  });

  root.addEventListener('rail:refresh', () => { x = 0; measure(); });
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => measure()) : null;
  if (ro) ro.observe(viewport);
  else window.addEventListener('resize', measure);
  live.set(root, {
    refresh: () => { x = 0; measure(); },
    dispose: () => {
      cancelAnimationFrame(raf);
      clearTimeout(wheelTimer);
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    },
  });
  measure();
}

// the A side / B side switch hides cards, so each row starts over
document.addEventListener('side:change', () => live.forEach((r) => r.refresh()));
// a page swap takes the rails away: stop their timers and observers
document.addEventListener('astro:before-swap', () => {
  live.forEach((r) => r.dispose());
  live.clear();
});
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach(initRail);
});
