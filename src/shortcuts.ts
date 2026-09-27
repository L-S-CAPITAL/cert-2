/**
 * Global keyboard shortcut guard.
 *
 * Tab-switching shortcuts unmount the active panel, which throws away local
 * quiz / drill state. Shortcuts are therefore ignored when:
 * - a modifier (Ctrl / Cmd / Alt) is held, so browser/OS combos pass through;
 * - focus is in a form field or contenteditable element;
 * - a modal dialog (any element with aria-modal="true") is open;
 * - a component has marked itself busy with SHORTCUT_BLOCK_ATTR="true"
 *   (e.g. MathDrill while a timed drill is running).
 *
 * Escape is handled separately by the caller and the dialogs themselves so
 * it always closes modals.
 */
export const SHORTCUT_BLOCK_ATTR = 'data-block-shortcuts';

const BLOCKING_SELECTOR = `[aria-modal="true"], [${SHORTCUT_BLOCK_ATTR}="true"]`;

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target as HTMLElement).tagName) return false;
  const element = target as HTMLElement;
  const tag = element.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'SELECT' ||
    tag === 'TEXTAREA' ||
    element.isContentEditable === true
  );
}

export function shouldIgnoreShortcut(
  event: KeyboardEvent,
  root: ParentNode = document,
): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) return true;
  if (isEditableTarget(event.target)) return true;
  return root.querySelector(BLOCKING_SELECTOR) !== null;
}
