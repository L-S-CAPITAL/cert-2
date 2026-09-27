import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MathDrill from './MathDrill';
import { MATH_MODULES, MATH_UNIT } from '../data/math';
import { SHORTCUT_BLOCK_ATTR } from '../shortcuts';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('MathDrill', () => {
  it('blocks global shortcuts only while the drill is running', () => {
    const module = MATH_MODULES.find((item) => item.kind === 'drill');
    expect(module).toBeDefined();
    act(() => {
      root.render(<MathDrill module={module!} unit={MATH_UNIT} onBack={() => {}} />);
    });
    const blocker = () => container.querySelector(`[${SHORTCUT_BLOCK_ATTR}="true"]`);
    expect(blocker()).not.toBeNull();

    // Skip every question to finish the drill.
    for (let i = 0; i < 50 && container.textContent?.includes('Skip'); i += 1) {
      const skip = Array.from(container.querySelectorAll('button')).find(
        (button) => button.textContent === 'Skip',
      );
      act(() => skip?.click());
    }
    expect(container.textContent).toContain('Drill result');
    expect(blocker()).toBeNull();
  });
});
