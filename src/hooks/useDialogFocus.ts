import React from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface DialogFocusOptions {
  /**
   * Where focus goes when the dialog opens (and whenever `refocusKey`
   * changes): the first focusable control, or the dialog element itself
   * (which should then have tabIndex={-1}).
   */
  initialFocus?: 'first' | 'dialog';
  /** Change this value to move focus again, e.g. when the dialog body swaps. */
  refocusKey?: unknown;
}

/**
 * Modal dialog focus management shared by QuizModal and HelpModal:
 * - moves focus into the dialog when it opens;
 * - traps Tab / Shift+Tab inside the dialog while it is open;
 * - closes on Escape;
 * - restores focus to the previously focused element when it closes.
 *
 * `onClose` is read through a ref, so a parent passing a new inline
 * callback on every render does not re-run the focus logic.
 */
export function useDialogFocus(
  dialogRef: React.RefObject<HTMLElement>,
  onClose: () => void,
  { initialFocus = 'first', refocusKey }: DialogFocusOptions = {},
): void {
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Mount / unmount only: Escape, the Tab trap and focus restoration.
  React.useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      const root = dialogRef.current;
      if (event.key !== 'Tab' || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active !== null && items.includes(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previous && previous.isConnected && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, [dialogRef]);

  // Initial focus, and again whenever the caller's refocusKey changes.
  React.useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    if (initialFocus === 'first') {
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      if (first) {
        first.focus();
        return;
      }
    }
    root.focus();
  }, [dialogRef, initialFocus, refocusKey]);
}
