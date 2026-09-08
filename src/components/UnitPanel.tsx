import React from 'react';
import { Topic, Unit } from '../types';
import { progressStore, useProgress } from '../stores/progress';
import { isUnitUnlocked } from '../data/prerequisites';
import TopicCard from './TopicCard';
import QuizModal from './QuizModal';

interface UnitPanelProps {
  units: Unit[];
  expandedUnits: Record<string, boolean>;
  onToggleUnit: (unitId: string) => void;
  onUnitSelect: (unitId: string | null) => void;
  selectedUnitId: string | null;
}

const UnitPanel: React.FC<UnitPanelProps> = ({
  units,
  expandedUnits,
  onToggleUnit,
  onUnitSelect,
  selectedUnitId,
}) => {
  const progress = useProgress();
  const [quizUnit, setQuizUnit] = React.useState<{
    unit: Unit;
    topic: Topic;
  } | null>(null);

  const core = units.filter((unit) => unit.kind !== 'elective');
  const electives = units.filter((unit) => unit.kind === 'elective');

  const renderGroup = (title: string, group: Unit[]) => (
    <div className="terminal-section">
      <div className="terminal-section-title">
        <span className="icon">{title === 'Core units' ? 'CORE' : 'ELEC'}</span>
        <span>{title}</span>
        <span className="section-count">{group.length} Units</span>
      </div>

      <div className="terminal-list">
        {group.map((unit) => {
          const topics = unit.topics || [];
          const completion = progressStore.getUnitCompletion(unit.id, topics);
          const isExpanded = expandedUnits[unit.id] || false;
          const unlocked = isUnitUnlocked(
            unit,
            units,
            progress.unitCompletions,
          );
          const hasPrerequisites = unit.prerequisites.length > 0;

          return (
            <div
              key={unit.id}
              className={`unit-item ${isExpanded ? 'expanded' : ''} ${
                selectedUnitId === unit.id ? 'selected' : ''
              } ${unlocked ? '' : 'locked'}`}
              style={{
                borderColor:
                  selectedUnitId === unit.id
                    ? 'var(--text-amber)'
                    : 'var(--border-thick)',
              }}
            >
              <button
                type="button"
                className="unit-header"
                onClick={() => {
                  onUnitSelect(unit.id);
                  if (unlocked) onToggleUnit(unit.id);
                }}
                aria-expanded={isExpanded}
                aria-disabled={!unlocked}
              >
                <div className="unit-code">{unit.code}</div>
                <div className="unit-name">{unit.name}</div>
                <div className="unit-progress">
                  <span style={{ color: 'var(--text-amber)' }}>
                    {unlocked ? `${completion}%` : 'LOCKED'}
                  </span>
                </div>
              </button>

              {isExpanded && unlocked && (
                <div className="unit-detail">
                  <div className="detail-row">
                    <span className="detail-label">Prerequisite:</span>
                    <span className="detail-value">
                      {hasPrerequisites
                        ? unit.prerequisites.join(', ')
                        : 'None'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Points:</span>
                    <span className="detail-value">{unit.points} points</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{unit.description}</span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div
                      className="terminal-section-title"
                      style={{ marginBottom: 6 }}
                    >
                      <span className="icon">TOPICS</span>
                      <span>Learning Topics ({topics.length})</span>
                    </div>

                    {topics.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        unit={unit}
                        topic={topic}
                        onComplete={() => {
                          const isComplete = progressStore.isTopicComplete(
                            unit.id,
                            topic.id,
                          );
                          if (isComplete) {
                            progressStore.markTopicIncomplete(
                              unit.id,
                              topic.id,
                            );
                          } else {
                            progressStore.markTopicComplete(
                              unit.id,
                              topic.id,
                            );
                          }
                        }}
                        onQuiz={() => setQuizUnit({ unit, topic })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!unlocked && (
                <div className="unit-detail" style={{ display: 'block' }}>
                  <div className="detail-row">
                    <span className="detail-label">Locked</span>
                    <span className="detail-value">
                      Complete {unit.prerequisites.join(', ')} first
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="unit-panel">
      {renderGroup('Core units', core)}
      {electives.length > 0 && renderGroup('Elective units', electives)}

      {quizUnit && (
        <QuizModal
          unit={quizUnit.unit}
          topic={quizUnit.topic}
          onClose={() => setQuizUnit(null)}
        />
      )}
    </div>
  );
};

export default UnitPanel;
