import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import StatusBar from './StatusBar';
import Dashboard from './Dashboard';
import CourseOverview from './CourseOverview';
import { ALL_UNITS } from '../data/course';
import { summarizeCompletion } from '../data/completion';
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

describe('completion figures', () => {
  it('show the same core % in StatusBar, Dashboard and CourseOverview', () => {
    const coreUnit = ALL_UNITS.find((unit) => unit.kind !== 'elective')!;
    const elective = ALL_UNITS.find((unit) => unit.kind === 'elective')!;
    for (const topic of coreUnit.topics) progressStore.markTopicComplete(coreUnit.id, topic.id);
    for (const topic of elective.topics) progressStore.markTopicComplete(elective.id, topic.id);

    const { core, electives } = summarizeCompletion(
      ALL_UNITS,
      progressStore.getState().unitCompletions,
    );
    expect(core.percent).toBeGreaterThan(0);
    expect(core.unitsDone).toBe(1);
    expect(electives.unitsDone).toBe(1);

    act(() =>
      root.render(
        <>
          <StatusBar />
          <Dashboard units={ALL_UNITS} />
          <CourseOverview />
        </>,
      ),
    );

    const statusItems = Array.from(container.querySelectorAll('.status-bar-item'));
    const statusValue = (label: string) =>
      statusItems
        .find((item) => item.querySelector('.label')?.textContent === label)
        ?.querySelector('.value')?.textContent;
    expect(statusValue('CORE PROGRESS')).toBe(`${core.percent}%`);
    expect(statusValue('CORE UNITS')).toBe(`1/${core.unitsTotal}`);
    expect(statusValue('ELECTIVES')).toBe(`${electives.percent}%`);

    const coreBars = container.querySelectorAll(
      '[role="progressbar"][aria-label^="Core progress"]',
    );
    expect(coreBars).toHaveLength(2);
    for (const bar of coreBars) {
      expect(bar.getAttribute('aria-valuenow')).toBe(String(core.percent));
    }

    const cards = Array.from(container.querySelectorAll('.stat-card'));
    const card = (label: string) =>
      cards.find((item) => item.querySelector('.stat-label')?.textContent === label)
        ?.querySelector('.stat-value')?.textContent;
    expect(card('Core Progress (topics)')).toBe(`${core.percent}%`);
    expect(card('Core Units Completed')).toBe(`1 / ${core.unitsTotal}`);
  });
});
