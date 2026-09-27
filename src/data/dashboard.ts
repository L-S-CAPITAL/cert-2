import { SessionLog, Topic, Unit } from '../types';
import { isUnitComplete, isUnitUnlocked } from './prerequisites';

type Completions = Record<string, Record<string, boolean>>;

const DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* Study time: this week vs last week                                  */
/* ------------------------------------------------------------------ */

/** Local midnight at the start of the (Monday-first) week containing `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

export interface WeeklyStudyTime {
  thisWeekSeconds: number;
  lastWeekSeconds: number;
}

/**
 * Logged study time in the current and previous calendar week (Monday to
 * Sunday, local time). A session counts toward the week in which it was
 * logged, i.e. when it was stopped (SessionLog.timestamp). Logs with an
 * unreadable timestamp are ignored.
 */
export function weeklyStudyTime(logs: SessionLog[], now: Date = new Date()): WeeklyStudyTime {
  const thisWeek = startOfWeek(now);
  const nextWeek = new Date(thisWeek);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const lastWeek = new Date(thisWeek);
  lastWeek.setDate(lastWeek.getDate() - 7);

  let thisWeekSeconds = 0;
  let lastWeekSeconds = 0;
  for (const log of logs) {
    const at = new Date(log.timestamp).getTime();
    if (Number.isNaN(at)) continue;
    if (at >= thisWeek.getTime() && at < nextWeek.getTime()) {
      thisWeekSeconds += log.durationSeconds;
    } else if (at >= lastWeek.getTime() && at < thisWeek.getTime()) {
      lastWeekSeconds += log.durationSeconds;
    }
  }
  return { thisWeekSeconds, lastWeekSeconds };
}

/* ------------------------------------------------------------------ */
/* Day streak                                                          */
/* ------------------------------------------------------------------ */

function localDayNumber(date: Date): number {
  // Days since the epoch for the *local* calendar date (DST-safe: built from
  // the local Y/M/D, then measured in UTC).
  return Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );
}

export interface DayStreak {
  /** Consecutive calendar days with at least one logged session. */
  days: number;
  /** Whole days since the most recent session (0 = today), or null if none. */
  daysSinceLastSession: number | null;
}

/**
 * Current streak of consecutive local calendar days with a logged session.
 * The streak is still alive if the last session was yesterday (today is not
 * over yet); after a full day with no session it drops to 0.
 */
export function dayStreak(logs: SessionLog[], now: Date = new Date()): DayStreak {
  const days = new Set<number>();
  for (const log of logs) {
    const at = new Date(log.timestamp);
    if (Number.isNaN(at.getTime())) continue;
    days.add(localDayNumber(at));
  }
  if (days.size === 0) return { days: 0, daysSinceLastSession: null };

  const today = localDayNumber(now);
  const latest = Math.max(...Array.from(days).filter((day) => day <= today), -Infinity);
  if (latest === -Infinity) return { days: 0, daysSinceLastSession: null };

  const daysSinceLastSession = today - latest;
  if (daysSinceLastSession > 1) return { days: 0, daysSinceLastSession };

  let streak = 0;
  for (let day = latest; days.has(day); day -= 1) streak += 1;
  return { days: streak, daysSinceLastSession };
}

/** Compact duration for stat cards: "0m", "4m 33s", "1h 05m". */
export function formatStudyDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  if (minutes > 0) return rest > 0 ? `${minutes}m ${rest}s` : `${minutes}m`;
  return rest > 0 ? `${rest}s` : '0m';
}

/* ------------------------------------------------------------------ */
/* Unit table grouping                                                  */
/* ------------------------------------------------------------------ */

export type UnitStatus = 'in-progress' | 'not-started' | 'complete';

export interface UnitRow {
  unit: Unit;
  topicsDone: number;
  topicsTotal: number;
  percent: number;
  status: UnitStatus;
  unlocked: boolean;
}

export function unitRow(unit: Unit, allUnits: Unit[], completions: Completions): UnitRow {
  const topics = unit.topics ?? [];
  const topicsDone = topics.filter((topic) => completions[unit.id]?.[topic.id] === true).length;
  const topicsTotal = topics.length;
  const status: UnitStatus = isUnitComplete(unit, completions)
    ? 'complete'
    : topicsDone > 0
      ? 'in-progress'
      : 'not-started';
  return {
    unit,
    topicsDone,
    topicsTotal,
    percent: topicsTotal === 0 ? 0 : Math.round((topicsDone / topicsTotal) * 100),
    status,
    unlocked: isUnitUnlocked(unit, allUnits, completions),
  };
}

export interface GroupedUnits {
  inProgress: UnitRow[];
  notStarted: UnitRow[];
  completed: UnitRow[];
}

/**
 * Dashboard table order: in-progress units first, then not started, with
 * completed units split out (shown in a collapsible section). Within each
 * group the course order is kept.
 */
export function groupUnits(units: Unit[], completions: Completions): GroupedUnits {
  const grouped: GroupedUnits = { inProgress: [], notStarted: [], completed: [] };
  for (const unit of units) {
    const row = unitRow(unit, units, completions);
    if (row.status === 'in-progress') grouped.inProgress.push(row);
    else if (row.status === 'not-started') grouped.notStarted.push(row);
    else grouped.completed.push(row);
  }
  return grouped;
}

/* ------------------------------------------------------------------ */
/* Continue studying                                                    */
/* ------------------------------------------------------------------ */

/**
 * The topic to study next in a unit: the preferred topic (e.g. the one being
 * timed) if it is still unfinished, otherwise the first unfinished topic in
 * course order. Null when every topic is done.
 */
export function nextTopic(
  unit: Unit,
  completions: Completions,
  preferredTopicId: string | null = null,
): Topic | null {
  const topics = unit.topics ?? [];
  const unfinished = (topic: Topic) => completions[unit.id]?.[topic.id] !== true;
  const preferred = preferredTopicId
    ? topics.find((topic) => topic.id === preferredTopicId)
    : undefined;
  if (preferred && unfinished(preferred)) return preferred;
  return topics.find(unfinished) ?? null;
}

export type ContinueReason =
  | 'timer'
  | 'selected'
  | 'last-studied'
  | 'in-progress'
  | 'not-started';

export type ContinueTarget =
  | {
      kind: 'unit';
      reason: ContinueReason;
      unit: Unit;
      topic: Topic;
      /** 1-based position of `topic` within the unit. */
      topicNumber: number;
      topicsLeft: number;
    }
  | { kind: 'all-complete'; unitsTotal: number }
  | { kind: 'none' };

export interface ContinueInput {
  units: Unit[];
  completions: Completions;
  /** Unit / topic of a running timer (null when the timer is idle). */
  activeUnitId: string | null;
  activeTopicId: string | null;
  /** Unit picked in the timer / Units tab. */
  selectedUnitId: string | null;
  /** Newest first, as stored. */
  sessionLogs: SessionLog[];
}

/**
 * Decide what the "Continue studying" card offers.
 *
 * 1. Resume the active unit: the unit being timed, else the selected unit,
 *    else the most recently studied unit from the session log, as long as it
 *    is one of `units`, unlocked and not yet complete.
 * 2. Otherwise suggest the first in-progress unit, then the next unlocked
 *    unit that has not been started (course order).
 * 3. If every unit is complete, report that.
 */
export function pickContinueTarget(input: ContinueInput): ContinueTarget {
  const { units, completions } = input;
  if (units.length > 0 && units.every((unit) => isUnitComplete(unit, completions))) {
    return { kind: 'all-complete', unitsTotal: units.length };
  }

  const eligible = (unitId: string | null): Unit | undefined => {
    if (!unitId) return undefined;
    const unit = units.find((candidate) => candidate.id === unitId);
    if (!unit || unit.topics.length === 0) return undefined;
    if (isUnitComplete(unit, completions)) return undefined;
    if (!isUnitUnlocked(unit, units, completions)) return undefined;
    return unit;
  };

  const build = (unit: Unit, reason: ContinueReason, preferredTopicId: string | null): ContinueTarget => {
    const topic = nextTopic(unit, completions, preferredTopicId)!;
    const topicsLeft = unit.topics.filter(
      (candidate) => completions[unit.id]?.[candidate.id] !== true,
    ).length;
    return {
      kind: 'unit',
      reason,
      unit,
      topic,
      topicNumber: unit.topics.indexOf(topic) + 1,
      topicsLeft,
    };
  };

  const timed = eligible(input.activeUnitId);
  if (timed) return build(timed, 'timer', input.activeTopicId);

  const selected = eligible(input.selectedUnitId);
  if (selected) return build(selected, 'selected', null);

  for (const log of input.sessionLogs) {
    const unit = units.find((candidate) => candidate.id === log.unitId);
    if (!unit) continue; // study strands (MATH, ALG, ...) are not dashboard units
    const recent = eligible(unit.id);
    if (recent) return build(recent, 'last-studied', log.topicId);
    break; // only the most recent course unit counts as "last studied"
  }

  const rows = units.map((unit) => unitRow(unit, units, completions));
  const inProgress = rows.find((row) => row.status === 'in-progress' && row.unlocked && row.topicsTotal > 0);
  if (inProgress) return build(inProgress.unit, 'in-progress', null);

  const notStarted = rows.find((row) => row.status === 'not-started' && row.unlocked && row.topicsTotal > 0);
  if (notStarted) return build(notStarted.unit, 'not-started', null);

  return { kind: 'none' };
}
