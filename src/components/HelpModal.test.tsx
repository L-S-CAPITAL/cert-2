import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HelpModal from './HelpModal';
import QuizModal from './QuizModal';
import { ALL_UNITS } from '../data/course';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;
let opener: HTMLButtonElement;

const key = (k: string, init: KeyboardEventInit = {}) => {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }));
  });
};

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  opener = document.createElement('button');
  opener.textContent = 'opener';
  document.body.appendChild(opener);
  opener.focus();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('HelpModal focus management', () => {
  it('focuses the dialog, traps Tab, closes on Escape and restores focus', () => {
    const onClose = vi.fn();
    act(() => root.render(<HelpModal onClose={onClose} />));
    const dialog = container.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(document.activeElement).toBe(dialog);

    const close = Array.from(dialog.querySelectorAll('button')).find(
      (button) => button.textContent === 'Close',
    )!;
    key('Tab');
    expect(document.activeElement).toBe(close);
    key('Tab');
    expect(document.activeElement).toBe(close);
    key('Tab', { shiftKey: true });
    expect(document.activeElement).toBe(close);

    key('Escape');
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => root.render(<></>));
    expect(document.activeElement).toBe(opener);
  });
});

describe('QuizModal focus management', () => {
  it('does not steal focus back when the parent passes a new onClose', () => {
    const unit = ALL_UNITS.find((item) =>
      item.topics.some((topic) => (topic.quizQuestions?.length ?? 0) > 0),
    )!;
    const topic = unit.topics.find((item) => (item.quizQuestions?.length ?? 0) > 0)!;
    act(() => root.render(<QuizModal unit={unit} topic={topic} onClose={() => {}} />));
    const buttons = container.querySelectorAll<HTMLButtonElement>('[role="dialog"] button');
    expect(document.activeElement).toBe(buttons[0]);
    buttons[1].focus();

    const onClose = vi.fn();
    act(() => root.render(<QuizModal unit={unit} topic={topic} onClose={onClose} />));
    expect(document.activeElement).toBe(buttons[1]);

    key('Escape');
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => root.render(<></>));
    expect(document.activeElement).toBe(opener);
  });
});

describe('HelpModal content', () => {
  it('lists the quiz, flashcard and theme keys', () => {
    act(() => root.render(<HelpModal onClose={() => {}} />));
    const text = container.textContent ?? '';
    expect(text).toContain('In a quiz');
    expect(text).toContain('Pick answer A – D');
    expect(text).toContain('Flip the card');
    expect(text).toContain('Previous / next card');
    expect(text).toContain('light (paper) theme');
  });
});
