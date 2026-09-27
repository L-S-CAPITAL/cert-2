import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MathFlashcards from './MathFlashcards';
import { MATH_MODULES, MATH_UNIT } from '../data/math';
import { progressStore } from '../stores/progress';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const button = (label: string | RegExp) =>
  Array.from(container.querySelectorAll('button')).find((item) =>
    typeof label === 'string' ? item.textContent === label : label.test(item.textContent ?? ''),
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

const flashModule = MATH_MODULES.find((item) => item.kind === 'flashcards')!;

describe('MathFlashcards', () => {
  it('shows an empty state instead of NaN navigation when there are no cards', () => {
    const empty = { ...flashModule, flashcards: [] };
    act(() => root.render(<MathFlashcards module={empty} unit={MATH_UNIT} onBack={() => {}} />));
    expect(container.textContent).toContain('No flashcards yet');
    expect(button('Next')).toBeUndefined();
    expect(button('Previous')).toBeUndefined();
    expect(button(/Mark reviewed|Review all cards/)).toBeUndefined();
    expect(container.textContent).not.toContain('NaN');
  });

  it('confirms "Mark reviewed" visibly and through a live region', () => {
    const cards = flashModule.flashcards ?? [];
    expect(cards.length).toBeGreaterThan(0);
    act(() =>
      root.render(<MathFlashcards module={flashModule} unit={MATH_UNIT} onBack={() => {}} />),
    );
    const status = container.querySelector('[role="status"][aria-live="polite"]')!;
    expect(status.textContent).toBe('');
    for (let i = 1; i < cards.length; i += 1) {
      act(() => button('Next')!.click());
    }
    act(() => button('Mark reviewed')!.click());
    expect(status.textContent).toBe(`Reviewed: ${flashModule.title} marked complete.`);
    expect(progressStore.isTopicComplete(MATH_UNIT.id, flashModule.id)).toBe(true);
  });
});
