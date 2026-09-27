import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import QualificationProgress from './QualificationProgress';
import { ALL_UNITS } from '../data/course';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const byCode = (code: string) => ALL_UNITS.find((unit) => unit.code === code)!;
const done = (...codes: string[]) =>
  Object.fromEntries(
    codes.map((code) => {
      const unit = byCode(code);
      return [unit.id, Object.fromEntries(unit.topics.map((topic) => [topic.id, true]))];
    }),
  );

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('QualificationProgress', () => {
  it('shows core units and elective points as two bars with what is still needed', () => {
    const completions = done('CPCCWHS1001', 'UEECD0007', 'UEECO0002', 'UEECD0044');
    act(() =>
      root.render(
        <QualificationProgress units={ALL_UNITS} completions={completions} coreTopicsPercent={36} />,
      ),
    );

    const bars = Array.from(container.querySelectorAll('[role="progressbar"]'));
    expect(bars.map((bar) => bar.getAttribute('aria-label'))).toEqual([
      'Core toward UEE22020',
      'Electives toward UEE22020',
    ]);
    expect(bars[0].getAttribute('aria-valuetext')).toBe('2 of 8 core units, 30 of 270 core points');
    expect(bars[1].getAttribute('aria-valuetext')).toBe('20 of 140 elective points');

    const labels = Array.from(container.querySelectorAll('.qual-row-label')).map((l) => l.textContent);
    expect(labels).toEqual(['2 / 8 units', '20 / 140 pts']);
    expect(container.querySelector('.section-count')?.textContent).toBe('50 / 410 pts');
    expect(container.textContent).toContain('30 / 270 core pts · 36% of core topics done');
    expect(container.textContent).toContain('Group A 20 pts (max 60) · Group B 0 pts (min 80)');
    expect(container.querySelector('.qual-needed')?.textContent).toBe(
      'Still needed: 6 core units (240 pts) and 120 elective pts, at least 80 from Group B.',
    );
    const caveat = container.querySelector('.qual-caveat')?.textContent ?? '';
    expect(caveat).toContain('can cover 40 of the 140 elective points');
    expect(caveat).toContain('UEECD0044 and UEECD0051 are not on the UEE22020 elective lists');
    expect(caveat).toContain('superseded by UEE22025');
  });
});
