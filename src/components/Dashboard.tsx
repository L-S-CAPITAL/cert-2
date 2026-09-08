import React from 'react';
import { Unit } from '../types';
import { progressStore, useProgress } from '../stores/progress';

interface DashboardProps {
  units: Unit[];
}

const Dashboard: React.FC<DashboardProps> = ({ units }) => {
  useProgress();
  const totalCompletion = progressStore.getTotalCompletion(units);
  const totalTime = progressStore.getFormattedTotalTime();
  const sessionLogs = progressStore.getSessionLogs();

  const statCards = [
    {
      label: 'Overall Completion',
      value: `${totalCompletion}%`,
      colorClass: 'green',
    },
    {
      label: 'Total Study Time',
      value: totalTime,
      colorClass: '',
    },
    {
      label: 'Units Completed',
      value: units.filter((u) => {
        const completion = progressStore.getUnitCompletion(u.id, u.topics || []);
        return completion === 100;
      }).length,
      total: units.length,
      colorClass: 'green',
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
          <span>OVERALL PROGRESS</span>
          <span className="section-count">
            {totalCompletion}% COMPLETE
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${totalCompletion}%` }}
            role="progressbar"
            aria-valuenow={totalCompletion}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall completion"
          ></div>
          <div className="progress-bar-text">
            {totalCompletion}% COMPLETE
          </div>
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
              const unit = units.find((u) => u.id === log.unitId);
              const mins = Math.floor(log.durationSeconds / 60);
              const secs = log.durationSeconds % 60;
              const formatted = `${mins}m ${secs}s`;
              const date = new Date(log.timestamp);
              const dateStr = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <div key={log.id} className="session-log-item">
                  <span className="session-unit">
                    {unit?.code || 'Unknown'}
                  </span>
                  <span className="session-duration">{formatted}</span>
                  <span className="session-date">{dateStr}</span>
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
