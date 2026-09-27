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
    expect(selectedTab()).toBe('tab-overview');
    expect(document.activeElement?.id).toBe('tab-overview');

    keyOnTab('Home');
    expect(selectedTab()).toBe('tab-dashboard');
    keyOnTab('End');
    expect(selectedTab()).toBe('tab-overview');
    keyOnTab('ArrowRight');
    expect(selectedTab()).toBe('tab-dashboard');
    expect(document.activeElement?.id).toBe('tab-dashboard');
    expect(
      container.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby'),
    ).toBe('tab-dashboard');
  });

  it('shows a vertical sidebar grouped into Study and Records', () => {
    const nav = container.querySelector('nav.sidebar')!;
    expect(nav.getAttribute('aria-label')).toBe('Sections');
    const list = nav.querySelector('[role="tablist"]')!;
    expect(list.getAttribute('aria-orientation')).toBe('vertical');
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs.map((tab) => tab.id)).toEqual([
      'tab-dashboard',
      'tab-units',
      'tab-math',
      'tab-algebra',
      'tab-geometry',
      'tab-blueprints',
      'tab-sessions',
      'tab-overview',
    ]);
    const groupOf = (tab: HTMLElement) =>
      document.getElementById(tab.getAttribute('aria-describedby')!)?.textContent;
    expect(tabs.map(groupOf)).toEqual([
      'Study', 'Study', 'Study', 'Study', 'Study', 'Study', 'Records', 'Records',
    ]);
    // Accessible names stay readable text; the [DASH] labels are decoration.
    expect(tabs[0].querySelector('.nav-label')?.textContent).toBe('Dashboard');
    expect(tabs[0].querySelector('.tab-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(tabs[0].querySelector('.tab-icon')?.textContent).toBe('[DASH]');
    // Number shortcuts are unchanged and exposed to assistive tech.
    expect(tabs.map((tab) => tab.getAttribute('aria-keyshortcuts'))).toEqual([
      '1', '2', '5', '6', '7', '8', '3', '4',
    ]);
    // The old horizontal, scrolling tab bar is gone.
    expect(container.querySelector('.terminal-tabs-bar')).toBeNull();
  });

  it('moves through sections with Up/Down arrows, wrapping at the ends', () => {
    const tab = (id: string) => container.querySelector<HTMLButtonElement>(`#tab-${id}`)!;
    const keyOnFocused = (key: string) =>
      act(() => {
        (document.activeElement as HTMLElement).dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true }),
        );
      });
    tab('dashboard').focus();
    keyOnFocused('ArrowDown');
    keyOnFocused('ArrowDown');
    expect(selectedTab()).toBe('tab-math');
    expect(document.activeElement?.id).toBe('tab-math');
    keyOnFocused('ArrowUp');
    keyOnFocused('ArrowUp');
    keyOnFocused('ArrowUp');
    expect(selectedTab()).toBe('tab-overview');
    expect(tab('overview').tabIndex).toBe(0);
    expect(tab('dashboard').tabIndex).toBe(-1);
    expect(container.querySelector('.window-title')?.textContent).toContain('Course Overview');
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
    // Long lines are cut with an ellipsis in CSS; the full text is the tooltip.
    expect(container.querySelector('.window-meta')?.getAttribute('title')).toBe(meta());
  });
});

describe('Dashboard navigation', () => {
  const unitHeader = (unitId: string) =>
    container.querySelector<HTMLButtonElement>(`[data-unit-id="${unitId}"] .unit-header`)!;

  it('"Continue" opens the next unfinished topic in the Units tab', () => {
    const unit = ALL_UNITS.find((candidate) => candidate.code === 'UEECD0038')!;
    act(() => progressStore.markTopicComplete(unit.id, unit.topics[0].id));

    const continueBtn = container.querySelector<HTMLButtonElement>('.continue-btn')!;
    expect(container.querySelector('.continue-card')?.textContent).toContain(unit.code);
    act(() => continueBtn.click());

    expect(selectedTab()).toBe('tab-units');
    expect(unitHeader(unit.id).getAttribute('aria-expanded')).toBe('true');
    const nextTitle = Array.from(container.querySelectorAll('.topic-title')).find((title) =>
      title.textContent?.includes(unit.topics[1].title),
    )!;
    expect(nextTitle.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(nextTitle);
    // The unit is now the timer's selected unit too.
    expect(container.querySelector<HTMLSelectElement>('#unit-select')?.value).toBe(unit.id);

    // Coming back to Units later does not replay the jump.
    press('1');
    press('2');
    const titleAgain = Array.from(container.querySelectorAll('.topic-title')).find((title) =>
      title.textContent?.includes(unit.topics[1].title),
    )!;
    expect(titleAgain.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).not.toBe(titleAgain);
  });

  it('opens a unit from the unit table and focuses its header', () => {
    const unit = ALL_UNITS.find((candidate) => candidate.code === 'UEERE0021')!;
    const rowButton = container.querySelector<HTMLButtonElement>(
      `button.row-link[aria-label^="Open unit ${unit.code}"]`,
    )!;
    act(() => rowButton.click());

    expect(selectedTab()).toBe('tab-units');
    expect(unitHeader(unit.id).getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(unitHeader(unit.id));
  });

  it('only scrolls to a locked unit (it stays collapsed and unselected)', () => {
    const locked = ALL_UNITS.find((candidate) => candidate.code === 'UEECD0009')!;
    const row = Array.from(container.querySelectorAll<HTMLTableRowElement>('tr.unit-row')).find(
      (candidate) => candidate.textContent?.includes(locked.code),
    )!;
    expect(row.textContent).toContain('LOCKED');
    act(() => row.click());

    expect(selectedTab()).toBe('tab-units');
    expect(unitHeader(locked.id).getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(unitHeader(locked.id));
    expect(container.querySelector<HTMLSelectElement>('#unit-select')?.value).toBe('');
  });
});

describe('Theme', () => {
  const themeButton = () =>
    Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Light theme'),
    )!;

  it('toggles the light theme from the header and with t, and remembers the choice', () => {
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(themeButton().getAttribute('aria-pressed')).toBe('false');

    act(() => themeButton().click());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(themeButton().getAttribute('aria-pressed')).toBe('true');
    expect(JSON.parse(localStorage.getItem('electrotech-settings')!).theme).toBe('light');

    press('t');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(JSON.parse(localStorage.getItem('electrotech-settings')!).theme).toBe('dark');
  });

  it('follows prefers-color-scheme on first run, and a saved choice wins', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    try {
      act(() => root.unmount());
      root = createRoot(container);
      act(() => root.render(<App />));
      expect(document.documentElement.dataset.theme).toBe('light');

      act(() => root.unmount());
      localStorage.setItem('electrotech-settings', JSON.stringify({ theme: 'dark' }));
      root = createRoot(container);
      act(() => root.render(<App />));
      expect(document.documentElement.dataset.theme).toBe('dark');
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('Study timer panel', () => {
  const toggle = () => container.querySelector<HTMLButtonElement>('.timer-toggle')!;
  const panel = () => container.querySelector<HTMLElement>('#timer-panel')!;

  it('is a compact bar while idle and opens with an aria-expanded toggle', () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(toggle().getAttribute('aria-controls')).toBe('timer-panel');
    expect(toggle().getAttribute('aria-label')).toBe('Show study timer');
    expect(panel().hidden).toBe(true);
    expect(container.querySelector('.time-tracker-window')?.classList).toContain('collapsed');

    act(() => toggle().click());
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(panel().hidden).toBe(false);
    expect(JSON.parse(localStorage.getItem('electrotech-settings')!).timerExpanded).toBe(true);

    act(() => toggle().click());
    expect(panel().hidden).toBe(true);
  });

  it('opens while the timer runs and collapses again when it stops', () => {
    act(() => progressStore.startSession(ALL_UNITS[0].id));
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(toggle().disabled).toBe(true);
    expect(panel().hidden).toBe(false);

    act(() => progressStore.stopSession());
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
  });
});
