import React from 'react';
import { MathModule, Unit } from '../types';
import QuizModal from './QuizModal';

interface MathLessonProps {
  module: MathModule;
  unit: Unit;
  onBack: () => void;
}

const MathLesson: React.FC<MathLessonProps> = ({ module, unit, onBack }) => {
  const [quizOpen, setQuizOpen] = React.useState(false);
  const topic = unit.topics.find((item) => item.id === module.id);

  return (
    <div className="math-lesson">
      <button type="button" className="terminal-btn" onClick={onBack}>
        Back to modules
      </button>

      <div className="terminal-section-title" style={{ marginTop: 12 }}>
        <span className="icon">M{module.order}</span>
        <span>{module.title}</span>
      </div>
      <p className="math-lede">{module.summary}</p>

      <div className="terminal-card">
        <div className="card-title">
          <span className="icon">WHY</span>
          <span>Why this matters on the tools</span>
        </div>
        <p className="math-body">{module.whyItMatters}</p>
      </div>

      <div className="terminal-card">
        <div className="card-title">
          <span className="icon">CONCEPT</span>
          <span>The idea</span>
        </div>
        {module.concept.split('\n').map((paragraph, index) =>
          paragraph.trim() ? (
            <p key={index} className="math-body">
              {paragraph}
            </p>
          ) : null,
        )}
      </div>

      {module.diagram && (
        <div className="terminal-card">
          <div className="card-title">
            <span className="icon">DIAG</span>
            <span>Picture</span>
          </div>
          <pre className="math-ascii">{module.diagram}</pre>
        </div>
      )}

      {module.tables?.map((table) => (
        <div key={table.title} className="terminal-card">
          <div className="card-title">
            <span className="icon">TABLE</span>
            <span>{table.title}</span>
          </div>
          <table className="terminal-table eighths-table">
            <thead>
              <tr>
                {table.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${row[0]}-${cellIndex}`}
                      style={
                        cellIndex === 1 ? { color: 'var(--text-amber)' } : undefined
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {module.examples.map((example) => (
        <div key={example.title} className="terminal-card math-example">
          <div className="card-title">
            <span className="icon">EX</span>
            <span>{example.title}</span>
          </div>
          <p className="math-problem">{example.problem}</p>
          <ol className="math-steps">
            {example.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="math-answer">Answer: {example.answer}</div>
        </div>
      ))}

      <div className="terminal-card">
        <div className="card-title">
          <span className="icon">KEYS</span>
          <span>Key points</span>
        </div>
        <ul className="terminal-list" style={{ marginLeft: 16 }}>
          {module.keyPoints.map((point) => (
            <li key={point} className="bright">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="terminal-btn amber"
        onClick={() => setQuizOpen(true)}
        disabled={!topic}
      >
        Start quiz ({module.quizQuestions.length})
      </button>

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

export default MathLesson;
