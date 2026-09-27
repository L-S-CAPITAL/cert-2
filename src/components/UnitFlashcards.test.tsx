import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import UnitFlashcards from './UnitFlashcards';
import UnitPanel from './UnitPanel';
import { ALL_UNITS } from '../data/course';
import { progressStore } from '../stores/progress';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

const button = (text: string) =>
  Array.from(container.querySelectorAll('button')).find((b) => b.textContent === text)!;

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

const e5 = ALL_UNITS.find((u) => u.code === 'UEECD0008')!;

describe('UnitFlashcards', () => {
  it('opens the deck, flips a card and moves through the cards', () => {
    act(() =>
      root.render(<UnitFlashcards unitCode={e5.code} cards={e5.flashcards!} sourceUrl={e5.sourceUrl} />),
    );
    expect(container.querySelector('.flashcard')).toBeNull();
    act(() => button('Show flashcards').click());

    const card = () => container.querySelector('.flashcard')!;
    expect(card().textContent).toContain(e5.flashcards![0].front);
    act(() => (card() as HTMLButtonElement).click());
    expect(card().getAttribute('aria-pressed')).toBe('true');
    expect(card().textContent).toContain(e5.flashcards![0].back);

    act(() => button('Next').click());
    expect(card().textContent).toContain(e5.flashcards![1].front);
    expect(container.textContent).toContain(`2 / ${e5.flashcards!.length} · seen 2`);
    act(() => button('Previous').click());
    act(() => button('Previous').click());
    expect(card().textContent).toContain(e5.flashcards![e5.flashcards!.length - 1].front);
    expect(container.textContent).toContain(`Written from the official unit text: ${e5.sourceUrl}`);
  });

  it('shows the deck and source in the Units tab for an unlocked new elective', () => {
    const c2 = ALL_UNITS.find((u) => u.code === 'UEECD0007')!;
    for (const topic of c2.topics) progressStore.markTopicComplete(c2.id, topic.id);
    act(() =>
      root.render(
        <UnitPanel
          units={ALL_UNITS}
          selectedUnitId={null}
          onUnitSelect={() => {}}
          expandedUnits={{ [e5.id]: true }}
          onToggleUnit={() => {}}
        />,
      ),
    );
    expect(container.textContent).toContain(`Flashcards (${e5.flashcards!.length})`);
    expect(container.textContent).toContain(`Source:${e5.sourceUrl}`);
    const topicHeader = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Plan energy sector support activity'),
    )!;
    act(() => topicHeader.click());
    expect(container.textContent).toContain('Start quiz (4)');
  });
});
