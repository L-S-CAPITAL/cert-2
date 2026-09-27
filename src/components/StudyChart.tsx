import React from 'react';
import { SessionLog } from '../types';
import { dailyStudyTime, formatStudyDuration } from '../data/dashboard';

interface StudyChartProps {
  sessionLogs: SessionLog[];
  /** Defaults to the current time; injectable for tests. */
  now?: Date;
  days?: number;
}

const dayLabel = (date: Date) =>
  date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });

/** "0 min", "<1 min", "12 min" */
export function minutesLabel(seconds: number): string {
  if (seconds <= 0) return '0 min';
  if (seconds < 30) return '<1 min';
  return `${Math.round(seconds / 60)} min`;
}

/**
 * Minutes studied per local day for the last two weeks, as plain CSS bars.
 * Screen readers get a one-sentence summary (role="img") plus a
 * visually hidden table with every day's figure.
 */
const StudyChart: React.FC<StudyChartProps> = ({ sessionLogs, now = new Date(), days = 14 }) => {
  const buckets = dailyStudyTime(sessionLogs, now, days);
  const totalSeconds = buckets.reduce((sum, day) => sum + day.seconds, 0);
  const activeDays = buckets.filter((day) => day.seconds > 0).length;
  const peak = buckets.reduce((best, day) => (day.seconds > best.seconds ? day : best), buckets[0]);
  const maxSeconds = Math.max(peak?.seconds ?? 0, 1);
  const range = `${dayLabel(buckets[0].date)} to ${dayLabel(buckets[buckets.length - 1].date)}`;

  const summary =
    totalSeconds === 0
      ? `Study time per day, ${range}: nothing logged in the last ${days} days.`
      : `Study time per day, ${range}: ${formatStudyDuration(totalSeconds)} in total over ${activeDays} ${
          activeDays === 1 ? 'day' : 'days'
        }; most on ${dayLabel(peak.date)} with ${minutesLabel(peak.seconds)}.`;

  return (
    <section className="terminal-section study-chart-section" aria-labelledby="study-chart-title">
      <div className="terminal-section-title" id="study-chart-title">
        <span className="icon">CHART</span>
        <span>Study · {days} days</span>
        <span className="section-count">
          {totalSeconds === 0
            ? 'no sessions'
            : `${formatStudyDuration(totalSeconds)} · peak ${minutesLabel(peak.seconds)}`}
        </span>
      </div>

      <div className="study-chart" role="img" aria-label={summary}>
        <div className="study-chart-bars">
          {buckets.map((day, index) => {
            const isToday = index === buckets.length - 1;
            const height = day.seconds > 0 ? Math.max(4, (day.seconds / maxSeconds) * 100) : 0;
            return (
              <div
                key={day.date.getTime()}
                className={`study-chart-col${isToday ? ' today' : ''}${
                  day.seconds > 0 ? '' : ' empty'
                }`}
                title={`${dayLabel(day.date)}: ${minutesLabel(day.seconds)}`}
              >
                <div className="study-chart-bar" style={{ height: `${height}%` }} />
              </div>
            );
          })}
        </div>
        <div className="study-chart-labels" aria-hidden="true">
          {buckets.map((day, index) => (
            <span
              key={day.date.getTime()}
              className={index === buckets.length - 1 ? 'today' : undefined}
            >
              {day.date.getDate()}
            </span>
          ))}
        </div>
      </div>

      <table className="visually-hidden">
        <caption>Minutes studied per day, last {days} days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Study time</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((day) => (
            <tr key={day.date.getTime()}>
              <th scope="row">{dayLabel(day.date)}</th>
              <td>{minutesLabel(day.seconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default StudyChart;
