import React from 'react';
import { MathModule, Unit } from '../types';
import { progressStore } from '../stores/progress';
import QuizModal from './QuizModal';
import FlashcardDeck from './FlashcardDeck';

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
          <div className="empty-icon" aria-hidden="true">[ CARDS ]</div>
          <div className="empty-title">No flashcards yet</div>
          <div className="empty-text">
            This module has no flashcards yet. The short quiz below covers the same ideas.
          </div>
        </div>
      ) : (
        <>
          <FlashcardDeck
            cards={cards}
            index={index}
            flipped={flipped}
            seenCount={seenCount}
            onFlip={() => setFlipped((value) => !value)}
            onMove={go}
            label={`${module.title} flashcard`}
          />
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
