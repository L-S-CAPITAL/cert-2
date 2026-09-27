import React from 'react';
import { MathModule, Unit } from '../types';
import { progressStore } from '../stores/progress';
import QuizModal from './QuizModal';

interface MathFlashcardsProps {
  module: MathModule;
  unit: Unit;
  onBack: () => void;
}

const MathFlashcards: React.FC<MathFlashcardsProps> = ({
  module,
  unit,
  onBack,
}) => {
  const cards = module.flashcards ?? [];
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [seen, setSeen] = React.useState<Record<number, boolean>>({ 0: true });
  const [quizOpen, setQuizOpen] = React.useState(false);
  const [reviewedMessage, setReviewedMessage] = React.useState('');
  const topic = unit.topics.find((item) => item.id === module.id);
  const card = cards[index];
  const seenCount = Object.keys(seen).length;
  const allSeen = cards.length > 0 && seenCount >= cards.length;

  const go = (next: number) => {
    if (cards.length === 0) return;
    const wrapped = (next + cards.length) % cards.length;
    setIndex(wrapped);
    setFlipped(false);
    setSeen((current) => ({ ...current, [wrapped]: true }));
  };

  const markReviewed = () => {
    progressStore.markTopicComplete(unit.id, module.id);
    setReviewedMessage(`Reviewed: ${module.title} marked complete.`);
  };

  return (
    <div className="math-lesson">
      <button type="button" className="terminal-btn" onClick={onBack}>
        Back to modules
      </button>

      <div className="terminal-section-title" style={{ marginTop: 12 }}>
        <span className="icon">REST</span>
        <span>{module.title}</span>
      </div>
      <p className="math-lede">{module.summary}</p>
      <p className="math-body">{module.whyItMatters}</p>

      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">[ No flashcards yet ]</div>
          <div style={{ color: 'var(--text-tertiary)' }}>
            This module has no flashcards. Try the short quiz instead.
          </div>
        </div>
      ) : (
        <>
          {card && (
            <button
              type="button"
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped((value) => !value)}
              aria-pressed={flipped}
            >
              <span className="flashcard-label">{flipped ? 'BACK' : 'FRONT'}</span>
              <span className="flashcard-text">{flipped ? card.back : card.front}</span>
              <span className="flashcard-hint">Click to flip</span>
            </button>
          )}

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
        </>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {cards.length > 0 && (
          <button
            type="button"
            className="terminal-btn amber"
            onClick={markReviewed}
            disabled={!allSeen}
          >
            {allSeen ? 'Mark reviewed' : `Review all cards (${seenCount}/${cards.length})`}
          </button>
        )}
        <button
          type="button"
          className="terminal-btn"
          onClick={() => setQuizOpen(true)}
          disabled={!topic}
        >
          Short quiz ({module.quizQuestions.length})
        </button>
      </div>
      <div
        role="status"
        aria-live="polite"
        style={{ marginTop: 8, fontSize: 11, color: 'var(--text-amber)' }}
      >
        {reviewedMessage}
      </div>

      {quizOpen && topic && (
        <QuizModal
          unit={unit}
          topic={topic}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
};

export default MathFlashcards;
