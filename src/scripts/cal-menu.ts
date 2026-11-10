// "Save the date" is a native <details>; this adds what a menu is expected to do
// on top of that: open where it fits on screen, close on a click elsewhere, on
// Escape and when focus leaves it, and move through its entries with the arrow
// keys (ArrowDown on the button opens it on the first entry).
//
// Everything is delegated from document, so it covers menus that arrive with a
// view-transition page swap without being set up again.

const GAP = 8; // keep this much space between the menu and the screen edge

const menuOf = (el: EventTarget | null) =>
  el instanceof Element ? el.closest<HTMLDetailsElement>('details.cal-save') : null;

function closeAll(except?: Element | null) {
  document.querySelectorAll<HTMLDetailsElement>('details.cal-save[open]').forEach((d) => {
    if (d !== except) d.open = false;
  });
}

/** How much of the top of the screen a fixed header covers. */
function topInset(): number {
  for (let p = document.elementFromPoint(window.innerWidth / 2, 1); p && p !== document.body; p = p.parentElement) {
    const pos = getComputedStyle(p).position;
    if (pos === 'fixed' || pos === 'sticky') return Math.max(0, p.getBoundingClientRect().bottom);
  }
  return 0;
}

/** Opens downwards and to the left of the button; turns round where that would leave the screen. */
function place(d: HTMLDetailsElement) {
  d.classList.remove('cal-save--up', 'cal-save--left');
  const menu = d.querySelector<HTMLElement>('.cal-menu');
  menu?.style.removeProperty('translate');
  if (!d.open) return;
  const button = d.querySelector('summary');
  if (!menu || !button) return;
  const m = menu.getBoundingClientRect();
  const b = button.getBoundingClientRect();
  const top = topInset();
  const below = window.innerHeight - b.bottom;
  const above = b.top - top;
  if (m.bottom > window.innerHeight - GAP && above > below && above >= m.height + GAP * 2) {
    d.classList.add('cal-save--up');
  }
  if (m.left < GAP) d.classList.add('cal-save--left');
  // A narrow screen with the button near the middle: neither edge of the button
  // leaves room, so slide the menu in until it clears both sides.
  const vw = document.documentElement.clientWidth;
  const h = menu.getBoundingClientRect();
  const dx = h.left < GAP ? GAP - h.left : h.right > vw - GAP ? Math.max(GAP - h.left, vw - GAP - h.right) : 0;
  if (dx) menu.style.translate = `${Math.round(dx)}px 0`;
  // still not fully on screen (a short landscape phone): bring it in
  const r = menu.getBoundingClientRect();
  if (r.bottom > window.innerHeight || r.top < top) {
    menu.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

document.addEventListener('toggle', (e) => {
  const d = e.target;
  if (d instanceof HTMLDetailsElement && d.classList.contains('cal-save')) place(d);
}, true); // toggle does not bubble, so it is caught on the way down

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  // picking an entry closes the menu too
  closeAll(target.closest('.cal-menu a') ? null : menuOf(target));
});

document.addEventListener('focusout', (e) => {
  const d = menuOf(e.target);
  const to = e.relatedTarget as Node | null;
  if (d?.open && to && !d.contains(to)) d.open = false;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const open = menuOf(e.target) ?? document.querySelector<HTMLDetailsElement>('details.cal-save[open]');
    if (!open?.open) return;
    open.open = false;
    open.querySelector('summary')?.focus();
    return;
  }
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
  const d = menuOf(e.target);
  if (!d) return;
  const onButton = (e.target as Element).matches('summary');
  if (!d.open) {
    if (!onButton || e.key !== 'ArrowDown') return;
    d.open = true;
  }
  const items = Array.from(d.querySelectorAll<HTMLElement>('.cal-menu a')).filter((a) => a.offsetParent !== null);
  if (!items.length) return;
  e.preventDefault();
  const i = items.indexOf(document.activeElement as HTMLElement);
  let n: number;
  if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = items.length - 1;
  else if (i < 0) n = e.key === 'ArrowUp' ? items.length - 1 : 0;
  else n = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[n].focus();
});
