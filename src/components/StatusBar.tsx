import React from 'react';
import { progressStore, useProgress } from '../stores/progress';
import { ALL_UNITS, COURSE_INFO } from '../data/course';
import { qualificationProgress } from '../data/qualification';

const StatusBar: React.FC = () => {
  const progress = useProgress();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Same official figures as the Dashboard and Course Overview.
  const { core, electives } = qualificationProgress(ALL_UNITS, progress.unitCompletions);
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

  return (
    <footer className="status-bar">
      <div className="status-bar-left">
        <div className="status-bar-item">
          <span className="label">COURSE</span>
          <span className="value">{COURSE_INFO.code}</span>
        </div>

        <div
          className="status-bar-item"
          title={`Weighting points from completed units, of ${COURSE_INFO.totalPoints} required`}
        >
          <span className="label">POINTS</span>
          <span className="value">
            {core.pointsDone + electives.pointsCounted}/{COURSE_INFO.totalPoints}
          </span>
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
          <span className="label">CORE UNITS</span>
          <span className="value">
            {core.unitsDone}/{core.unitsRequired}
          </span>
        </div>

        <div className="status-bar-item" title="Elective weighting points from completed units">
          <span className="label">ELECTIVE PTS</span>
          <span className="value">
            {electives.pointsCounted}/{electives.pointsRequired}
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
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {isTimerActive ? 'TIMER ACTIVE' : 'TIMER IDLE'}
          </span>
        </div>

        <div className="status-bar-item">
          <span className="label">{timeStr}</span>
        </div>

        <div className="status-bar-item">
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>[READY]</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
