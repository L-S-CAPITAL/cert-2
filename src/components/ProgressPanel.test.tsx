import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProgressPanel from './ProgressPanel';

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

describe('Progress panel', () => {
  it('holds progress data, the unit table, and core and elective points', () => {
    act(() => root.render(<ProgressPanel />));
    const text = container.textContent ?? '';
    expect(text).toContain('Progress data');
    expect(text).toContain('All unit codes');
    expect(text).toContain('Core units');
    expect(text).toContain('Elective points');
    expect(text).not.toContain('Industry demand');
    expect(text).not.toContain('Job openings');
    expect(text).not.toContain('Pathways & skills');
  });

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

    act(() => root.render(<ProgressPanel />));
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
