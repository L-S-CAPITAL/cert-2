import React from 'react';
import { Flashcard } from '../types';

interface FlashcardDeckProps {
  cards: Flashcard[];
  index: number;
  flipped: boolean;
  seenCount: number;
  onFlip: () => void;
  onMove: (next: number) => void;
  /** Accessible name prefix, e.g. "UEECD0019 flashcard". */
  label?: string;
}

/**
 * One flashcard plus Previous / Next, shared by the unit decks and the strand
 * modules. Keyboard: Space or Enter flips the card (it is a button), and
 * ← / → move to the previous / next card while focus is anywhere in the deck.
 */
const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  index,
  flipped,
  seenCount,
  onFlip,
  onMove,
  label = 'Flashcard',
}) => {
  const card = cards[index];
  if (!card) return null;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onMove(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onMove(index - 1);
    }
  };

  return (
    <div className="flashcard-deck" onKeyDown={onKeyDown}>
      <button
        type="button"
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={onFlip}
        aria-pressed={flipped}
        aria-keyshortcuts="Space Enter ArrowLeft ArrowRight"
        aria-label={`${label} ${index + 1} of ${cards.length}, ${flipped ? 'back' : 'front'}: ${
          flipped ? card.back : card.front
        }`}
      >
        <span className="flashcard-label">{flipped ? 'BACK' : 'FRONT'}</span>
        <span className="flashcard-text">{flipped ? card.back : card.front}</span>
        <span className="flashcard-hint">Click or press Space to flip · ← → to move</span>
      </button>
      <div className="flashcard-nav">
        <button
          type="button"
          className="terminal-btn"
          onClick={() => onMove(index - 1)}
          aria-keyshortcuts="ArrowLeft"
        >
          Previous
        </button>
        <span className="math-body">
          {index + 1} / {cards.length} · seen {seenCount}
        </span>
        <button
          type="button"
          className="terminal-btn"
          onClick={() => onMove(index + 1)}
          aria-keyshortcuts="ArrowRight"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
