import React from 'react';
import { progressStore, useProgress } from '../stores/progress';
import { ALL_UNITS, findTopic } from '../data/course';
import { MATH_UNIT } from '../data/math';
import { ALGEBRA_UNIT } from '../data/algebra';
import { GEOMETRY_UNIT } from '../data/geometry';
import { BLUEPRINT_UNIT } from '../data/blueprints';

const SessionLog: React.FC = () => {
  useProgress();
  const logs = progressStore.getSessionLogs();

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          const unit = [
            ...ALL_UNITS,
            MATH_UNIT,
            ALGEBRA_UNIT,
            GEOMETRY_UNIT,
            BLUEPRINT_UNIT,
          ].find((item) => item.id === log.unitId);
          const topic = log.topicId
            ? findTopic(log.unitId, log.topicId)
            : undefined;
          return (
            <div key={log.id} className="session-log-item">
              <span className="session-unit">
                {unit?.code ?? log.unitId}
                {topic ? ` / ${topic.title}` : ''}
              </span>
              <span className="session-duration">
                {formatDuration(log.durationSeconds)}
              </span>
              <span className="session-date">{formatDate(log.timestamp)}</span>
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
