import React from 'react';
import { Unit } from '../types';
import { progressStore, useProgress } from '../stores/progress';
import { describeSession, formatSessionDate } from '../data/sessions';
import { summarizeCompletion } from '../data/completion';

interface DashboardProps {
  units: Unit[];
}

const Dashboard: React.FC<DashboardProps> = ({ units }) => {
  const progress = useProgress();
  const { core, electives } = summarizeCompletion(units, progress.unitCompletions);
  const totalTime = progressStore.getFormattedTotalTime();
  const sessionLogs = progressStore.getSessionLogs();

  const statCards = [
    {
      label: 'Core Progress (topics)',
      value: `${core.percent}%`,
      colorClass: 'green',
    },
    {
      label: 'Total Study Time',
      value: totalTime,
      colorClass: '',
    },
    {
      label: 'Core Units Completed',
      value: core.unitsDone,
      total: core.unitsTotal,
      colorClass: 'green',
    },
    {
      label: `Electives (${electives.unitsDone}/${electives.unitsTotal} units)`,
      value: `${electives.percent}%`,
      colorClass: '',
    },
    {
      label: 'Session Count',
      value: sessionLogs.length,
      colorClass: '',
    },
  ];

  return (
    <div className="dashboard">
      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">PROGRESS</span>
          <span>CORE PROGRESS</span>
          <span className="section-count">
            {core.topicsDone} / {core.topicsTotal} CORE TOPICS
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${core.percent}%` }}
            role="progressbar"
            aria-valuenow={core.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Core progress (completed core topics)"
          ></div>
          <div className="progress-bar-text">
            {core.percent}% OF CORE TOPICS
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
          Electives tracked separately: {electives.percent}% ({electives.topicsDone} /{' '}
          {electives.topicsTotal} topics)
        </div>
      </div>

      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">STATS</span>
          <span>QUICK STATISTICS</span>
        </div>

        <div className="stats-grid">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`stat-card ${stat.colorClass}`}
            >
              <div className="stat-value">
                {stat.value}
                {stat.total !== undefined && (
                  <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                    {' '}
                    / {stat.total}
                  </span>
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">UNITS</span>
          <span>UNIT PROGRESS</span>
        </div>

        <table className="terminal-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Unit</th>
              <th>Topics</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => {
              const topics = unit.topics || [];
              const completion = progressStore.getUnitCompletion(
                unit.id,
                topics,
              );
              const completedTopics = topics.filter((t) =>
                progressStore.isTopicComplete(unit.id, t.id),
              ).length;
              const status =
                completion === 100
                  ? 'COMPLETE'
                  : completion > 0
                    ? 'IN PROGRESS'
                    : 'NOT STARTED';
              return (
                <tr key={unit.id}>
                  <td style={{ color: 'var(--text-amber)' }}>{unit.code}</td>
                  <td>{unit.name}</td>
                  <td style={{ color: 'var(--text-dim)' }}>
                    {completedTopics} / {topics.length}
                  </td>
                  <td>
                    <div className="progress-bar-container" style={{ marginBottom: 0, marginTop: 4 }}>
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${completion}%`, height: '12px' }}
                      ></div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: 2 }}>
                      {completion}%
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          status === 'COMPLETE'
                            ? 'var(--text-primary)'
                            : status === 'IN PROGRESS'
                              ? 'var(--text-amber)'
                              : 'var(--text-dim)',
                        fontSize: '10px',
                      }}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sessionLogs.length > 0 && (
        <div className="terminal-section">
          <div className="terminal-section-title">
            <span className="icon">RECENT</span>
            <span>RECENT SESSIONS</span>
          </div>
          <div className="session-log">
            {sessionLogs.slice(0, 5).map((log) => {
              const { unitLabel, topicTitle } = describeSession(log);
              const mins = Math.floor(log.durationSeconds / 60);
              const secs = log.durationSeconds % 60;
              const formatted = `${mins}m ${secs}s`;
              return (
                <div key={log.id} className="session-log-item">
                  <span className="session-unit">
                    {unitLabel}
                    {topicTitle ? ` / ${topicTitle}` : ''}
                  </span>
                  <span className="session-duration">{formatted}</span>
                  <span className="session-date">
                    {formatSessionDate(log.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
