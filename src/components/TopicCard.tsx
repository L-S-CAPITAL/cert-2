import React from 'react';
import { Unit, Topic } from '../types';
import { useProgress, progressStore } from '../stores/progress';
import { scrollToTopOfPanel } from '../scroll';

interface TopicCardProps {
  unit: Unit;
  topic: Topic;
  onComplete: () => void;
  onQuiz: () => void;
  /**
   * When set (and whenever it changes), expand this topic, scroll it into
   * view and focus its title, e.g. from the Dashboard's "Continue" button.
   */
  openRequest?: number | null;
}

const TopicCard: React.FC<TopicCardProps> = ({
  unit,
  topic,
  onComplete,
  onQuiz,
  openRequest = null,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(openRequest !== null);
  const titleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (openRequest === null) return;
    setIsExpanded(true);
    const title = titleRef.current;
    if (!title) return;
    scrollToTopOfPanel(title);
    title.focus({ preventScroll: true });
  }, [openRequest]);
  useProgress();
  const isComplete = progressStore.isTopicComplete(unit.id, topic.id);
  const stop = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <div
      className={`topic-card ${isComplete ? 'completed' : ''}`}
      style={{
        borderLeftColor: isComplete
          ? 'var(--status-ok)'
          : 'var(--text-dim)',
      }}
    >
      <button
        type="button"
        className="topic-title"
        ref={titleRef}
        onClick={(event) => {
          stop(event);
          setIsExpanded((open) => !open);
        }}
        aria-expanded={isExpanded}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              color: isComplete ? 'var(--status-ok)' : 'var(--text-amber)',
            }}
            aria-hidden="true"
          >
            {isComplete ? '[X]' : '[ ]'}
          </span>
          {topic.title}
        </span>
        <span
          className="topic-status"
          style={{
            color: isComplete ? 'var(--status-ok)' : 'var(--text-dim)',
          }}
        >
          {isComplete ? 'DONE' : 'NEW'}
        </span>
      </button>

      {isExpanded && (
        <div className="topic-content" onClick={stop}>
          <div style={{ marginBottom: 8, lineHeight: 1.6 }}>{topic.content}</div>

          {topic.keyPoints && topic.keyPoints.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-heading)',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Key Points
              </div>
              <ul style={{ paddingLeft: 4, listStyle: 'none' }}>
                {topic.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="key-point"
                    style={{
                      color: 'var(--text-secondary)',
                      marginBottom: 3,
                      fontSize: 14,
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="terminal-btn"
              onClick={(event) => {
                stop(event);
                onComplete();
              }}
              style={{
                borderColor: isComplete
                  ? 'var(--status-ok)'
                  : 'var(--border)',
              }}
            >
              {isComplete ? 'Mark incomplete' : 'Mark complete'}
            </button>
            {topic.quizQuestions && topic.quizQuestions.length > 0 && (
              <button
                type="button"
                className="terminal-btn amber"
                onClick={(event) => {
                  stop(event);
                  onQuiz();
                }}
              >
                Start quiz ({topic.quizQuestions.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicCard;
