import { Unit } from '../types';
import { isUnitComplete } from './prerequisites';

export interface GroupCompletion {
  /** Completed topics as a rounded percentage of the group's topics. */
  percent: number;
  topicsDone: number;
  topicsTotal: number;
  /** Units with every topic complete. */
  unitsDone: number;
  unitsTotal: number;
}

export interface CourseCompletion {
  /** Headline figure: the qualification's core units. */
  core: GroupCompletion;
  /** Electives shipped in this terminal, reported separately. */
  electives: GroupCompletion;
}

function summarizeGroup(
  units: Unit[],
  completions: Record<string, Record<string, boolean>>,
): GroupCompletion {
  let topicsDone = 0;
  let topicsTotal = 0;
  let unitsDone = 0;
  for (const unit of units) {
    const topics = unit.topics ?? [];
    topicsTotal += topics.length;
    for (const topic of topics) {
      if (completions[unit.id]?.[topic.id] === true) topicsDone += 1;
    }
    if (isUnitComplete(unit, completions)) unitsDone += 1;
  }
  return {
    percent: topicsTotal === 0 ? 0 : Math.round((topicsDone / topicsTotal) * 100),
    topicsDone,
    topicsTotal,
    unitsDone,
    unitsTotal: units.length,
  };
}

/**
 * The one definition of course completion used by StatusBar, Dashboard and
 * CourseOverview. "Core progress" is completed topics across the core units
 * (kind !== 'elective'); electives are summarised separately and never
 * folded into the core figure. Pass the course units (ALL_UNITS), not the
 * study strands.
 */
export function summarizeCompletion(
  units: Unit[],
  completions: Record<string, Record<string, boolean>>,
): CourseCompletion {
  return {
    core: summarizeGroup(
      units.filter((unit) => unit.kind !== 'elective'),
      completions,
    ),
    electives: summarizeGroup(
      units.filter((unit) => unit.kind === 'elective'),
      completions,
    ),
  };
}
