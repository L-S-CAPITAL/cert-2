import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { SHORTCUT_BLOCK_ATTR } from './shortcuts';
import { progressStore } from './stores/progress';
import { ALL_UNITS } from './data/course';

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
  act(() => progressStore.reset());
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

  it('supports arrow-key, Home and End navigation with a roving tabindex', () => {
    const tabs = () =>
      Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const keyOnTab = (key: string) => {
      const active = document.activeElement as HTMLElement;
      act(() => {
        active.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      });
    };
    expect(tabs().map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1, -1, -1, -1, -1]);
    for (const tab of tabs()) {
      expect(tab.getAttribute('aria-controls')).toBe('main-panel');
    }

    tabs()[0].focus();
    keyOnTab('ArrowRight');
    expect(selectedTab()).toBe('tab-units');
    expect(document.activeElement?.id).toBe('tab-units');
    expect(tabs()[1].tabIndex).toBe(0);
    expect(tabs()[0].tabIndex).toBe(-1);

    keyOnTab('ArrowLeft');
    keyOnTab('ArrowLeft');
    expect(selectedTab()).toBe('tab-blueprints');
    expect(document.activeElement?.id).toBe('tab-blueprints');

    keyOnTab('Home');
    expect(selectedTab()).toBe('tab-dashboard');
    keyOnTab('End');
    expect(selectedTab()).toBe('tab-blueprints');
    keyOnTab('ArrowRight');
    expect(selectedTab()).toBe('tab-dashboard');
    expect(document.activeElement?.id).toBe('tab-dashboard');
    expect(
      container.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby'),
    ).toBe('tab-dashboard');
  });

  it('labels the header with the timed unit/topic while the timer runs', () => {
    const [selected, timed] = ALL_UNITS;
    const topic = timed.topics[0];
    const meta = () => container.querySelector('.window-meta')?.textContent ?? '';
    expect(meta()).toBe('');

    const select = container.querySelector<HTMLSelectElement>('#unit-select')!;
    act(() => {
      select.value = selected.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(meta()).toBe(`SELECTED: ${selected.code} - ${selected.name}`);

    act(() => progressStore.startTopicSession(timed.id, topic.id));
    expect(meta()).toBe(`ACTIVE: ${timed.code} - ${timed.name} / ${topic.title}`);

    act(() => progressStore.stopSession());
    expect(meta()).toBe(`SELECTED: ${selected.code} - ${selected.name}`);
  });
});
