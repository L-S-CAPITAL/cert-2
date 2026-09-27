import { afterEach, describe, expect, it } from 'vitest';
import { createProgressStore } from './progress';
import { MAX_QUIZ_ATTEMPTS, MAX_SESSION_LOGS, STORAGE_KEY } from './persist';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length() {
    return this.data.size;
  }

  clear() {
    this.data.clear();
  }

  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe('progressStore', () => {
  const stores: Array<ReturnType<typeof createProgressStore>> = [];

  afterEach(() => {
    stores.splice(0).forEach((store) => store.reset());
  });

  function makeStore(seed?: string) {
    const storage = new MemoryStorage();
    if (seed) storage.setItem(STORAGE_KEY, seed);
    const store = createProgressStore(storage);
    stores.push(store);
    return { store, storage };
  }

  it('does not persist an in-progress timer', () => {
    const { store, storage } = makeStore();
    store.startSession('c1');
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
    expect(saved.startTime).toBeUndefined();
    expect(saved.activeUnitId).toBeUndefined();
    expect(store.getState().startTime).not.toBeNull();
  });

  it('does not resume a timer saved by older versions', () => {
    const { store } = makeStore(
      JSON.stringify({
        startTime: Date.now() - 3_600_000,
        activeUnitId: 'c1',
        totalTimeSeconds: 10,
        unitCompletions: {},
        sessionLogs: [],
      }),
    );
    expect(store.getState().startTime).toBeNull();
    expect(store.getState().activeUnitId).toBeNull();
    expect(store.getFormattedActiveTime()).toBe('00:00:00');
  });

  it('records elapsed time only when a session is stopped', () => {
    const { store } = makeStore();
    const now = Date.now();
    store.startSession('c1');
    store.getState().startTime = now - 5000;
    store.stopSession();
    expect(store.getState().totalTimeSeconds).toBe(5);
    expect(store.getSessionLogs()).toHaveLength(1);
    expect(store.getSessionLogs()[0].unitId).toBe('c1');
    expect(store.getState().startTime).toBeNull();
  });

  it('stores topicId on topic sessions', () => {
    const { store } = makeStore();
    store.startTopicSession('c1', 'c1-t1');
    store.getState().startTime = Date.now() - 1000;
    store.stopSession();
    expect(store.getSessionLogs()[0].topicId).toBe('c1-t1');
  });

  it('caps persisted session logs', () => {
    const { store } = makeStore();
    for (let i = 0; i < MAX_SESSION_LOGS + 5; i++) {
      store.startSession('c1');
      store.getState().startTime = Date.now() - 1000;
      store.stopSession();
    }
    expect(store.getSessionLogs()).toHaveLength(MAX_SESSION_LOGS);
  });

  it('exports JSON without runtime timer fields and imports it', () => {
    const { store } = makeStore();
    store.markTopicComplete('c1', 'c1-t1');
    const json = store.exportProgress();
    const parsed = JSON.parse(json);
    expect(parsed.startTime).toBeUndefined();
    expect(parsed.unitCompletions.c1['c1-t1']).toBe(true);

    const { store: other } = makeStore();
    expect(other.importProgress(json)).toBe(true);
    expect(other.isTopicComplete('c1', 'c1-t1')).toBe(true);
  });

  it('rejects invalid import payloads', () => {
    const { store } = makeStore();
    expect(store.importProgress('not-json')).toBe(false);
    expect(store.importProgress('null')).toBe(false);
  });

  function runningStore() {
    const { store, storage } = makeStore();
    store.markTopicComplete('c1', 'c1-t1');
    store.startTopicSession('c1', 'c1-t1');
    store.getState().startTime = Date.now() - 5000;
    const snapshots: Array<ReturnType<typeof store.getState>> = [];
    store.subscribe(() => snapshots.push(store.getState()));
    return { store, storage, snapshots };
  }

  it('stops and saves a running session before reset', () => {
    const { store, snapshots } = runningStore();
    store.reset();
    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].startTime).toBeNull();
    expect(snapshots[0].sessionLogs[0]).toMatchObject({
      unitId: 'c1',
      topicId: 'c1-t1',
      durationSeconds: 5,
    });
    expect(snapshots[0].totalTimeSeconds).toBe(5);
    const final = store.getState();
    expect(final.startTime).toBeNull();
    expect(final.activeUnitId).toBeNull();
    expect(final.sessionLogs).toHaveLength(0);
    expect(final.totalTimeSeconds).toBe(0);
  });

  it('stops and saves a running session before a valid import', () => {
    const { store, snapshots } = runningStore();
    const json = JSON.stringify({
      unitCompletions: { c2: { 'c2-t1': true } },
      sessionLogs: [],
      totalTimeSeconds: 42,
    });
    expect(store.importProgress(json)).toBe(true);
    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].sessionLogs[0]).toMatchObject({ unitId: 'c1', durationSeconds: 5 });
    expect(store.getState().startTime).toBeNull();
    expect(store.getState().totalTimeSeconds).toBe(42);
    expect(store.isTopicComplete('c2', 'c2-t1')).toBe(true);
  });

  it('records quiz attempts newest first and saves them', () => {
    const { store, storage } = makeStore();
    store.recordQuizAttempt('c1', 'c1-t1', 2, 4);
    store.recordQuizAttempt('c1', 'c1-t2', 3, 3);
    const attempts = store.getState().quizAttempts;
    expect(attempts.map((a) => [a.topicId, a.score, a.total])).toEqual([
      ['c1-t2', 3, 3],
      ['c1-t1', 2, 4],
    ]);
    expect(attempts[0].id).not.toBe(attempts[1].id);
    expect(Number.isNaN(Date.parse(attempts[0].timestamp))).toBe(false);
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
    expect(saved.version).toBe(2);
    expect(saved.quizAttempts).toHaveLength(2);
    // Recording a score does not complete the topic by itself.
    expect(store.isTopicComplete('c1', 'c1-t2')).toBe(false);
  });

  it('ignores invalid quiz attempts', () => {
    const { store } = makeStore();
    store.recordQuizAttempt('c1', 'c1-t1', 5, 4);
    store.recordQuizAttempt('c1', 'c1-t1', -1, 4);
    store.recordQuizAttempt('c1', 'c1-t1', 0, 0);
    store.recordQuizAttempt('', 'c1-t1', 1, 2);
    store.recordQuizAttempt('c1', 'c1-t1', 1.5, 2);
    expect(store.getState().quizAttempts).toHaveLength(0);
  });

  it('keeps at most MAX_QUIZ_ATTEMPTS attempts', () => {
    const { store } = makeStore();
    for (let i = 0; i < MAX_QUIZ_ATTEMPTS + 3; i++) store.recordQuizAttempt('c1', `t${i}`, 1, 1);
    const attempts = store.getState().quizAttempts;
    expect(attempts).toHaveLength(MAX_QUIZ_ATTEMPTS);
    expect(attempts[0].topicId).toBe(`t${MAX_QUIZ_ATTEMPTS + 2}`);
  });

  it('loads version 1 saves without losing progress', () => {
    const { store } = makeStore(
      JSON.stringify({
        version: 1,
        unitCompletions: { c1: { 'c1-t1': true } },
        sessionLogs: [],
        totalTimeSeconds: 90,
      }),
    );
    expect(store.isTopicComplete('c1', 'c1-t1')).toBe(true);
    expect(store.getState().totalTimeSeconds).toBe(90);
    expect(store.getState().quizAttempts).toEqual([]);
  });

  it('exports and re-imports quiz attempts, validating them', () => {
    const { store } = makeStore();
    store.recordQuizAttempt('c1', 'c1-t1', 1, 3);
    const exported = JSON.parse(store.exportProgress());
    expect(exported.version).toBe(2);
    expect(exported.quizAttempts).toHaveLength(1);

    const { store: other } = makeStore();
    exported.quizAttempts.push({ id: 'x', unitId: 'c1', topicId: 't', score: 9, total: 3, timestamp: 'nope' });
    expect(other.importProgress(JSON.stringify(exported))).toBe(true);
    expect(other.getState().quizAttempts).toHaveLength(1);
    expect(other.getState().quizAttempts[0]).toMatchObject({ topicId: 'c1-t1', score: 1, total: 3 });
  });

  it('leaves a running session alone when an import is rejected', () => {
    const { store, snapshots } = runningStore();
    expect(store.importProgress('not-json')).toBe(false);
    expect(store.importProgress('[]')).toBe(false);
    expect(snapshots).toHaveLength(0);
    expect(store.getState().startTime).not.toBeNull();
  });
});

describe('saved progress for removed electives', () => {
  it('loads old saves with UEECD0044/UEECD0051/UEECO0002 progress and keeps it in exports', () => {
    const storage = new MemoryStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        unitCompletions: {
          c1: { 'c1-t1': true },
          e1: { 'e1-t1': true, 'e1-t2': true },
          e2: { 'e2-t1': true },
          e4: { 'e4-t1': true },
        },
        sessionLogs: [],
        totalTimeSeconds: 60,
        quizAttempts: [],
      }),
    );
    const store = createProgressStore(storage);
    try {
      expect(store.isTopicComplete('c1', 'c1-t1')).toBe(true);
      expect(store.isTopicComplete('e1', 'e1-t2')).toBe(true);
      const exported = JSON.parse(store.exportProgress());
      expect(Object.keys(exported.unitCompletions).sort()).toEqual(['c1', 'e1', 'e2', 'e4']);
    } finally {
      store.reset();
    }
  });
});
