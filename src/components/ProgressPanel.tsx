import React from 'react';
import { COURSE_INFO, ALL_UNITS } from '../data/course';
import { progressStore, useProgress } from '../stores/progress';
import { summarizeCompletion } from '../data/completion';
import {
  QUALIFICATION_RULES,
  electiveGroup,
  qualificationProgress,
  stillNeededSummary,
} from '../data/qualification';

const percentOf = (value: number, total: number) =>
  total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));

const ProgressPanel: React.FC = () => {
  const progress = useProgress();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const { electives } = summarizeCompletion(ALL_UNITS, progress.unitCompletions);
  const qual = qualificationProgress(ALL_UNITS, progress.unitCompletions);

  const exportProgress = () => {
    const blob = new Blob([progressStore.exportProgress()], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'electrotech-progress.json';
    link.click();
    // Revoke on the next task: revoking synchronously can cancel the
    // download before the browser has started reading the blob.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
    <div className="progress-panel">
      <div className="terminal-section">
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
                    {unit.kind === 'elective'
                      ? `Elective${electiveGroup(unit.code) ? ` (${electiveGroup(unit.code)!.group})` : ''}`
                      : 'Core'}
                  </td>
                  <td style={{ color: 'var(--text-amber)' }}>{unit.code}</td>
                  <td>{unit.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{unit.points}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {completion}% of topics
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
        <span className="icon">CORE</span>
        <span>Core units</span>
        <span className="section-count">
          {qual.core.pointsDone} / {qual.core.pointsRequired} core points
        </span>
      </div>
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={qual.core.unitsDone}
        aria-valuemin={0}
        aria-valuemax={qual.core.unitsRequired}
        aria-valuetext={`${qual.core.unitsDone} of ${qual.core.unitsRequired} core units, ${qual.core.pointsDone} of ${qual.core.pointsRequired} core points`}
        aria-label={`Core toward ${COURSE_INFO.code}`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${percentOf(qual.core.unitsDone, qual.core.unitsRequired)}%` }}
        ></div>
        <div className="progress-bar-text">
          {qual.core.unitsDone} / {qual.core.unitsRequired} CORE UNITS
        </div>
      </div>

      <div
        className="terminal-section-title"
        style={{ marginTop: 12, marginBottom: 8 }}
      >
        <span className="icon">ELEC</span>
        <span>Elective points</span>
        <span className="section-count">
          {electives.unitsDone} / {electives.unitsTotal} elective units complete
        </span>
      </div>
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={qual.electives.pointsCounted}
        aria-valuemin={0}
        aria-valuemax={qual.electives.pointsRequired}
        aria-valuetext={`${qual.electives.pointsCounted} of ${qual.electives.pointsRequired} elective points`}
        aria-label={`Electives toward ${COURSE_INFO.code}`}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentOf(qual.electives.pointsCounted, qual.electives.pointsRequired)}%`,
          }}
        ></div>
        <div className="progress-bar-text">
          {qual.electives.pointsCounted} / {qual.electives.pointsRequired} ELECTIVE POINTS
        </div>
      </div>
      <div className="dashboard-note" style={{ marginTop: 6 }}>
        {stillNeededSummary(qual)} Figures use the official {COURSE_INFO.code} weighting
        points (release {QUALIFICATION_RULES.release}, training.gov.au).
      </div>
    </div>
  );
};

export default ProgressPanel;
