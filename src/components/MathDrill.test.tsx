import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MathDrill from './MathDrill';
import { MATH_MODULES, MATH_UNIT } from '../data/math';
import { ALGEBRA_MODULES, ALGEBRA_UNIT } from '../data/algebra';
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
  vi.useRealTimers();
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

  it('counts down from a fixed deadline even when questions change quickly', () => {
    vi.useFakeTimers();
    const module = MATH_MODULES.find((item) => item.kind === 'drill')!;
    expect(module.perQuestionSeconds).toBeUndefined();
    const total = module.drillSeconds ?? 600;
    act(() => {
      root.render(<MathDrill module={module} unit={MATH_UNIT} onBack={() => {}} />);
    });
    const clock = () =>
      container.querySelector('.terminal-section-title .section-count')?.textContent;
    const fmt = (s: number) =>
      `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    expect(clock()).toBe(fmt(total));

    // Skip a question every 0.9s. The old per-tick interval restarted on
    // every question and never reached a tick, so the clock froze.
    const skip = () =>
      Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Skip');
    for (let i = 0; i < 5; i += 1) {
      act(() => vi.advanceTimersByTime(900));
      act(() => skip()?.click());
    }
    act(() => vi.advanceTimersByTime(300));
    // 4.8s elapsed -> ceil(total - 4.8)
    expect(clock()).toBe(fmt(total - 4));

    act(() => vi.advanceTimersByTime(10_000));
    expect(clock()).toBe(fmt(total - 14));
  });

  it('resets the per-question deadline for each question', () => {
    vi.useFakeTimers();
    const module = ALGEBRA_MODULES.find(
      (item) => item.kind === 'drill' && item.perQuestionSeconds,
    )!;
    const per = module.perQuestionSeconds!;
    act(() => {
      root.render(<MathDrill module={module} unit={ALGEBRA_UNIT} onBack={() => {}} />);
    });
    const clock = () =>
      container.querySelector('.terminal-section-title .section-count')?.textContent ?? '';
    const secondsShown = () => {
      const [m, s] = clock().replace(' / Q', '').split(':').map(Number);
      return m * 60 + s;
    };
    expect(secondsShown()).toBe(per);
    act(() => vi.advanceTimersByTime(2_500));
    expect(secondsShown()).toBe(per - 2);
    const skip = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Skip',
    );
    act(() => skip?.click());
    expect(secondsShown()).toBe(per);
    // Let the question time out: it auto-advances with a fresh deadline.
    act(() => vi.advanceTimersByTime(per * 1000 + 300));
    expect(container.textContent).toContain('Question 3');
    expect(secondsShown()).toBe(per);
  });
});
