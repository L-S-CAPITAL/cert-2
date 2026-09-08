import React from 'react';
import { Unit, Topic, QuizQuestion } from '../types';
import { progressStore } from '../stores/progress';

interface QuizModalProps {
  unit: Unit;
  topic: Topic;
  onClose: () => void;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const QuizModal: React.FC<QuizModalProps> = ({ unit, topic, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const questions = topic.quizQuestions || [];
  const isLast = questions.length > 0 && currentQuestion === questions.length - 1;

  React.useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = dialogRef.current;
    const focusables = () =>
      root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !root) return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose, showResult]);

  React.useEffect(() => {
    if (
      showResult &&
      questions.length > 0 &&
      score === questions.length
    ) {
      progressStore.markTopicComplete(unit.id, topic.id);
    }
  }, [showResult, questions.length, score, unit.id, topic.id]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !questions[currentQuestion]) return;
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
    } else {
      setCurrentQuestion((value) => value + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const card = (title: string, body: React.ReactNode) => (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
      ref={dialogRef}
    >
      <div className="terminal-card" style={{ maxWidth: 600, width: '90%' }}>
        <div className="terminal-section-title" id="quiz-title">
          <span className="icon">QUIZ</span>
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
    const perfect = score === questions.length;
    return card(
      'Quiz Results',
      <>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: perfect ? 'var(--text-primary)' : 'var(--text-amber)',
            }}
          >
            {score} / {questions.length}
          </div>
          <div style={{ color: 'var(--text-tertiary)', margin: '12px 0', fontSize: 12 }}>
            {perfect
              ? 'PERFECT SCORE — topic marked complete'
              : `Score: ${Math.round((score / questions.length) * 100)}%`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button type="button" className="terminal-btn amber" onClick={handleRestart}>
            Retry
          </button>
          <button type="button" className="terminal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </>,
    );
  }

  const q: QuizQuestion = questions[currentQuestion];

  return card(
    `${unit.code} - ${topic.title}`,
    <>
      <div className="section-count" style={{ marginBottom: 12 }}>
        Q {currentQuestion + 1} / {questions.length}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            color: 'var(--text-primary)',
            fontSize: 13,
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {q.question}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {q.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === q.correctAnswer;
            const showFeedback = selectedAnswer !== null;
            let optionColor = 'var(--text-secondary)';
            let optionBorder = 'var(--border)';

            if (showFeedback && isSelected) {
              optionColor = isCorrect ? 'var(--text-primary)' : '#ff5555';
              optionBorder = optionColor;
            } else if (showFeedback && isCorrect) {
              optionColor = 'var(--text-primary)';
              optionBorder = 'var(--text-primary)';
            }

            return (
              <button
                key={i}
                type="button"
                className="terminal-btn"
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                style={{
                  textAlign: 'left',
                  borderColor: optionBorder,
                  color: optionColor,
                  justifyContent: 'flex-start',
                }}
              >
                <span style={{ marginRight: 8, color: 'var(--text-amber)' }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div
          style={{
            marginBottom: 12,
            fontSize: 11,
            color:
              selectedAnswer === q.correctAnswer
                ? 'var(--text-primary)'
                : '#ff5555',
          }}
        >
          {selectedAnswer === q.correctAnswer
            ? 'CORRECT'
            : `INCORRECT — The correct answer is ${String.fromCharCode(65 + q.correctAnswer)}`}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" className="terminal-btn" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="terminal-btn amber"
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </>,
  );
};

export default QuizModal;
