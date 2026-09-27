import { describe, expect, it } from 'vitest';
import { QuizAttempt, SessionLog, Unit } from '../types';
import {
  averageQuizScore,
  dailyStudyTime,
  dayStreak,
  quizPercent,
  formatStudyDuration,
  groupUnits,
  nextTopic,
  pickContinueTarget,
  startOfWeek,
  weeklyStudyTime,
} from './dashboard';

// All dates are built with the local-time Date constructor, so these tests
// pass in any time zone (CI runs in UTC, the box in Australia/Brisbane).
const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

let seq = 0;
const log = (when: Date, durationSeconds: number, unitId = 'u1', topicId: string | null = null): SessionLog => ({
  id: String(++seq),
  unitId,
  topicId,
  durationSeconds,
  timestamp: when.toISOString(),
});

const unit = (id: string, topics: number, prerequisites: string[] = [], kind?: 'elective'): Unit => ({
  id,
  code: id.toUpperCase(),
  name: `Unit ${id}`,
  description: '',
  prerequisites,
  points: 10,
  topics: Array.from({ length: topics }, (_, i) => ({
    id: `${id}-t${i + 1}`,
    title: `Topic ${i + 1}`,
    content: '',
    keyPoints: [],
  })),
  kind,
});

const done = (...ids: string[]) => {
  const completions: Record<string, Record<string, boolean>> = {};
  for (const id of ids) {
    const unitId = id.split('-')[0];
    completions[unitId] = { ...completions[unitId], [id]: true };
  }
  return completions;
};

describe('startOfWeek', () => {
  it('returns local Monday 00:00 for any day of the week', () => {
    // 28 Sep 2026 is a Monday.
    expect(startOfWeek(at(2026, 9, 28, 0, 0))).toEqual(at(2026, 9, 28, 0, 0));
    expect(startOfWeek(at(2026, 9, 30, 15))).toEqual(at(2026, 9, 28, 0, 0));
    expect(startOfWeek(at(2026, 10, 4, 23, 59))).toEqual(at(2026, 9, 28, 0, 0));
  });
});

describe('weeklyStudyTime', () => {
  const now = at(2026, 9, 30, 10); // Wednesday

  it('splits logged time into this week and last week (Monday-first)', () => {
    const logs = [
      log(at(2026, 9, 30, 9), 100), // this week
      log(at(2026, 9, 28, 0, 5), 50), // this week (Monday just after midnight)
      log(at(2026, 9, 27, 23, 55), 40), // last week (Sunday)
      log(at(2026, 9, 21, 8), 30), // last week (Monday)
      log(at(2026, 9, 20, 8), 1000), // two weeks ago: ignored
    ];
    expect(weeklyStudyTime(logs, now)).toEqual({ thisWeekSeconds: 150, lastWeekSeconds: 70 });
  });

  it('returns zeros with no logs and ignores unreadable timestamps', () => {
    expect(weeklyStudyTime([], now)).toEqual({ thisWeekSeconds: 0, lastWeekSeconds: 0 });
    const bad = { ...log(now, 99), timestamp: 'not a date' };
    expect(weeklyStudyTime([bad], now)).toEqual({ thisWeekSeconds: 0, lastWeekSeconds: 0 });
  });
});

describe('dayStreak', () => {
  const now = at(2026, 9, 28, 18);

  it('is 0 with no sessions', () => {
    expect(dayStreak([], now)).toEqual({ days: 0, daysSinceLastSession: null });
  });

  it('counts consecutive days ending today, with several sessions per day', () => {
    const logs = [
      log(at(2026, 9, 28, 9), 60),
      log(at(2026, 9, 28, 7), 60),
      log(at(2026, 9, 27, 21), 60),
      log(at(2026, 9, 26, 8), 60),
      log(at(2026, 9, 24, 8), 60), // gap on the 25th ends the streak
    ];
    expect(dayStreak(logs, now)).toEqual({ days: 3, daysSinceLastSession: 0 });
  });

  it('keeps the streak alive when the last session was yesterday', () => {
    const logs = [log(at(2026, 9, 27, 22), 60), log(at(2026, 9, 26, 22), 60)];
    expect(dayStreak(logs, now)).toEqual({ days: 2, daysSinceLastSession: 1 });
  });

  it('drops to 0 after a full day without a session', () => {
    const logs = [log(at(2026, 9, 26, 22), 60), log(at(2026, 9, 25, 22), 60)];
    expect(dayStreak(logs, now)).toEqual({ days: 0, daysSinceLastSession: 2 });
  });

  it('uses local calendar days, not 24-hour windows', () => {
    // 23:50 yesterday and 00:10 today are two different days.
    const logs = [log(at(2026, 9, 28, 0, 10), 60), log(at(2026, 9, 27, 23, 50), 60)];
    expect(dayStreak(logs, now).days).toBe(2);
  });
});

describe('formatStudyDuration', () => {
  it('formats compactly', () => {
    expect(formatStudyDuration(0)).toBe('0m');
    expect(formatStudyDuration(42)).toBe('42s');
    expect(formatStudyDuration(273)).toBe('4m 33s');
    expect(formatStudyDuration(600)).toBe('10m');
    expect(formatStudyDuration(3900)).toBe('1h 05m');
  });
});

describe('groupUnits', () => {
  it('puts in-progress first, then not started, and splits out completed units', () => {
    const units = [unit('a', 2), unit('b', 2), unit('c', 2), unit('d', 2), unit('e', 1)];
    const grouped = groupUnits(units, done('a-t1', 'a-t2', 'c-t1', 'e-t1', 'd-t2'));
    expect(grouped.inProgress.map((row) => row.unit.id)).toEqual(['c', 'd']);
    expect(grouped.notStarted.map((row) => row.unit.id)).toEqual(['b']);
    expect(grouped.completed.map((row) => row.unit.id)).toEqual(['a', 'e']);
    expect(grouped.inProgress[0]).toMatchObject({ topicsDone: 1, topicsTotal: 2, percent: 50 });
  });

  it('flags locked units', () => {
    const units = [unit('a', 1), unit('b', 1, ['A'])];
    expect(groupUnits(units, {}).notStarted.map((row) => row.unlocked)).toEqual([true, false]);
    expect(groupUnits(units, done('a-t1')).notStarted[0].unlocked).toBe(true);
  });
});

describe('nextTopic', () => {
  const u = unit('a', 3);

  it('returns the first unfinished topic in order', () => {
    expect(nextTopic(u, {})?.id).toBe('a-t1');
    expect(nextTopic(u, done('a-t1'))?.id).toBe('a-t2');
    expect(nextTopic(u, done('a-t1', 'a-t2'))?.id).toBe('a-t3');
  });

  it('prefers the given topic while it is unfinished', () => {
    expect(nextTopic(u, done('a-t1'), 'a-t3')?.id).toBe('a-t3');
    expect(nextTopic(u, done('a-t1', 'a-t3'), 'a-t3')?.id).toBe('a-t2');
  });

  it('returns null when the unit is complete', () => {
    expect(nextTopic(u, done('a-t1', 'a-t2', 'a-t3'))).toBeNull();
  });
});

describe('pickContinueTarget', () => {
  const units = [unit('a', 2), unit('b', 3), unit('c', 2, ['B']), unit('e', 1, [], 'elective')];
  const base = {
    units,
    completions: {},
    activeUnitId: null,
    activeTopicId: null,
    selectedUnitId: null,
    sessionLogs: [] as SessionLog[],
  };

  it('resumes the timed unit at its active topic when unfinished', () => {
    const target = pickContinueTarget({
      ...base,
      completions: done('b-t1'),
      activeUnitId: 'b',
      activeTopicId: 'b-t3',
    });
    expect(target).toMatchObject({ kind: 'unit', reason: 'timer', topicNumber: 3, topicsLeft: 2 });
    if (target.kind === 'unit') {
      expect(target.unit.id).toBe('b');
      expect(target.topic.id).toBe('b-t3');
    }
  });

  it('falls back to the selected unit, then the last studied course unit', () => {
    expect(pickContinueTarget({ ...base, selectedUnitId: 'b' })).toMatchObject({ reason: 'selected' });
    const logs = [log(at(2026, 9, 28), 60, 'MATH'), log(at(2026, 9, 27), 60, 'b', 'b-t2')];
    const target = pickContinueTarget({ ...base, sessionLogs: logs });
    expect(target).toMatchObject({ kind: 'unit', reason: 'last-studied' });
    if (target.kind === 'unit') expect(target.topic.id).toBe('b-t2');
  });

  it('ignores an active unit that is complete, locked or unknown', () => {
    expect(
      pickContinueTarget({ ...base, completions: done('a-t1', 'a-t2'), activeUnitId: 'a' }),
    ).toMatchObject({ reason: 'not-started' });
    expect(pickContinueTarget({ ...base, activeUnitId: 'c' })).toMatchObject({ reason: 'not-started' });
    expect(pickContinueTarget({ ...base, activeUnitId: 'MATH' })).toMatchObject({ reason: 'not-started' });
  });

  it('does not reach past the most recent course unit in the log', () => {
    // Last studied unit a is complete: suggest in-progress b, not older log entries.
    const logs = [log(at(2026, 9, 28), 60, 'a'), log(at(2026, 9, 27), 60, 'e')];
    const target = pickContinueTarget({ ...base, completions: done('a-t1', 'a-t2', 'b-t1'), sessionLogs: logs });
    expect(target).toMatchObject({ reason: 'in-progress' });
    if (target.kind === 'unit') expect(target.unit.id).toBe('b');
  });

  it('suggests the first in-progress unit, then the next unlocked unit not started', () => {
    const inProgress = pickContinueTarget({ ...base, completions: done('a-t1', 'a-t2', 'b-t2') });
    expect(inProgress).toMatchObject({ reason: 'in-progress', topicNumber: 1 });
    if (inProgress.kind === 'unit') expect(inProgress.unit.id).toBe('b');

    const next = pickContinueTarget({ ...base, completions: done('a-t1', 'a-t2') });
    expect(next).toMatchObject({ reason: 'not-started' });
    if (next.kind === 'unit') expect(next.unit.id).toBe('b');

    // c is locked behind B, so after a and b the elective is next.
    const afterB = pickContinueTarget({
      ...base,
      units: [unit('a', 1), unit('c', 1, ['X']), unit('e', 1, [], 'elective')],
      completions: done('a-t1'),
    });
    if (afterB.kind === 'unit') expect(afterB.unit.id).toBe('e');
  });

  it('reports when every unit is complete', () => {
    const all = done('a-t1', 'a-t2', 'b-t1', 'b-t2', 'b-t3', 'c-t1', 'c-t2', 'e-t1');
    expect(pickContinueTarget({ ...base, completions: all })).toEqual({ kind: 'all-complete', unitsTotal: 4 });
  });

  it('returns none when everything left is locked', () => {
    const target = pickContinueTarget({ ...base, units: [unit('a', 1), unit('z', 1, ['MISSING'])], completions: done('a-t1') });
    expect(target).toEqual({ kind: 'none' });
  });
});

describe('dailyStudyTime', () => {
  const now = at(2026, 9, 28, 18, 30);

  it('returns 14 local days, oldest first, ending today', () => {
    const days = dailyStudyTime([], now);
    expect(days).toHaveLength(14);
    expect(days[0].date).toEqual(at(2026, 9, 15, 0, 0));
    expect(days[13].date).toEqual(at(2026, 9, 28, 0, 0));
    expect(days.every((day) => day.seconds === 0)).toBe(true);
  });

  it('buckets sessions by the local day they were logged', () => {
    const days = dailyStudyTime(
      [
        log(at(2026, 9, 28, 0, 1), 60),
        log(at(2026, 9, 28, 23, 59), 120),
        log(at(2026, 9, 27, 23, 59), 30),
        log(at(2026, 9, 15, 0, 0), 600),
        log(at(2026, 9, 14, 23, 59), 999), // one day too old
        log(at(2026, 9, 29, 9, 0), 999), // in the future
        { ...log(at(2026, 9, 28), 999), timestamp: 'not a date' },
      ],
      now,
    );
    expect(days[13].seconds).toBe(180);
    expect(days[12].seconds).toBe(30);
    expect(days[0].seconds).toBe(600);
    expect(days.reduce((sum, day) => sum + day.seconds, 0)).toBe(810);
  });

  it('spans month boundaries and custom lengths', () => {
    const days = dailyStudyTime([log(at(2026, 2, 28), 60)], at(2026, 3, 2), 3);
    expect(days.map((day) => day.date.getDate())).toEqual([28, 1, 2]);
    expect(days[0].seconds).toBe(60);
  });
});

describe('averageQuizScore', () => {
  const attempt = (score: number, total: number): QuizAttempt => ({
    id: `${score}/${total}`,
    unitId: 'c1',
    topicId: 't',
    score,
    total,
    timestamp: '2026-09-01T00:00:00.000Z',
  });

  it('is null with no attempts', () => {
    expect(averageQuizScore([])).toBeNull();
  });

  it('averages each attempt equally', () => {
    // 50% and 100% average to 75%, even though the quizzes differ in length.
    expect(averageQuizScore([attempt(1, 2), attempt(10, 10)])).toEqual({ percent: 75, attempts: 2 });
    expect(averageQuizScore([attempt(1, 3)])).toEqual({ percent: 33, attempts: 1 });
  });

  it('computes a single attempt percentage', () => {
    expect(quizPercent(attempt(2, 3))).toBe(67);
    expect(quizPercent(attempt(0, 4))).toBe(0);
  });
});
