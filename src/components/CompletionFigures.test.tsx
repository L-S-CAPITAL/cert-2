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

    // The dashboard shows the overall figure once (bar + label beside it)
    // with the unit / topic counts next to the section title.
    const dashboard = container.querySelector('.dashboard')!;
    expect(dashboard.querySelector('.progress-row-label')?.textContent).toBe(
      `${core.percent}% complete`,
    );
    expect(dashboard.textContent).toContain(`1 / ${core.unitsTotal} core units`);
    expect(dashboard.textContent).toContain(
      `${core.topicsDone} / ${core.topicsTotal} topics`,
    );
    const statValues = Array.from(dashboard.querySelectorAll('.stat-card .stat-value')).map(
      (value) => value.textContent,
    );
    expect(statValues).not.toContain(`${core.percent}%`);
  });
});
