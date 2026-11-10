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
// Without JS the viewport is an ordinary sideways-scrolling box. After the set
// of visible cards changes, dispatch `rail:refresh` on the root.

const TAU_STEP = 160;   // arrows and keys: one card per press
const TAU_SNAP = 200;   // settling after a slow drag or a wheel gesture
const TAU_FLING = 480;  // coasting after a flick
const EDGE_PULL = 0.35; // how far the row gives when dragged past either end

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

  function render() {
    track!.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
    if (thumb) {
      const total = max + viewport!.clientWidth;
      thumb.style.width = `${((viewport!.clientWidth / total) * 100).toFixed(2)}%`;
      thumb.style.left = `${((clamp(x) / total) * 100).toFixed(2)}%`;
    }
    const rest = anim ? target : x;
    if (prev) prev.disabled = rest <= 0.5;
    if (next) next.disabled = rest >= max - 0.5;
  }

  function measure() {
    const cards = (Array.from(track!.children) as HTMLElement[]).filter((el) => el.offsetParent !== null);
    max = Math.max(0, track!.scrollWidth - viewport!.clientWidth);
    const first = cards.length ? cards[0].offsetLeft : 0;
    snaps = [...new Set(cards.map((el) => Math.min(max, el.offsetLeft - first)))];
    if (!snaps.length) snaps = [0];
    root.toggleAttribute('data-rail-fits', max <= 1);
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
    const from = nearest(anim ? target : x);
    const i = Math.max(0, Math.min(snaps.length - 1, snaps.indexOf(from) + dir));
    animateTo(snaps[i], TAU_STEP);
  }

  // --- drag / flick ---
  let drag: { id: number; startX: number; startPos: number; moved: boolean; samples: { t: number; p: number }[] } | null = null;
  let suppressClick = false;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || max <= 1) return;
    suppressClick = false;
    stop();
    drag = { id: e.pointerId, startX: e.clientX, startPos: x, moved: false, samples: [{ t: e.timeStamp, p: x }] };
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
    if (!d.moved) return;
    suppressClick = true;
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
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); }
  }, true);

  // trackpad / shift+wheel sideways scrolling moves it too
  let wheelTimer = 0;
  viewport.addEventListener('wheel', (e) => {
    if (max <= 1 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    stop();
    x = clamp(x + e.deltaX);
    render();
    clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => animateTo(nearest(x), TAU_SNAP), 120);
  }, { passive: false });

  prev?.addEventListener('click', () => step(-1));
  next?.addEventListener('click', () => step(1));
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    step(e.key === 'ArrowRight' ? 1 : -1);
  });
  // tabbing to a card that is off screen brings it in
  track.addEventListener('focusin', (e) => {
    const card = (Array.from(track.children) as HTMLElement[]).find((el) => el.contains(e.target as Node));
    if (!card) return;
    viewport.scrollLeft = 0;   // undo the browser's own scroll-into-view
    const left = card.offsetLeft - (track.firstElementChild as HTMLElement).offsetLeft;
    const pos = anim ? target : x;
    if (left < pos || left + card.offsetWidth > pos + viewport.clientWidth) animateTo(nearest(left), TAU_SNAP);
  });

  root.addEventListener('rail:refresh', () => { x = 0; measure(); });
  // the A side / B side switch hides cards, so the row starts over
  document.addEventListener('side:change', () => { if (root.isConnected) { x = 0; measure(); } });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(viewport);
  else window.addEventListener('resize', measure);
  measure();
}

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach(initRail);
});
