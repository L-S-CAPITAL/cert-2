import { afterEach, describe, expect, it } from 'vitest';
import { SHORTCUT_BLOCK_ATTR, shouldIgnoreShortcut } from './shortcuts';

function keydown(init: KeyboardEventInit, target: EventTarget = document.body) {
  const event = new KeyboardEvent('keydown', { bubbles: true, ...init });
  Object.defineProperty(event, 'target', { value: target });
  return event;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('shouldIgnoreShortcut', () => {
  it('allows plain keys when nothing blocks them', () => {
    expect(shouldIgnoreShortcut(keydown({ key: '2' }))).toBe(false);
    expect(shouldIgnoreShortcut(keydown({ key: '?', shiftKey: true }))).toBe(false);
  });

  it('ignores Ctrl, Meta and Alt combinations', () => {
    expect(shouldIgnoreShortcut(keydown({ key: 's', ctrlKey: true }))).toBe(true);
    expect(shouldIgnoreShortcut(keydown({ key: '1', metaKey: true }))).toBe(true);
    expect(shouldIgnoreShortcut(keydown({ key: '3', altKey: true }))).toBe(true);
  });

  it('ignores keys typed into form fields', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    expect(shouldIgnoreShortcut(keydown({ key: '1' }, input))).toBe(true);
  });

  it('ignores keys while a modal dialog is open', () => {
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    document.body.appendChild(dialog);
    expect(shouldIgnoreShortcut(keydown({ key: '1' }))).toBe(true);
  });

  it('ignores keys while a component marks itself busy (running drill)', () => {
    const drill = document.createElement('div');
    drill.setAttribute(SHORTCUT_BLOCK_ATTR, 'true');
    document.body.appendChild(drill);
    expect(shouldIgnoreShortcut(keydown({ key: '5' }))).toBe(true);
  });
});
