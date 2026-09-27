import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from './Dashboard';
import { ALL_UNITS } from '../data/course';
import { progressStore } from '../stores/progress';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const unitByCode = (code: string) => ALL_UNITS.find((unit) => unit.code === code)!;
const completeUnit = (code: string) => {
  const unit = unitByCode(code);
  for (const topic of unit.topics) progressStore.markTopicComplete(unit.id, topic.id);
};

const render = (props: Partial<React.ComponentProps<typeof Dashboard>> = {}) =>
  act(() => root.render(<Dashboard units={ALL_UNITS} {...props} />));

const rowCodes = (scope: ParentNode) =>
  Array.from(scope.querySelectorAll('tr.unit-row .unit-row-code')).map((cell) => cell.textContent);

const statCard = (label: string) =>
  Array.from(container.querySelectorAll('.stat-card')).find(
    (card) => card.querySelector('.stat-label')?.textContent === label,
  );

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

describe('Dashboard unit table', () => {
  it('lists in-progress units first, then not started, and folds completed units away', () => {
    completeUnit('CPCCWHS1001');
    completeUnit('UEECD0007');
    const c5 = unitByCode('UEECD0038');
    const c8 = unitByCode('UEERE0021');
    progressStore.markTopicComplete(c8.id, c8.topics[0].id);
    progressStore.markTopicComplete(c5.id, c5.topics[0].id);
    render();

    const mainTable = container.querySelector('.dashboard > .terminal-section table.unit-progress-table')!;
    const main = rowCodes(mainTable);
    // In-progress units keep course order among themselves.
    expect(main.slice(0, 2)).toEqual(['UEECD0038', 'UEERE0021']);
    expect(main).not.toContain('CPCCWHS1001');
    expect(main).toHaveLength(ALL_UNITS.length - 2);

    const completed = container.querySelector('details.completed-units')!;
    expect(completed.hasAttribute('open')).toBe(false);
    expect(completed.querySelector('summary')?.textContent).toBe('Completed (2)');
    expect(rowCodes(completed)).toEqual(['CPCCWHS1001', 'UEECD0007']);
  });

  it('shows topics once, as a bar with "x / y" inside', () => {
    const c5 = unitByCode('UEECD0038');
    progressStore.markTopicComplete(c5.id, c5.topics[0].id);
    render();

    const row = Array.from(container.querySelectorAll('tr.unit-row')).find((candidate) =>
      candidate.textContent?.includes(c5.code),
    )!;
    const bar = row.querySelector('[role="progressbar"]')!;
    expect(bar.textContent).toBe('1 / 3');
    expect(bar.getAttribute('aria-valuetext')).toBe('1 of 3 topics');
    expect(row.textContent).not.toContain('33%');
    expect(row.querySelectorAll('td')).toHaveLength(4);
  });

  it('opens a unit by clicking its row or its button (Enter / Space activate buttons)', () => {
    const onOpenUnit = vi.fn();
    render({ onOpenUnit });

    const c8 = unitByCode('UEERE0021');
    const row = Array.from(container.querySelectorAll<HTMLTableRowElement>('tr.unit-row')).find(
      (candidate) => candidate.textContent?.includes(c8.code),
    )!;
    act(() => row.querySelector('td')!.click());
    expect(onOpenUnit).toHaveBeenLastCalledWith(c8.id);

    const button = row.querySelector<HTMLButtonElement>('button.row-link')!;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe(`Open unit ${c8.code}: ${c8.name}`);
    onOpenUnit.mockClear();
    act(() => button.click());
    expect(onOpenUnit).toHaveBeenCalledTimes(1);
    expect(onOpenUnit).toHaveBeenCalledWith(c8.id);
  });

  it('marks units whose prerequisites are unfinished as locked', () => {
    render();
    const row = Array.from(container.querySelectorAll('tr.unit-row')).find((candidate) =>
      candidate.textContent?.includes('UEECD0009'),
    )!;
    expect(row.querySelector('.unit-status')?.textContent).toBe('LOCKED');
  });
});

describe('Dashboard continue card', () => {
  it('resumes the timed unit at its topic', () => {
    const c5 = unitByCode('UEECD0038');
    progressStore.startTopicSession(c5.id, c5.topics[2].id);
    const onOpenUnit = vi.fn();
    render({ onOpenUnit });

    const card = container.querySelector('.continue-card')!;
    expect(card.textContent).toContain('Resume timed unit');
    expect(card.textContent).toContain(`Next topic 3 of 3: ${c5.topics[2].title}`);
    act(() => card.querySelector<HTMLButtonElement>('.continue-btn')!.click());
    expect(onOpenUnit).toHaveBeenCalledWith(c5.id, c5.topics[2].id);
  });

  it('suggests the first unit to start when nothing has been studied', () => {
    render();
    const card = container.querySelector('.continue-card')!;
    const first = ALL_UNITS[0];
    expect(card.textContent).toContain('Up next');
    expect(card.textContent).toContain(first.code);
    expect(card.textContent).toContain(`Next topic 1 of ${first.topics.length}`);
  });

  it('handles every unit being complete', () => {
    for (const unit of ALL_UNITS) completeUnit(unit.code);
    render();
    const card = container.querySelector('.continue-card')!;
    expect(card.textContent).toContain(`All ${ALL_UNITS.length} units complete`);
    expect(card.querySelector('.continue-btn')).toBeNull();
    expect(container.querySelector('details.completed-units summary')?.textContent).toBe(
      `Completed (${ALL_UNITS.length})`,
    );
    expect(statCard('Topics left: next unit')?.querySelector('.stat-detail')?.textContent).toBe(
      'every unit is complete',
    );
  });
});

describe('Dashboard stats', () => {
  it('shows real figures or an honest empty state', () => {
    render();
    expect(statCard('Study time this week')?.querySelector('.stat-value')?.textContent).toBe('0m');
    expect(statCard('Study time this week')?.querySelector('.stat-detail')?.textContent).toBe(
      'no sessions logged in the last 2 weeks',
    );
    expect(statCard('Day streak')?.querySelector('.stat-value')?.textContent).toBe('0 days');
    expect(statCard('Average quiz score')?.querySelector('.stat-value')?.textContent).toBe('—');
    expect(statCard('Average quiz score')?.querySelector('.stat-detail')?.textContent).toBe(
      'no quizzes taken yet',
    );
    const first = ALL_UNITS[0];
    expect(statCard('Topics left: next unit')?.querySelector('.stat-value')?.textContent).toBe(
      String(first.topics.length),
    );
    // The overall % is shown once, beside the progress bar, not as a card.
    expect(container.querySelectorAll('.stat-card')).toHaveLength(4);
    expect(container.querySelector('.progress-row-label')?.textContent).toBe('0% complete');
  });

  it('counts a session logged today toward this week and the streak', () => {
    const c5 = unitByCode('UEECD0038');
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 8, 28, 9, 0, 0));
      progressStore.startSession(c5.id);
      vi.setSystemTime(new Date(2026, 8, 28, 9, 4, 33));
      progressStore.stopSession();
      render();
    } finally {
      vi.useRealTimers();
    }
    // Rendered while "now" was 28 Sep 2026 09:04:33 local.
    expect(statCard('Study time this week')?.querySelector('.stat-value')?.textContent).toBe('4m 33s');
    expect(statCard('Day streak')?.querySelector('.stat-value')?.textContent).toBe('1 day');
    expect(statCard('Day streak')?.querySelector('.stat-detail')?.textContent).toBe('studied today');
  });
});

describe('Dashboard quiz results and study chart', () => {
  it('averages saved quiz attempts and lists the five newest', () => {
    const c5 = unitByCode('UEECD0038');
    const scores: Array<[number, number]> = [
      [1, 3],
      [2, 3],
      [3, 3],
      [0, 3],
      [3, 3],
      [2, 4],
    ];
    for (const [score, total] of scores) {
      progressStore.recordQuizAttempt(c5.id, c5.topics[0].id, score, total);
    }
    render();

    // (33 + 67 + 100 + 0 + 100 + 50) / 6 = 58.3 -> 58%
    const card = statCard('Average quiz score')!;
    expect(card.querySelector('.stat-value')?.textContent).toBe('58%');
    expect(card.querySelector('.stat-detail')?.textContent).toBe('across 6 attempts');

    const items = Array.from(container.querySelectorAll('.quiz-results .quiz-result'));
    expect(items).toHaveLength(5);
    // Newest first: the last recorded attempt (2 / 4) leads.
    expect(items[0].querySelector('.quiz-score')?.textContent).toBe('2 / 4 (50%)');
    expect(items[0].querySelector('.quiz-topic')?.textContent).toBe(
      `${c5.code} ${c5.topics[0].title}`,
    );
    expect(items[1].querySelector('.quiz-score')?.classList.contains('perfect')).toBe(true);
    expect(container.querySelector('.recent-quizzes .section-count')?.textContent).toBe('6 saved');
  });

  it('shows empty states with no quizzes or sessions', () => {
    render();
    expect(container.querySelector('.quiz-empty')?.textContent).toContain('No quiz results yet');
    const chart = container.querySelector('.study-chart[role="img"]')!;
    expect(chart.getAttribute('aria-label')).toContain('nothing logged in the last 14 days');
    expect(container.querySelectorAll('.study-chart-bar')).toHaveLength(14);
  });

  it('summarises the chart for screen readers and lists every day in a hidden table', () => {
    const c5 = unitByCode('UEECD0038');
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date(2026, 8, 26, 10, 0, 0));
      progressStore.startSession(c5.id);
      vi.setSystemTime(new Date(2026, 8, 26, 10, 25, 0));
      progressStore.stopSession();
      vi.setSystemTime(new Date(2026, 8, 28, 9, 0, 0));
      progressStore.startSession(c5.id);
      vi.setSystemTime(new Date(2026, 8, 28, 9, 10, 0));
      progressStore.stopSession();
      render();
    } finally {
      vi.useRealTimers();
    }

    const chart = container.querySelector('.study-chart[role="img"]')!;
    const label = chart.getAttribute('aria-label')!;
    expect(label).toContain('35m in total over 2 days');
    expect(label).toContain('with 25 min');

    const bars = Array.from(container.querySelectorAll<HTMLElement>('.study-chart-bar'));
    expect(bars[13].style.height).toBe('40%'); // 10 of the 25-minute peak
    expect(bars[11].style.height).toBe('100%');
    expect(bars[12].style.height).toBe('0%');

    const rows = Array.from(container.querySelectorAll('table.visually-hidden tbody tr'));
    expect(rows).toHaveLength(14);
    expect(rows[13].querySelector('td')?.textContent).toBe('10 min');
    expect(rows[12].querySelector('td')?.textContent).toBe('0 min');
  });
});
