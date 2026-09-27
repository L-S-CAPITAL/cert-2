import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TimeTracker from './TimeTracker';
import { ALL_UNITS } from '../data/course';
import { progressStore } from '../stores/progress';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  progressStore.reset();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  progressStore.reset();
  document.body.innerHTML = '';
});

describe('TimeTracker announcements', () => {
  it('keeps the ticking clock out of live regions and announces start/stop', () => {
    const unit = ALL_UNITS[0];
    act(() =>
      root.render(
        <TimeTracker selectedUnitId={unit.id} onUnitSelect={() => {}} units={ALL_UNITS} />,
      ),
    );
    const live = container.querySelectorAll('[aria-live]');
    expect(live).toHaveLength(1);
    const status = live[0];
    expect(status.getAttribute('role')).toBe('status');
    expect(status.classList.contains('visually-hidden')).toBe(true);
    expect(status.textContent).toBe('');
    expect(container.querySelector('.timer-display[aria-live]')).toBeNull();

    act(() => progressStore.startSession(unit.id));
    expect(status.textContent).toBe(`Timer started for ${unit.code}.`);

    act(() => progressStore.stopSession());
    expect(status.textContent).toMatch(/^Timer stopped\./);
  });
});
