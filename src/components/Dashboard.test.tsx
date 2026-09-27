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
      'no quiz scores recorded yet',
    );
    const first = ALL_UNITS[0];
    expect(statCard('Topics left: next unit')?.querySelector('.stat-value')?.textContent).toBe(
      String(first.topics.length),
    );
    // Overall progress lives in the qualification bars, not in a card.
    expect(container.querySelectorAll('.stat-card')).toHaveLength(4);
    expect(container.querySelector('.qual-row-label')?.textContent).toBe('0 / 8 units');
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
