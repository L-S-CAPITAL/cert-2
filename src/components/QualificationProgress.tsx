import React from 'react';
import { Unit } from '../types';
import {
  QUALIFICATION_RULES,
  qualificationProgress,
  stillNeededSummary,
} from '../data/qualification';

interface QualificationProgressProps {
  units: Unit[];
  completions: Record<string, Record<string, boolean>>;
  /** Completed core topics as a % (the StatusBar's CORE PROGRESS figure). */
  coreTopicsPercent: number;
}

const percentOf = (value: number, total: number) =>
  total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));

function Bar({
  label,
  value,
  total,
  text,
  valueText,
}: {
  label: string;
  value: number;
  total: number;
  text: string;
  valueText: string;
}) {
  const percent = percentOf(value, total);
  return (
    <div className="qual-row">
      <div className="qual-row-name">{label}</div>
      <div
        className="progress-bar-container qual-bar"
        role="progressbar"
        aria-label={`${label} toward ${QUALIFICATION_RULES.code}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={value}
        aria-valuetext={valueText}
      >
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-row-label qual-row-label">{text}</div>
    </div>
  );
}

/**
 * Core and elective progress toward the real UEE22020 packaging rules
 * (see src/data/qualification.ts for the source and the rules themselves).
 */
const QualificationProgress: React.FC<QualificationProgressProps> = ({
  units,
  completions,
  coreTopicsPercent,
}) => {
  const progress = qualificationProgress(units, completions);
  const { core, electives } = progress;
  const rules = QUALIFICATION_RULES;
  const notListed = electives.notListed.map((unit) => unit.code);

  return (
    <section className="terminal-section qualification-progress" aria-labelledby="qual-title">
      <div className="terminal-section-title" id="qual-title">
        <span className="icon">PROGRESS</span>
        <span>{rules.code} qualification</span>
        <span className="section-count">
          {core.pointsDone + electives.pointsCounted} / {rules.totalPoints} pts
        </span>
      </div>

      <Bar
        label="Core"
        value={core.unitsDone}
        total={core.unitsRequired}
        text={`${core.unitsDone} / ${core.unitsRequired} units`}
        valueText={`${core.unitsDone} of ${core.unitsRequired} core units, ${core.pointsDone} of ${core.pointsRequired} core points`}
      />
      <div className="dashboard-note qual-detail">
        {core.pointsDone} / {core.pointsRequired} core pts · {coreTopicsPercent}% of core topics
        done
      </div>

      <Bar
        label="Electives"
        value={electives.pointsCounted}
        total={electives.pointsRequired}
        text={`${electives.pointsCounted} / ${electives.pointsRequired} pts`}
        valueText={`${electives.pointsCounted} of ${electives.pointsRequired} elective points`}
      />
      <div className="dashboard-note qual-detail">
        Group A {electives.groupACounted} pts (max {electives.groupAMax}) · Group B{' '}
        {electives.groupBPoints} pts (min {electives.groupBMin})
      </div>

      <div className="qual-needed">{stillNeededSummary(progress)}</div>
      <div className="dashboard-note qual-caveat">
        Electives in this terminal can cover {electives.pointsAvailableInApp} of the{' '}
        {electives.pointsRequired} elective points; choose the rest with your RTO.
        {notListed.length > 0 &&
          ` ${notListed.join(' and ')} ${
            notListed.length === 1 ? 'is' : 'are'
          } not on the ${rules.code} elective lists, so ${
            notListed.length === 1 ? 'it is' : 'they are'
          } not counted.`}{' '}
        Rules: {rules.code} release {rules.release}, training.gov.au (superseded by{' '}
        {rules.supersededBy.code} on 24 Nov 2025; check which one you are enrolled in).
      </div>
    </section>
  );
};

export default QualificationProgress;
