import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { SHORTCUT_BLOCK_ATTR } from './shortcuts';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const press = (key: string, init: KeyboardEventInit = {}) => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
  });
};

const selectedTab = () =>
  container.querySelector('[role="tab"][aria-selected="true"]')?.id;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(<App />);
  });
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('App keyboard shortcuts', () => {
  it('switches tabs with number keys', () => {
    expect(selectedTab()).toBe('tab-dashboard');
    press('2');
    expect(selectedTab()).toBe('tab-units');
  });

  it('ignores modifier combinations', () => {
    press('3', { ctrlKey: true });
    press('3', { metaKey: true });
    press('3', { altKey: true });
    expect(selectedTab()).toBe('tab-dashboard');
  });

  it('opens help with ?, blocks tab keys while it is open, and closes on Escape', () => {
    press('?', { shiftKey: true });
    expect(document.querySelector('[aria-modal="true"]')).not.toBeNull();
    press('3');
    expect(selectedTab()).toBe('tab-dashboard');
    press('Escape');
    expect(document.querySelector('[aria-modal="true"]')).toBeNull();
    press('3');
    expect(selectedTab()).toBe('tab-sessions');
  });

  it('blocks tab keys while a drill is running', () => {
    const drill = document.createElement('div');
    drill.setAttribute(SHORTCUT_BLOCK_ATTR, 'true');
    container.appendChild(drill);
    press('4');
    expect(selectedTab()).toBe('tab-dashboard');
    drill.remove();
    press('4');
    expect(selectedTab()).toBe('tab-overview');
  });
});
