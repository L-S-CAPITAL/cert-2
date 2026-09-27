/**
 * Scroll `element` to the top of its panel (the nearest `.terminal-window-body`)
 * without touching any other ancestor.
 *
 * Element.scrollIntoView() would also scroll the app's overflow:hidden layout
 * containers when the panel cannot scroll far enough, shifting the header and
 * timer out of place, so the panel is scrolled directly instead.
 */
export function scrollToTopOfPanel(element: HTMLElement, margin = 12): void {
  const panel = element.closest<HTMLElement>('.terminal-window-body');
  if (!panel) return;
  const offset = element.getBoundingClientRect().top - panel.getBoundingClientRect().top;
  panel.scrollTop += offset - margin;
}

/** Scroll a horizontal scroller just enough to show `child` fully. */
export function scrollIntoViewHorizontally(scroller: HTMLElement, child: HTMLElement): void {
  const box = scroller.getBoundingClientRect();
  const rect = child.getBoundingClientRect();
  if (rect.left < box.left) {
    scroller.scrollLeft -= box.left - rect.left;
  } else if (rect.right > box.right) {
    scroller.scrollLeft += rect.right - box.right;
  }
}
