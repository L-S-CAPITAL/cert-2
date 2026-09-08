import { ProgressState, SessionLog } from '../types';

export const STORAGE_KEY = 'electrotech-progress';
export const MAX_SESSION_LOGS = 200;
export const PERSIST_VERSION = 1;

export interface PersistedProgress {
  version: number;
  unitCompletions: Record<string, Record<string, boolean>>;
  sessionLogs: SessionLog[];
  totalTimeSeconds: number;
}

export function emptyPersisted(): PersistedProgress {
  return {
    version: PERSIST_VERSION,
    unitCompletions: {},
    sessionLogs: [],
    totalTimeSeconds: 0,
  };
}

function isSessionLog(value: unknown): value is SessionLog {
  if (!value || typeof value !== 'object') return false;
  const log = value as Record<string, unknown>;
  return (
    typeof log.id === 'string' &&
    typeof log.unitId === 'string' &&
    (log.topicId === null || typeof log.topicId === 'string') &&
    typeof log.durationSeconds === 'number' &&
    Number.isFinite(log.durationSeconds) &&
    log.durationSeconds >= 0 &&
    typeof log.timestamp === 'string'
  );
}

function sanitizeCompletions(
  raw: unknown,
): Record<string, Record<string, boolean>> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, Record<string, boolean>> = {};
  for (const [unitId, topics] of Object.entries(raw as Record<string, unknown>)) {
    if (!topics || typeof topics !== 'object' || Array.isArray(topics)) continue;
    const clean: Record<string, boolean> = {};
    for (const [topicId, done] of Object.entries(
      topics as Record<string, unknown>,
    )) {
      if (typeof done === 'boolean') clean[topicId] = done;
    }
    result[unitId] = clean;
  }
  return result;
}

export function sanitizePersistedState(raw: unknown): PersistedProgress {
  const empty = emptyPersisted();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return empty;
  const data = raw as Record<string, unknown>;

  const logs = Array.isArray(data.sessionLogs)
    ? data.sessionLogs.filter(isSessionLog).slice(0, MAX_SESSION_LOGS)
    : [];

  const total =
    typeof data.totalTimeSeconds === 'number' &&
    Number.isFinite(data.totalTimeSeconds) &&
    data.totalTimeSeconds > 0
      ? Math.floor(data.totalTimeSeconds)
      : 0;

  return {
    version: PERSIST_VERSION,
    unitCompletions: sanitizeCompletions(data.unitCompletions),
    sessionLogs: logs,
    totalTimeSeconds: total,
  };
}

export function toPersisted(state: ProgressState): PersistedProgress {
  return {
    version: PERSIST_VERSION,
    unitCompletions: state.unitCompletions,
    sessionLogs: state.sessionLogs.slice(0, MAX_SESSION_LOGS),
    totalTimeSeconds: state.totalTimeSeconds,
  };
}

export function loadPersisted(storage: Storage): PersistedProgress {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyPersisted();
    return sanitizePersistedState(JSON.parse(raw));
  } catch {
    return emptyPersisted();
  }
}

export function savePersisted(storage: Storage, state: ProgressState): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(toPersisted(state)));
  } catch {
    // private mode / quota
  }
}
