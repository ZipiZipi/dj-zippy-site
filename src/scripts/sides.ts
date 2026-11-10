// The A side / B side switch. One choice for the whole site: it holds while the
// visitor moves between pages, so picking "A side" on the home page still holds
// on /events and /mixes. It is deliberately not stored: every fresh load starts
// on the B side (the default, orange), because that is the side the site leads
// with. A landing rule (e.g. from a campaign link) can dispatch `side:set`.
//
// Markup:
//   <div data-side-filter> <button data-side-value="all|A|B"> … </div>
//   <li data-side-item="A|B">          hidden by CSS when the other side is picked
//   <ul data-side-list> … <p data-side-empty hidden>   shown when a list ends up empty
//   <button data-side-flip>            the header's A/B flip: A side on or off
// Everything else that cares listens for `side:change` on document
// (detail: 'all' | 'A' | 'B'). To pick a side from other code, dispatch
// `side:set` on document with the same detail.
//
// Picking the A side also sets data-side-pick="A" on <html>, which is what
// swaps the accent colour from orange to blue across the site (global.css).

type Choice = 'all' | 'A' | 'B';
// Lives in this module, which survives view-transition navigation but not a reload.
let current: Choice = 'all';
const read = () => current;

function apply(choice: Choice) {
  const html = document.documentElement;
  if (choice === 'all') html.removeAttribute('data-side-pick');
  else html.setAttribute('data-side-pick', choice);

  document.querySelectorAll<HTMLButtonElement>('[data-side-filter] [data-side-value]').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset.sideValue === choice ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-side-flip]').forEach((b) => {
    b.setAttribute('aria-pressed', choice === 'A' ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('[data-side-list]').forEach((list) => {
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-side-item]'));
    const shown = items.filter((el) => choice === 'all' || el.dataset.sideItem === choice).length;
    const empty = list.querySelector<HTMLElement>('[data-side-empty]');
    if (empty) empty.hidden = !items.length || shown > 0;
    // lets CSS drop a list's own controls (e.g. "Show all") when nothing is left in it
    list.toggleAttribute('data-side-none', items.length > 0 && shown === 0);
  });
  document.dispatchEvent(new CustomEvent('side:change', { detail: choice }));
}

function pick(choice: Choice) {
  current = choice;
  apply(choice);
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>('[data-side-filter] [data-side-value]');
  if (btn) { pick((btn.dataset.sideValue ?? 'all') as Choice); return; }
  if (target.closest('[data-side-flip]')) pick(read() === 'A' ? 'all' : 'A');
});
document.addEventListener('side:set', (e) => {
  const choice = (e as CustomEvent).detail;
  pick(choice === 'A' || choice === 'B' ? choice : 'all');
});

// A page swap replaces <html>'s attributes, so the pick is put back before the
// new page paints.
document.addEventListener('astro:after-swap', () => {
  const choice = read();
  if (choice !== 'all') document.documentElement.setAttribute('data-side-pick', choice);
});
document.addEventListener('astro:page-load', () => apply(read()));
