import React from 'react';
import { Unit } from '../types';
import { useProgress } from '../stores/progress';
import { describeSession, formatSessionDate } from '../data/sessions';
import { summarizeCompletion } from '../data/completion';
import StudyChart from './StudyChart';
import {
  ContinueReason,
  UnitRow,
  averageQuizScore,
  dayStreak,
  quizPercent,
  formatStudyDuration,
  groupUnits,
  pickContinueTarget,
  weeklyStudyTime,
} from '../data/dashboard';

interface DashboardProps {
  units: Unit[];
  /** Unit picked in the timer / Units tab (used to resume studying). */
  selectedUnitId?: string | null;
  /** Open a unit (and optionally one of its topics) in the Units tab. */
  onOpenUnit?: (unitId: string, topicId?: string | null) => void;
}

const REASON_LABEL: Record<ContinueReason, string> = {
  timer: 'Resume timed unit',
  selected: 'Resume selected unit',
  'last-studied': 'Resume last studied',
  'in-progress': 'Pick up where you left off',
  'not-started': 'Up next',
};

const STATUS_LABEL: Record<UnitRow['status'], string> = {
  'in-progress': 'IN PROGRESS',
  'not-started': 'NOT STARTED',
  complete: 'COMPLETE',
};

const STATUS_COLOR: Record<UnitRow['status'], string> = {
  'in-progress': 'var(--text-amber)',
  'not-started': 'var(--text-dim)',
  complete: 'var(--text-primary)',
};

function UnitTable({
  rows,
  onOpenUnit,
  caption,
}: {
  rows: UnitRow[];
  onOpenUnit?: DashboardProps['onOpenUnit'];
  caption: string;
}) {
  return (
    <table className="terminal-table unit-progress-table">
      <caption className="visually-hidden">{caption}</caption>
      <colgroup>
        <col className="col-code" />
        <col />
        <col className="col-progress" />
        <col className="col-status" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">Code</th>
          <th scope="col">Unit</th>
          <th scope="col">Topics</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const locked = row.status === 'not-started' && !row.unlocked;
          const open = () => onOpenUnit?.(row.unit.id);
          return (
            // The row is a mouse convenience; keyboard and screen-reader users
            // get the real <button> in the unit cell (Enter / Space).
            <tr key={row.unit.id} className="unit-row" onClick={open}>
              <td className="unit-row-code">{row.unit.code}</td>
              <td>
                <button
                  type="button"
                  className="row-link"
                  aria-label={`Open unit ${row.unit.code}: ${row.unit.name}`}
                >
                  {row.unit.name}
                </button>
              </td>
              <td>
                <div
                  className="progress-bar-container unit-topics-bar"
                  role="progressbar"
                  aria-valuenow={row.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuetext={`${row.topicsDone} of ${row.topicsTotal} topics`}
                  aria-label={`${row.unit.code} topics complete`}
                >
                  <div className="progress-bar-fill" style={{ width: `${row.percent}%` }} />
                  <div className="progress-bar-text">
                    {row.topicsDone} / {row.topicsTotal}
                  </div>
                </div>
              </td>
              <td>
                <span
                  className="unit-status"
                  style={{ color: locked ? 'var(--text-dim)' : STATUS_COLOR[row.status] }}
                  title={locked ? `Complete ${row.unit.prerequisites.join(', ')} first` : undefined}
                >
                  {locked ? 'LOCKED' : STATUS_LABEL[row.status]}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ units, selectedUnitId = null, onOpenUnit }) => {
  const progress = useProgress();
  const completions = progress.unitCompletions;
  const { core, electives } = summarizeCompletion(units, completions);
  const sessionLogs = progress.sessionLogs;
  const timerRunning = progress.startTime !== null;

  const target = pickContinueTarget({
    units,
    completions,
    activeUnitId: timerRunning ? progress.activeUnitId : null,
    activeTopicId: timerRunning ? progress.activeTopicId : null,
    selectedUnitId,
    sessionLogs,
  });

  const now = new Date();
  const week = weeklyStudyTime(sessionLogs, now);
  const streak = dayStreak(sessionLogs, now);
  const weekDelta = week.thisWeekSeconds - week.lastWeekSeconds;
  const grouped = groupUnits(units, completions);
  const quizAttempts = progress.quizAttempts;
  const quizAverage = averageQuizScore(quizAttempts);
  const activeRows = [...grouped.inProgress, ...grouped.notStarted];

  const statCards: { label: string; value: string; detail: string; colorClass?: string }[] = [
    {
      label: 'Study time this week',
      value: formatStudyDuration(week.thisWeekSeconds),
      detail:
        week.thisWeekSeconds === 0 && week.lastWeekSeconds === 0
          ? 'no sessions logged in the last 2 weeks'
          : `vs ${formatStudyDuration(week.lastWeekSeconds)} last week (${
              weekDelta >= 0 ? '+' : '-'
            }${formatStudyDuration(Math.abs(weekDelta))})`,
    },
    {
      label: 'Day streak',
      value: `${streak.days} ${streak.days === 1 ? 'day' : 'days'}`,
      detail:
        streak.daysSinceLastSession === null
          ? 'no sessions yet'
          : streak.daysSinceLastSession === 0
            ? 'studied today'
            : streak.daysSinceLastSession === 1
              ? 'last session yesterday: study today to keep it'
              : `last session ${streak.daysSinceLastSession} days ago`,
      colorClass: streak.days > 0 ? 'green' : undefined,
    },
    {
      // From saved attempts only (recorded since quiz history was added);
      // every attempt counts equally.
      label: 'Average quiz score',
      value: quizAverage ? `${quizAverage.percent}%` : '—',
      detail: quizAverage
        ? `across ${quizAverage.attempts} ${quizAverage.attempts === 1 ? 'attempt' : 'attempts'}`
        : 'no quizzes taken yet',
      colorClass: quizAverage ? 'green' : undefined,
    },
    {
      label: 'Topics left: next unit',
      value: target.kind === 'unit' ? String(target.topicsLeft) : '0',
      detail:
        target.kind === 'unit'
          ? `to finish ${target.unit.code}`
          : target.kind === 'all-complete'
            ? 'every unit is complete'
            : 'no unlocked unit to study',
      colorClass: 'green',
    },
  ];

  return (
    <div className="dashboard">
      <section className="terminal-section continue-card" aria-labelledby="continue-title">
        <div className="terminal-section-title" id="continue-title">
          <span className="icon">NEXT</span>
          <span>Continue studying</span>
        </div>
        {target.kind === 'unit' && (
          <div className="continue-body">
            <div className="continue-text">
              <div className="continue-reason">{REASON_LABEL[target.reason]}</div>
              <div className="continue-unit" title={`${target.unit.code} - ${target.unit.name}`}>
                <span className="continue-code">{target.unit.code}</span> {target.unit.name}
              </div>
              <div className="continue-topic">
                Next topic {target.topicNumber} of {target.unit.topics.length}:{' '}
                <span className="continue-topic-title">{target.topic.title}</span>
              </div>
            </div>
            <button
              type="button"
              className="terminal-btn amber continue-btn"
              onClick={() => onOpenUnit?.(target.unit.id, target.topic.id)}
            >
              Continue ▶
            </button>
          </div>
        )}
        {target.kind === 'all-complete' && (
          <div className="continue-body">
            <div className="continue-text">
              <div className="continue-unit">
                All {target.unitsTotal} units complete. Nice work.
              </div>
              <div className="continue-topic">
                Revisit any unit from the table below, or keep your skills sharp in the strand tabs.
              </div>
            </div>
          </div>
        )}
        {target.kind === 'none' && (
          <div className="continue-body">
            <div className="continue-text">
              <div className="continue-topic">
                The remaining units are locked. Check their prerequisites in the Units tab.
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">PROGRESS</span>
          <span>Core progress</span>
          <span className="section-count">
            {core.unitsDone} / {core.unitsTotal} core units · {core.topicsDone} /{' '}
            {core.topicsTotal} topics
          </span>
        </div>

        <div className="progress-row">
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
          </div>
          <div className="progress-row-label">{core.percent}% complete</div>
        </div>
        <div className="dashboard-note">
          Electives tracked separately: {electives.percent}% ({electives.topicsDone} /{' '}
          {electives.topicsTotal} topics, {electives.unitsDone} / {electives.unitsTotal} units)
        </div>
      </div>

      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">STATS</span>
          <span>Quick statistics</span>
        </div>

        <div className="stats-grid">
          {statCards.map((stat) => (
            <div key={stat.label} className={`stat-card ${stat.colorClass ?? ''}`}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-detail">{stat.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-panels">
        <StudyChart sessionLogs={sessionLogs} now={now} />

        <section className="terminal-section recent-quizzes" aria-labelledby="recent-quizzes-title">
          <div className="terminal-section-title" id="recent-quizzes-title">
            <span className="icon">QUIZ</span>
            <span>Recent quiz results</span>
            {quizAttempts.length > 0 && (
              <span className="section-count">{quizAttempts.length} saved</span>
            )}
          </div>
          {quizAttempts.length === 0 ? (
            <div className="dashboard-note quiz-empty">
              No quiz results yet. Finish a topic quiz in the Units tab and your score shows up
              here.
            </div>
          ) : (
            <ol className="quiz-results">
              {quizAttempts.slice(0, 5).map((attempt) => {
                const { unitLabel, topicTitle } = describeSession(attempt);
                const percent = quizPercent(attempt);
                return (
                  <li key={attempt.id} className="quiz-result">
                    <span className="quiz-topic" title={`${unitLabel} / ${topicTitle ?? attempt.topicId}`}>
                      <span className="quiz-unit">{unitLabel}</span> {topicTitle ?? attempt.topicId}
                    </span>
                    <span
                      className={`quiz-score${attempt.score === attempt.total ? ' perfect' : ''}`}
                    >
                      {attempt.score} / {attempt.total} ({percent}%)
                    </span>
                    <span className="quiz-date">{formatSessionDate(attempt.timestamp)}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>

      <div className="terminal-section">
        <div className="terminal-section-title">
          <span className="icon">UNITS</span>
          <span>Unit progress</span>
          <span className="section-count">
            {grouped.inProgress.length} in progress · {grouped.notStarted.length} not started
          </span>
        </div>

        {activeRows.length > 0 ? (
          <UnitTable rows={activeRows} onOpenUnit={onOpenUnit} caption="Units in progress and not started" />
        ) : (
          <div className="dashboard-note">Every unit is complete.</div>
        )}

        {grouped.completed.length > 0 && (
          <details className="completed-units">
            <summary>Completed ({grouped.completed.length})</summary>
            <UnitTable rows={grouped.completed} onOpenUnit={onOpenUnit} caption="Completed units" />
          </details>
        )}
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
