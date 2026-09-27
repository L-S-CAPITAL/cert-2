import React from 'react';
import { Unit, Topic, QuizQuestion } from '../types';
import { progressStore } from '../stores/progress';
import { useDialogFocus } from '../hooks/useDialogFocus';

interface QuizModalProps {
  unit: Unit;
  topic: Topic;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ unit, topic, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const questions = topic.quizQuestions || [];
  const isLast = questions.length > 0 && currentQuestion === questions.length - 1;

  useDialogFocus(dialogRef, onClose, { refocusKey: showResult });

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
      // Save every finished attempt (perfect or not) for the dashboard's
      // quiz history. Recorded here, once per Finish click, not in an effect.
      progressStore.recordQuizAttempt(unit.id, topic.id, score, questions.length);
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
      tabIndex={-1}
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
              color: perfect ? 'var(--status-ok)' : 'var(--text-amber)',
            }}
          >
            {score} / {questions.length}
          </div>
          <div style={{ color: 'var(--text-tertiary)', margin: '12px 0', fontSize: 13 }}>
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
        <div className="quiz-question" style={{ marginBottom: 12 }}>
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
              optionColor = isCorrect ? 'var(--status-ok)' : 'var(--status-bad)';
              optionBorder = optionColor;
            } else if (showFeedback && isCorrect) {
              optionColor = 'var(--status-ok)';
              optionBorder = 'var(--status-ok)';
            }

            return (
              <button
                key={i}
                type="button"
                className="terminal-btn quiz-option"
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
            fontSize: 12,
            color:
              selectedAnswer === q.correctAnswer
                ? 'var(--status-ok)'
                : 'var(--status-bad)',
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
