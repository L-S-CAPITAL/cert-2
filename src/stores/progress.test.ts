import { afterEach, describe, expect, it } from 'vitest';
import { createProgressStore } from './progress';
import { MAX_SESSION_LOGS, STORAGE_KEY } from './persist';

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
});
