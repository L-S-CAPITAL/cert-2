import React from 'react';
import { Flashcard } from '../types';

interface UnitFlashcardsProps {
  unitCode: string;
  cards: Flashcard[];
  sourceUrl?: string;
}

/**
 * A unit's flashcard deck in the Units tab. Same card markup and styles as
 * the study-strand flashcards (MathFlashcards); reviewing cards does not
 * mark topics complete, since unit progress comes from topics.
 */
const UnitFlashcards: React.FC<UnitFlashcardsProps> = ({ unitCode, cards, sourceUrl }) => {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [seen, setSeen] = React.useState<Record<number, boolean>>({ 0: true });
  const panelId = React.useId();

  if (cards.length === 0) return null;
  const card = cards[index];
  const seenCount = Object.keys(seen).length;

  const go = (next: number) => {
    const wrapped = (next + cards.length) % cards.length;
    setIndex(wrapped);
    setFlipped(false);
    setSeen((current) => ({ ...current, [wrapped]: true }));
  };

  return (
    <div className="unit-flashcards" style={{ marginTop: 10 }}>
      <div className="terminal-section-title" style={{ marginBottom: 6 }}>
        <span className="icon">CARDS</span>
        <span>Flashcards ({cards.length})</span>
        <button
          type="button"
          className="terminal-btn"
          style={{ marginLeft: 'auto' }}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Hide flashcards' : 'Show flashcards'}
        </button>
      </div>

      {open && (
        <div id={panelId}>
          <button
            type="button"
            className={`flashcard ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped((value) => !value)}
            aria-pressed={flipped}
            aria-label={`${unitCode} flashcard ${index + 1} of ${cards.length}, ${
              flipped ? 'back' : 'front'
            }`}
          >
            <span className="flashcard-label">{flipped ? 'BACK' : 'FRONT'}</span>
            <span className="flashcard-text">{flipped ? card.back : card.front}</span>
            <span className="flashcard-hint">Click to flip</span>
          </button>
          <div className="flashcard-nav">
            <button type="button" className="terminal-btn" onClick={() => go(index - 1)}>
              Previous
            </button>
            <span className="math-body">
              {index + 1} / {cards.length} · seen {seenCount}
            </span>
            <button type="button" className="terminal-btn" onClick={() => go(index + 1)}>
              Next
            </button>
          </div>
          {sourceUrl && (
            <div className="dashboard-note" style={{ marginTop: 6 }}>
              Written from the official unit text: {sourceUrl}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitFlashcards;
