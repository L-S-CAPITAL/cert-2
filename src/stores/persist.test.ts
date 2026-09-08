import { describe, expect, it } from 'vitest';
import {
  MAX_SESSION_LOGS,
  emptyPersisted,
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
      version: 1,
      unitCompletions: { c1: { 'c1-t1': true } },
      sessionLogs: [],
      totalTimeSeconds: 12,
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
      startTime: 123,
      activeUnitId: 'c1',
      activeTopicId: null,
    };

    expect(toPersisted(state)).toEqual(emptyPersisted());
  });
});
