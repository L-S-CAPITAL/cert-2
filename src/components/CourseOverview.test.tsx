import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CourseOverview from './CourseOverview';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;
const originalCreate = URL.createObjectURL;
const originalRevoke = URL.revokeObjectURL;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  vi.useRealTimers();
  vi.restoreAllMocks();
  URL.createObjectURL = originalCreate;
  URL.revokeObjectURL = originalRevoke;
  document.body.innerHTML = '';
});

describe('CourseOverview pathways', () => {
  it('lists pathways and the core skillset in place of career outcomes', () => {
    act(() => root.render(<CourseOverview />));
    const text = container.textContent ?? '';
    expect(text).toContain('Pathways & skills');
    expect(text).toContain('Electrical - residential / commercial / industrial');
    expect(text).toContain('Apprentice electrician, trade assistant: basic circuits, wiring, cabling, test equipment, drawings, WHS.');
    expect(text).toContain('Electronics and assembly');
    expect(text).toContain('Telecommunications, data and AV');
    expect(text).toContain('Security and alarms');
    expect(text).toContain('Renewable energy');
    expect(text).toContain('Refrigeration / HVAC - assistant level');
    expect(text).toContain('Instrumentation, control and automation - entry');
    expect(text).toContain('Electrical wholesaling / supply');
    expect(text).toContain('Core skillset you get:');
    expect(text).toContain("Basic DC/AC circuits, Ohm's law");
    expect(text).toContain('Workplace communication and problem-solving');
    expect(text).not.toContain('Career outcomes');
    expect(text).not.toContain('Trades Assistant');
    expect(text).not.toContain('Electrotechnology Apprentice');
  });
});

describe('CourseOverview export', () => {
  it('revokes the blob URL only after the download click', () => {
    vi.useFakeTimers();
    const calls: string[] = [];
    URL.createObjectURL = vi.fn(() => {
      calls.push('create');
      return 'blob:test';
    });
    URL.revokeObjectURL = vi.fn(() => {
      calls.push('revoke');
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      calls.push('click');
    });

    act(() => root.render(<CourseOverview />));
    const exportButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Export',
    )!;
    act(() => exportButton.click());
    expect(calls).toEqual(['create', 'click']);

    act(() => vi.runAllTimers());
    expect(calls).toEqual(['create', 'click', 'revoke']);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });
});
