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

    // CourseOverview keeps the topic-based core bar.
    const coreBars = container.querySelectorAll(
      '[role="progressbar"][aria-label^="Core progress"]',
    );
    expect(coreBars).toHaveLength(1);
    expect(coreBars[0].getAttribute('aria-valuenow')).toBe(String(core.percent));

    // The dashboard measures progress toward the qualification: core units
    // as a bar, with the same topic % as a detail line.
    const dashboard = container.querySelector('.dashboard')!;
    const coreBar = dashboard.querySelector('[role="progressbar"][aria-label="Core toward UEE22020"]')!;
    expect(coreBar.getAttribute('aria-valuenow')).toBe('1');
    expect(coreBar.getAttribute('aria-valuemax')).toBe(String(core.unitsTotal));
    expect(dashboard.textContent).toContain(`1 / ${core.unitsTotal} units`);
    expect(dashboard.textContent).toContain(`${core.percent}% of core topics done`);
    // The completed elective (UEECD0044) is not on the UEE22020 elective
    // lists, so it adds no elective points.
    const electiveBar = dashboard.querySelector(
      '[role="progressbar"][aria-label="Electives toward UEE22020"]',
    )!;
    expect(electiveBar.getAttribute('aria-valuenow')).toBe('0');
    const statValues = Array.from(dashboard.querySelectorAll('.stat-card .stat-value')).map(
      (value) => value.textContent,
    );
    expect(statValues).not.toContain(`${core.percent}%`);
  });
});
