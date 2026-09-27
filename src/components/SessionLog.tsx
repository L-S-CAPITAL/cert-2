import React from 'react';
import { progressStore, useProgress } from '../stores/progress';
import { describeSession, formatSessionDate } from '../data/sessions';

const SessionLog: React.FC = () => {
  useProgress();
  const logs = progressStore.getSessionLogs();

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const totalSessionTime = logs.reduce(
    (sum, log) => sum + log.durationSeconds,
    0,
  );

  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">[ No sessions yet ]</div>
        <div style={{ color: 'var(--text-tertiary)' }}>
          Start a study session to track your time.
        </div>
      </div>
    );
  }

  return (
    <div className="session-log-view">
      <div className="terminal-section-title" style={{ marginBottom: 12 }}>
        <span className="icon">ALL</span>
        <span>Session history</span>
        <span className="section-count">{logs.length} Sessions</span>
      </div>

      <div className="session-log">
        {logs.map((log) => {
          const { unitLabel, topicTitle } = describeSession(log);
          return (
            <div key={log.id} className="session-log-item">
              <span className="session-unit">
                {unitLabel}
                {topicTitle ? ` / ${topicTitle}` : ''}
              </span>
              <span className="session-duration">
                {formatDuration(log.durationSeconds)}
              </span>
              <span className="session-date">{formatSessionDate(log.timestamp)}</span>
            </div>
          );
        })}
      </div>

      <div
        className="terminal-section-title"
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        <span className="icon">TOTAL</span>
        <span>Tracked study time</span>
      </div>
      <div
        className="timer-display"
        style={{ color: 'var(--text-primary)', fontSize: 20 }}
      >
        {formatDuration(totalSessionTime)}
      </div>
    </div>
  );
};

export default SessionLog;
