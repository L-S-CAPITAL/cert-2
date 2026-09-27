import { describe, expect, it } from 'vitest';
import {
  MAX_QUIZ_ATTEMPTS,
  MAX_SESSION_LOGS,
  PERSIST_VERSION,
  emptyPersisted,
  migratePersisted,
  sanitizePersistedState,
  toPersisted,
} from './persist';
import { ProgressState } from '../types';

describe('sanitizePersistedState', () => {
  it('returns empty persisted state for non-objects', () => {
    expect(sanitizePersistedState(null)).toEqual(emptyPersisted());
    expect(sanitizePersistedState('nope')).toEqual(emptyPersisted());
    expect(sanitizePersistedState(42)).toEqual(emptyPersisted());
  });

  it('drops runtime timer fields so reloads cannot resume a session', () => {
    const sanitized = sanitizePersistedState({
      unitCompletions: { c1: { 'c1-t1': true } },
      sessionLogs: [],
      totalTimeSeconds: 12,
      startTime: Date.now() - 60_000,
      activeUnitId: 'c1',
      activeTopicId: 'c1-t1',
    });

    expect(sanitized).toEqual({
      version: 2,
      unitCompletions: { c1: { 'c1-t1': true } },
      sessionLogs: [],
      totalTimeSeconds: 12,
      quizAttempts: [],
    });
    expect(sanitized).not.toHaveProperty('startTime');
    expect(sanitized).not.toHaveProperty('activeUnitId');
  });

  it('keeps only boolean topic completions and valid session logs', () => {
    const sanitized = sanitizePersistedState({
      unitCompletions: {
        c1: { 'c1-t1': true, 'c1-t2': 'yes', nested: { x: 1 } },
        bad: 'nope',
      },
      sessionLogs: [
        {
          id: '1',
          unitId: 'c1',
          topicId: 'c1-t1',
          durationSeconds: 30,
          timestamp: '2026-01-01T00:00:00.000Z',
        },
        { id: 2, unitId: 'c1' },
        'garbage',
      ],
      totalTimeSeconds: -9,
    });

    expect(sanitized.unitCompletions).toEqual({ c1: { 'c1-t1': true } });
    expect(sanitized.sessionLogs).toHaveLength(1);
    expect(sanitized.sessionLogs[0].unitId).toBe('c1');
    expect(sanitized.totalTimeSeconds).toBe(0);
  });

  it('caps session logs at MAX_SESSION_LOGS keeping the newest first', () => {
    const logs = Array.from({ length: MAX_SESSION_LOGS + 25 }, (_, i) => ({
      id: String(i),
      unitId: 'c1',
      topicId: null,
      durationSeconds: 1,
      timestamp: `2026-01-01T00:00:${String(i % 60).padStart(2, '0')}.000Z`,
    }));

    const sanitized = sanitizePersistedState({
      sessionLogs: logs,
      unitCompletions: {},
      totalTimeSeconds: 25,
    });

    expect(sanitized.sessionLogs).toHaveLength(MAX_SESSION_LOGS);
    expect(sanitized.sessionLogs[0].id).toBe('0');
  });
});

describe('toPersisted', () => {
  it('omits in-progress timer fields', () => {
    const state: ProgressState = {
      unitCompletions: {},
      sessionLogs: [],
      totalTimeSeconds: 0,
      quizAttempts: [],
      startTime: 123,
      activeUnitId: 'c1',
      activeTopicId: null,
    };

    expect(toPersisted(state)).toEqual(emptyPersisted());
  });
});

const attempt = (i: number, extra: Record<string, unknown> = {}) => ({
  id: `a${i}`,
  unitId: 'c1',
  topicId: 'c1-t1',
  score: 2,
  total: 4,
  timestamp: '2026-09-01T10:00:00.000Z',
  ...extra,
});

describe('schema migration (v1 -> v2)', () => {
  const v1 = {
    version: 1,
    unitCompletions: { c1: { 'c1-t1': true } },
    sessionLogs: [
      { id: '1', unitId: 'c1', topicId: null, durationSeconds: 60, timestamp: '2026-09-01T10:00:00.000Z' },
    ],
    totalTimeSeconds: 60,
  };

  it('loads version 1 data unchanged, with an empty quiz history', () => {
    expect(PERSIST_VERSION).toBe(2);
    expect(sanitizePersistedState(v1)).toEqual({ ...v1, version: 2, quizAttempts: [] });
  });

  it('treats unversioned data as version 1', () => {
    const { version: _drop, ...unversioned } = v1;
    expect(sanitizePersistedState(unversioned)).toEqual({ ...v1, version: 2, quizAttempts: [] });
  });

  it('ignores quiz attempts smuggled into version 1 data', () => {
    expect(migratePersisted({ ...v1, quizAttempts: [attempt(1)] }).quizAttempts).toEqual([]);
  });

  it('keeps what it understands from a newer version', () => {
    const future = { ...v1, version: 3, quizAttempts: [attempt(1)], somethingNew: true };
    const sanitized = sanitizePersistedState(future);
    expect(sanitized.version).toBe(2);
    expect(sanitized.quizAttempts).toEqual([attempt(1)]);
    expect(sanitized).not.toHaveProperty('somethingNew');
  });
});

describe('quiz attempt validation', () => {
  it('keeps valid attempts and drops malformed ones', () => {
    const sanitized = sanitizePersistedState({
      version: 2,
      quizAttempts: [
        attempt(1),
        attempt(2, { score: 5 }), // more than total
        attempt(3, { score: -1 }),
        attempt(4, { total: 0 }),
        attempt(5, { score: 1.5 }),
        attempt(6, { timestamp: 'yesterday-ish' }),
        attempt(7, { topicId: '' }),
        attempt(8, { unitId: 7 }),
        attempt(9, { total: 1_000_000, score: 1 }),
        'garbage',
        null,
        attempt(10, { score: 4, extra: '<script>' }),
      ],
    });
    expect(sanitized.quizAttempts.map((a) => a.id)).toEqual(['a1', 'a10']);
    expect(sanitized.quizAttempts[1]).not.toHaveProperty('extra');
  });

  it('caps the history at MAX_QUIZ_ATTEMPTS, newest first', () => {
    const many = Array.from({ length: MAX_QUIZ_ATTEMPTS + 40 }, (_, i) => attempt(i));
    const sanitized = sanitizePersistedState({ version: 2, quizAttempts: many });
    expect(sanitized.quizAttempts).toHaveLength(MAX_QUIZ_ATTEMPTS);
    expect(sanitized.quizAttempts[0].id).toBe('a0');
  });

  it('treats a non-array quizAttempts as empty', () => {
    expect(sanitizePersistedState({ version: 2, quizAttempts: { a: 1 } }).quizAttempts).toEqual([]);
  });

  it('caps attempts when saving', () => {
    const state: ProgressState = {
      ...emptyPersisted(),
      quizAttempts: Array.from({ length: MAX_QUIZ_ATTEMPTS + 5 }, (_, i) => attempt(i)),
      startTime: null,
      activeUnitId: null,
      activeTopicId: null,
    };
    expect(toPersisted(state).quizAttempts).toHaveLength(MAX_QUIZ_ATTEMPTS);
  });
});
