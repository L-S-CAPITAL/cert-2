import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UnitPanel from './UnitPanel';
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
  document.body.innerHTML = '';
});

describe('UnitPanel', () => {
  it('does not select or expand a locked unit', () => {
    const onUnitSelect = vi.fn();
    const onToggleUnit = vi.fn();
    act(() =>
      root.render(
        <UnitPanel
          units={ALL_UNITS}
          expandedUnits={{}}
          onToggleUnit={onToggleUnit}
          onUnitSelect={onUnitSelect}
          selectedUnitId={null}
        />,
      ),
    );
    const headers = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button.unit-header'),
    );
    const locked = headers.find((button) => button.getAttribute('aria-disabled') === 'true');
    const unlocked = headers.find((button) => button.getAttribute('aria-disabled') === 'false');
    expect(locked).toBeDefined();
    expect(unlocked).toBeDefined();

    act(() => locked!.click());
    expect(onUnitSelect).not.toHaveBeenCalled();
    expect(onToggleUnit).not.toHaveBeenCalled();

    act(() => unlocked!.click());
    expect(onUnitSelect).toHaveBeenCalledTimes(1);
    expect(onToggleUnit).toHaveBeenCalledTimes(1);
  });
});
