import React from 'react';
import { COURSE_INFO, ALL_UNITS, CORE_UNITS, ELECTIVE_UNITS } from '../data/course';
import { progressStore, useProgress } from '../stores/progress';

const CourseOverview: React.FC = () => {
  useProgress();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const totalPoints = ALL_UNITS.reduce((sum, u) => sum + u.points, 0);
  const corePoints = CORE_UNITS.reduce((sum, u) => sum + u.points, 0);
  const electivePoints = ELECTIVE_UNITS.reduce((sum, u) => sum + u.points, 0);
  const totalTopics = ALL_UNITS.reduce(
    (sum, u) => sum + (u.topics?.length ?? 0),
    0,
  );
  const overallCompletion = progressStore.getTotalCompletion(ALL_UNITS);

  const detailRow = (label: string, value: string | number) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );

  const exportProgress = () => {
    const blob = new Blob([progressStore.exportProgress()], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'electrotech-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Progress exported');
  };

  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const ok = progressStore.importProgress(text);
      setStatus(ok ? 'Progress imported' : 'Import failed — invalid file');
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetProgress = () => {
    const confirmed = window.confirm(
      'Reset all completions, sessions, and study time? This cannot be undone.',
    );
    if (!confirmed) return;
    progressStore.reset();
    setStatus('Progress reset');
  };

  return (
    <div className="course-overview">
      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">INFO</span>
          <span>Course information</span>
        </div>

        <div className="terminal-card">
          {detailRow('Course Code', COURSE_INFO.code)}
          {detailRow('Course Title', COURSE_INFO.title)}
          {detailRow('Provider', COURSE_INFO.provider)}
          {detailRow('Core points', `${corePoints} points`)}
          {detailRow(
            'Elective points in this terminal',
            `${electivePoints} of ${COURSE_INFO.electivePointsRequired} required`,
          )}
          {detailRow('Points packed', `${totalPoints} points`)}
          {detailRow('Core units', `${COURSE_INFO.unitsCount} units`)}
          {detailRow('Elective units', `${ELECTIVE_UNITS.length} units`)}
          {detailRow('Topics', `${totalTopics} topics`)}
        </div>

        <div className="terminal-card" style={{ marginTop: 12 }}>
          <div className="card-title">
            <span className="icon">DESCRIPTION</span>
            <span>Description</span>
          </div>
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            {COURSE_INFO.overview}
          </div>
        </div>

        <div className="terminal-card" style={{ marginTop: 12 }}>
          <div className="card-title">
            <span className="icon">OUTCOMES</span>
            <span>Career outcomes</span>
          </div>
          <ul className="terminal-list">
            {COURSE_INFO.outcomes.map((outcome) => (
              <li key={outcome} className="bright">
                {outcome}
              </li>
            ))}
          </ul>
        </div>

        <div className="terminal-card" style={{ marginTop: 12 }}>
          <div className="card-title">
            <span className="icon">STAT</span>
            <span>Industry demand</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Job openings (5 years)</span>
            <span className="detail-value">
              ~{COURSE_INFO.expectedJobOpenings} positions
            </span>
          </div>
        </div>
      </div>

      <div className="terminal-section" style={{ marginTop: 16 }}>
        <div className="terminal-section-title">
          <span className="icon">DATA</span>
          <span>Progress data</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="terminal-btn" onClick={exportProgress}>
            Export
          </button>
          <button
            type="button"
            className="terminal-btn"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <button type="button" className="terminal-btn amber" onClick={resetProgress}>
            Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={importProgress}
          />
        </div>
        {status && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-amber)' }}>
            {status}
          </div>
        )}
      </div>

      <div className="terminal-section" style={{ marginTop: 16 }}>
        <div className="terminal-section-title">
          <span className="icon">UNITS</span>
          <span>All unit codes</span>
        </div>

        <table className="terminal-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Unit Code</th>
              <th>Unit Name</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ALL_UNITS.map((unit, i) => {
              const completion = progressStore.getUnitCompletion(
                unit.id,
                unit.topics || [],
              );
              return (
                <tr key={unit.id}>
                  <td style={{ color: 'var(--text-dim)' }}>{i + 1}</td>
                  <td style={{ color: 'var(--text-tertiary)' }}>
                    {unit.kind === 'elective' ? 'Elective' : 'Core'}
                  </td>
                  <td style={{ color: 'var(--text-amber)' }}>{unit.code}</td>
                  <td>{unit.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{unit.points}</td>
                  <td style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {completion}% complete
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="terminal-section-title"
        style={{ marginTop: 16, marginBottom: 8 }}
      >
        <span className="icon">PROGRESS</span>
        <span>Total progress</span>
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${overallCompletion}%` }}
          role="progressbar"
          aria-valuenow={overallCompletion}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Total progress"
        ></div>
        <div className="progress-bar-text">
          {overallCompletion}% COMPLETE ({totalTopics} topics)
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
