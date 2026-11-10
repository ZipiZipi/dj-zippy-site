// "Save the date" is a native <details>; this only adds the two things a menu
// is expected to do on top of that: close on a click elsewhere and on Escape.

function closeAll(except?: Element | null) {
  document.querySelectorAll<HTMLDetailsElement>('details.cal-save[open]').forEach((d) => {
    if (d !== except) d.open = false;
  });
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const inside = target.closest('details.cal-save');
  // picking an entry closes the menu too
  closeAll(target.closest('.cal-menu a') ? null : inside);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = document.querySelector<HTMLDetailsElement>('details.cal-save[open]');
  if (!open) return;
  open.open = false;
  open.querySelector('summary')?.focus();
});
