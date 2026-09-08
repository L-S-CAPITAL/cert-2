import React from 'react';
import { Unit } from '../types';
import { progressStore, useProgress } from '../stores/progress';

interface TimeTrackerProps {
  selectedUnitId: string | null;
  onUnitSelect: (unitId: string | null) => void;
  units: Unit[];
}

const TimeTracker: React.FC<TimeTrackerProps> = ({
  selectedUnitId,
  onUnitSelect,
  units,
}) => {
  const progress = useProgress();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = progress.startTime !== null;
  const activeUnit = units.find((unit) => unit.id === progress.activeUnitId);
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);
  const activeTopic = activeUnit?.topics.find(
    (topic) => topic.id === progress.activeTopicId,
  );

  const handleStartStop = () => {
    if (isActive) {
      progressStore.stopSession();
    } else if (selectedUnitId) {
      progressStore.startSession(selectedUnitId);
    }
  };

  const handleStartTopic = (topicId: string) => {
    if (selectedUnitId) {
      progressStore.startTopicSession(selectedUnitId, topicId);
    }
  };

  return (
    <div className="time-tracker">
      <div style={{ marginBottom: 12, width: '100%' }}>
        <label className="terminal-section-title" htmlFor="unit-select">
          <span className="icon">SELECT</span>
          <span>Unit</span>
        </label>
        <select
          id="unit-select"
          className="terminal-select"
          value={selectedUnitId ?? ''}
          disabled={isActive}
          onChange={(e) => onUnitSelect(e.target.value || null)}
        >
          <option value="">-- SELECT UNIT --</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.code} - {unit.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className="timer-display"
        style={{
          color: isActive ? 'var(--text-amber)' : 'var(--text-tertiary)',
        }}
        aria-live="polite"
      >
        {progressStore.getFormattedActiveTime()}
      </div>

      <button
        type="button"
        className={`terminal-btn ${isActive ? '' : 'amber'}`}
        onClick={handleStartStop}
        disabled={!selectedUnitId && !isActive}
      >
        {isActive ? 'Stop' : 'Start'}
      </button>

      {isActive && activeUnit && (
        <div style={{ fontSize: 10, color: 'var(--text-dim)', width: '100%' }}>
          Timer active for: {activeUnit.code}
          {activeTopic ? ` / ${activeTopic.title}` : ''}
        </div>
      )}

      {selectedUnit && (
        <div style={{ marginTop: 12, width: '100%' }}>
          <div
            className="terminal-section-title"
            style={{ marginBottom: 6, fontSize: 10 }}
          >
            <span className="icon">TOPICS</span>
            <span>Quick start: {selectedUnit.topics?.length ?? 0} topics</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {selectedUnit.topics?.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className="terminal-btn"
                onClick={() => handleStartTopic(topic.id)}
                style={{ fontSize: 10, padding: '2px 8px' }}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="terminal-section-title"
        style={{ marginTop: 12, marginBottom: 6, fontSize: 10 }}
      >
        <span className="icon">TOTAL</span>
        <span>Logged time</span>
      </div>
      <div
        className="timer-display"
        style={{ color: 'var(--text-primary)', fontSize: 14 }}
      >
        {progressStore.getFormattedTotalTime()}
      </div>
    </div>
  );
};

export default TimeTracker;
