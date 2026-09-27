import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import UnitFlashcards from './UnitFlashcards';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const cards = [
  { front: 'F1', back: 'B1' },
  { front: 'F2', back: 'B2' },
  { front: 'F3', back: 'B3' },
];

const keydown = (target: Element, key: string, init: KeyboardEventInit = {}) =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
  });

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<UnitFlashcards unitCode="TEST" cards={cards} />));
  const show = Array.from(container.querySelectorAll('button')).find(
    (b) => b.textContent === 'Show flashcards',
  )!;
  act(() => show.click());
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

const card = () => container.querySelector<HTMLButtonElement>('.flashcard')!;

describe('Flashcard keyboard', () => {
  it('the card is a real button, so Space and Enter flip it', () => {
    expect(card().tagName).toBe('BUTTON');
    expect(card().getAttribute('aria-keyshortcuts')).toContain('Space');
    act(() => card().click());
    expect(card().getAttribute('aria-pressed')).toBe('true');
    expect(card().textContent).toContain('B1');
  });

  it('moves with the arrow keys and wraps, keeping focus on the card', () => {
    card().focus();
    keydown(card(), 'ArrowRight');
    expect(card().textContent).toContain('F2');
    expect(document.activeElement).toBe(card());
    keydown(card(), 'ArrowLeft');
    keydown(card(), 'ArrowLeft');
    expect(card().textContent).toContain('F3');
    expect(container.textContent).toContain('3 / 3 · seen 3');
  });

  it('ignores arrows with modifiers and shows a keyboard hint', () => {
    keydown(card(), 'ArrowRight', { altKey: true });
    expect(card().textContent).toContain('F1');
    expect(card().textContent).toContain('Space to flip');
  });
});
