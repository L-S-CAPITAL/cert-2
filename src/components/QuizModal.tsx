import React from 'react';
import { Unit, Topic, QuizQuestion } from '../types';
import { progressStore } from '../stores/progress';
import { useDialogFocus } from '../hooks/useDialogFocus';
import {
  QuizRound,
  explanationFor,
  fullRound,
  missedQuestions,
  optionLetter,
  reviewRound,
  roundScore,
  shouldRecordRound,
} from '../data/quiz';

interface QuizModalProps {
  unit: Unit;
  topic: Topic;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ unit, topic, onClose }) => {
  const questions: QuizQuestion[] = React.useMemo(() => topic.quizQuestions || [], [topic]);
  const [round, setRound] = React.useState<QuizRound>(() => fullRound(questions));
  const [roundKey, setRoundKey] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  // Answers for the current round, keyed by question index.
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [showResult, setShowResult] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

  useDialogFocus(dialogRef, onClose, { refocusKey: `${roundKey}-${showResult}` });

  const questionIndex = round.order[position];
  const q = questions[questionIndex];
  const selectedAnswer = q ? answers[questionIndex] ?? null : null;
  const isLast = position === round.order.length - 1;
  const isReview = round.mode === 'review';

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !q) return;
    setAnswers((current) => ({ ...current, [questionIndex]: index }));
  };

  // After answering, the options are disabled: move focus to Next/Finish so
  // Enter continues and focus is not lost to the page.
  React.useEffect(() => {
    if (selectedAnswer !== null) nextRef.current?.focus();
  }, [selectedAnswer]);

  const startRound = (next: QuizRound) => {
    setRound(next);
    setRoundKey((key) => key + 1);
    setPosition(0);
    setAnswers({});
    setShowResult(false);
  };

  const handleNext = () => {
    if (!isLast) {
      setPosition((value) => value + 1);
      return;
    }
    const score = roundScore(questions, round, answers);
    if (shouldRecordRound(round)) {
      // Save every finished full attempt (perfect or not) for the
      // dashboard's quiz history, once per Finish click. Review rounds are
      // practice and are not saved (see shouldRecordRound).
      progressStore.recordQuizAttempt(unit.id, topic.id, score, questions.length);
      if (score === questions.length) progressStore.markTopicComplete(unit.id, topic.id);
    }
    setShowResult(true);
  };

  // Number keys 1-4 (or up to the number of options) pick an answer. Global
  // shortcuts are already off while this dialog is open, so they cannot
  // switch tabs underneath the quiz.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || showResult || !q) return;
    if (!/^[1-9]$/.test(event.key)) return;
    const index = Number(event.key) - 1;
    if (index >= q.options.length || selectedAnswer !== null) return;
    event.preventDefault();
    handleAnswer(index);
  };

  const card = (title: string, body: React.ReactNode) => (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
      tabIndex={-1}
      ref={dialogRef}
      onKeyDown={onKeyDown}
    >
      <div className="terminal-card quiz-card" style={{ maxWidth: 640, width: '90%' }}>
        <div className="terminal-section-title" id="quiz-title">
          <span className="icon">{isReview ? 'REVIEW' : 'QUIZ'}</span>
          <span>{title}</span>
        </div>
        {body}
      </div>
    </div>
  );

  if (questions.length === 0) {
    return card(
      `${unit.code} - ${topic.title}`,
      <>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
          No questions are available for this topic.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="terminal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </>,
    );
  }

  if (showResult) {
    const total = round.order.length;
    const score = roundScore(questions, round, answers);
    const missed = missedQuestions(questions, round, answers);
    const perfect = missed.length === 0;
    const percent = Math.round((score / total) * 100);
    return card(
      isReview ? 'Review results' : 'Quiz results',
      <>
        <div className="quiz-result-panel" style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div
            className="quiz-result-score"
            style={{ color: perfect ? 'var(--status-ok)' : 'var(--text-amber)' }}
          >
            {score} / {total}
          </div>
          <div className="quiz-result-note">
            {isReview
              ? perfect
                ? 'All missed questions answered correctly this time.'
                : `${score} of ${total} missed questions now correct (${percent}%).`
              : perfect
                ? 'Perfect score: topic marked complete.'
                : `Score: ${percent}%. ${missed.length} to review.`}
          </div>
          {isReview && (
            <div className="quiz-result-sub">
              Review rounds are practice: they are not saved to your quiz history.
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {!perfect && (
            <button
              type="button"
              className="terminal-btn amber"
              onClick={() => startRound(reviewRound(missed))}
            >
              Review mistakes ({missed.length})
            </button>
          )}
          <button
            type="button"
            className={`terminal-btn${perfect ? ' amber' : ''}`}
            onClick={() => startRound(fullRound(questions))}
          >
            {isReview ? 'Retake full quiz' : 'Retry'}
          </button>
          <button type="button" className="terminal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </>,
    );
  }

  const answered = selectedAnswer !== null;
  const correct = answered && selectedAnswer === q.correctAnswer;
  const explanation = explanationFor(q);

  return card(
    `${unit.code} - ${topic.title}`,
    <>
      <div className="quiz-progress-row">
        <span className="section-count">
          {isReview ? 'Review ' : ''}Q {position + 1} / {round.order.length}
        </span>
        <span className="quiz-key-hint">
          Keys 1–{q.options.length} answer · Enter continues
        </span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div className="quiz-question" id="quiz-question" style={{ marginBottom: 12 }}>
          {q.question}
        </div>
        <div
          className="quiz-options"
          role="group"
          aria-labelledby="quiz-question"
          style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
        >
          {q.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isAnswer = i === q.correctAnswer;
            const state = !answered
              ? ''
              : isAnswer
                ? ' is-correct'
                : isSelected
                  ? ' is-wrong'
                  : ' is-other';
            return (
              <button
                key={i}
                type="button"
                className={`terminal-btn quiz-option${state}`}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                aria-keyshortcuts={i < 9 ? String(i + 1) : undefined}
              >
                <span className="quiz-option-letter">{optionLetter(i)}.</span>
                <span className="quiz-option-text">{option}</span>
                {answered && isAnswer && (
                  <span className="quiz-option-mark">
                    <span aria-hidden="true">✓</span>
                    <span className="visually-hidden">(correct answer)</span>
                  </span>
                )}
                {answered && isSelected && !isAnswer && (
                  <span className="quiz-option-mark">
                    <span aria-hidden="true">✗</span>
                    <span className="visually-hidden">(your answer)</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Always rendered so screen readers announce the feedback when it appears. */}
      <div
        className={`quiz-feedback${answered ? (correct ? ' correct' : ' incorrect') : ''}`}
        role="status"
        aria-live="polite"
      >
        {answered && (
          <>
            <div className="quiz-feedback-head">
              <span aria-hidden="true">{correct ? '✓' : '✗'}</span>{' '}
              {correct
                ? 'Correct.'
                : `Incorrect. The answer is ${optionLetter(q.correctAnswer)}: ${q.options[q.correctAnswer]}`}
            </div>
            {explanation && <div className="quiz-explanation">{explanation}</div>}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
        <button type="button" className="terminal-btn" onClick={onClose}>
          Cancel
        </button>
        <button
          ref={nextRef}
          type="button"
          className="terminal-btn amber"
          onClick={handleNext}
          disabled={!answered}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </>,
  );
};

export default QuizModal;
