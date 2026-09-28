import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import StatusBar from './StatusBar';
import Dashboard from './Dashboard';
import ProgressPanel from './ProgressPanel';
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
  it('show the same official points and units in StatusBar, Dashboard and PROGRESS', () => {
    // UEECD0009 (core, 40 pts) and UEECD0008 (Group B elective, 60 pts)
    const coreUnit = ALL_UNITS.find((unit) => unit.code === 'UEECD0009')!;
    const elective = ALL_UNITS.find((unit) => unit.code === 'UEECD0008')!;
    for (const topic of coreUnit.topics) progressStore.markTopicComplete(coreUnit.id, topic.id);
    for (const topic of elective.topics) progressStore.markTopicComplete(elective.id, topic.id);
    // An old save's completion for a removed elective (UEECD0044) is kept
    // but counts nowhere.
    progressStore.markTopicComplete('e1', 'e1-t1');

    const { core } = summarizeCompletion(ALL_UNITS, progressStore.getState().unitCompletions);

    act(() =>
      root.render(
        <>
          <StatusBar />
          <Dashboard units={ALL_UNITS} />
          <ProgressPanel />
        </>,
      ),
    );

    const statusItems = Array.from(container.querySelectorAll('.status-bar-item'));
    const statusValue = (label: string) =>
      statusItems
        .find((item) => item.querySelector('.label')?.textContent === label)
        ?.querySelector('.value')?.textContent;
    expect(statusValue('POINTS')).toBe('100/410');
    expect(statusValue('CORE UNITS')).toBe('1/8');
    expect(statusValue('ELECTIVE PTS')).toBe('60/140');
    // No topic-percentage headline figures any more.
    expect(statusValue('CORE PROGRESS')).toBeUndefined();
    expect(statusValue('ELECTIVES')).toBeUndefined();

    const dashboard = container.querySelector('.dashboard')!;
    const progressPanel = container.querySelector('.progress-panel')!;
    for (const view of [dashboard, progressPanel]) {
      const coreBar = view.querySelector('[role="progressbar"][aria-label="Core toward UEE22020"]')!;
      expect(coreBar.getAttribute('aria-valuenow')).toBe('1');
      expect(coreBar.getAttribute('aria-valuemax')).toBe('8');
      expect(coreBar.getAttribute('aria-valuetext')).toBe('1 of 8 core units, 40 of 270 core points');
      const electiveBar = view.querySelector(
        '[role="progressbar"][aria-label="Electives toward UEE22020"]',
      )!;
      expect(electiveBar.getAttribute('aria-valuenow')).toBe('60');
      expect(electiveBar.getAttribute('aria-valuemax')).toBe('140');
      expect(view.textContent).toContain(
        'Still needed: 7 core units (230 pts) and 3 elective units (80 pts).',
      );
    }
    expect(progressPanel.querySelectorAll('[role="progressbar"]')).toHaveLength(2);
    expect(dashboard.textContent).toContain(
      `40 / 270 core pts · ${core.topicsDone} / ${core.topicsTotal} core topics done`,
    );
    expect(progressPanel.textContent).not.toContain('Industry demand');
    expect(progressPanel.textContent).not.toContain('Job openings');
  });
});
