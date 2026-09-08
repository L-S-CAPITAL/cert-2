import React from 'react';
import { progressStore, useProgress } from '../stores/progress';
import { ALL_UNITS, CORE_UNITS, COURSE_INFO } from '../data/course';

const StatusBar: React.FC = () => {
  const progress = useProgress();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalCompletion = progressStore.getTotalCompletion(ALL_UNITS);
  const totalTime = progressStore.getFormattedTotalTime();
  const isTimerActive = progress.startTime !== null;
  const timerDisplay = progressStore.getFormattedActiveTime();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const totalSessions = progress.sessionLogs.length;
  const unitsComplete = CORE_UNITS.filter((u) => {
    const completion = progressStore.getUnitCompletion(u.id, u.topics || []);
    return completion === 100;
  }).length;

  return (
    <footer className="status-bar">
      <div className="status-bar-left">
        <div className="status-bar-item">
          <span className="label">COURSE</span>
          <span className="value">{COURSE_INFO.code}</span>
        </div>

        <div className="status-bar-item">
          <span className="label">COMPLETION</span>
          <span className="value">{totalCompletion}%</span>
        </div>

        <div className="status-bar-item">
          <span className="label">TIME</span>
          <span className="value">
            {isTimerActive ? timerDisplay : '--:--:--'}
          </span>
          {isTimerActive && (
            <span
              className="timer-live-dot"
              aria-hidden="true"
            ></span>
          )}
        </div>

        <div className="status-bar-item">
          <span className="label">TOTAL STUDY</span>
          <span className="value">{totalTime}</span>
        </div>

        <div className="status-bar-item">
          <span className="label">CORE DONE</span>
          <span className="value">
            {unitsComplete}/{COURSE_INFO.unitsCount}
          </span>
        </div>

        <div className="status-bar-item">
          <span className="label">SESSIONS</span>
          <span className="value">{totalSessions}</span>
        </div>
      </div>

      <div className="status-bar-right">
        <div className="status-bar-item connection-status">
          <span
            className={`connection-light ${isTimerActive ? '' : 'off'}`}
          ></span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
            {isTimerActive ? 'TIMER ACTIVE' : 'TIMER IDLE'}
          </span>
        </div>

        <div className="status-bar-item">
          <span className="label">{timeStr}</span>
        </div>

        <div className="status-bar-item">
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>[READY]</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
