import { ProgressState, QuizAttempt, SessionLog } from '../types';

export const STORAGE_KEY = 'electrotech-progress';
export const MAX_SESSION_LOGS = 200;
export const MAX_QUIZ_ATTEMPTS = 500;
/** Largest quiz we accept from storage / imports (real quizzes are far smaller). */
export const MAX_QUIZ_QUESTIONS = 1000;
/**
 * Saved-data format version.
 *  - 1: unitCompletions, sessionLogs, totalTimeSeconds
 *  - 2: adds quizAttempts
 */
export const PERSIST_VERSION = 2;

export interface PersistedProgress {
  version: number;
  unitCompletions: Record<string, Record<string, boolean>>;
  sessionLogs: SessionLog[];
  totalTimeSeconds: number;
  quizAttempts: QuizAttempt[];
}

export function emptyPersisted(): PersistedProgress {
  return {
    version: PERSIST_VERSION,
    unitCompletions: {},
    sessionLogs: [],
    totalTimeSeconds: 0,
    quizAttempts: [],
  };
}

/**
 * Bring older saved data up to the current shape before it is validated.
 * Version 1 (and unversioned data from before versioning) had no quiz
 * history, so it starts empty; everything else carries over unchanged.
 * Data from a newer version is still validated field by field, so whatever
 * this version understands is kept.
 */
export function migratePersisted(data: Record<string, unknown>): Record<string, unknown> {
  const version = typeof data.version === 'number' ? data.version : 1;
  if (version < 2) {
    return { ...data, version: 2, quizAttempts: [] };
  }
  return data;
}

function isQuizAttempt(value: unknown): value is QuizAttempt {
  if (!value || typeof value !== 'object') return false;
  const attempt = value as Record<string, unknown>;
  return (
    typeof attempt.id === 'string' &&
    attempt.id.length > 0 &&
    typeof attempt.unitId === 'string' &&
    attempt.unitId.length > 0 &&
    typeof attempt.topicId === 'string' &&
    attempt.topicId.length > 0 &&
    Number.isInteger(attempt.total) &&
    (attempt.total as number) >= 1 &&
    (attempt.total as number) <= MAX_QUIZ_QUESTIONS &&
    Number.isInteger(attempt.score) &&
    (attempt.score as number) >= 0 &&
    (attempt.score as number) <= (attempt.total as number) &&
    typeof attempt.timestamp === 'string' &&
    !Number.isNaN(Date.parse(attempt.timestamp))
  );
}

function sanitizeQuizAttempts(raw: unknown): QuizAttempt[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isQuizAttempt)
    .slice(0, MAX_QUIZ_ATTEMPTS)
    .map(({ id, unitId, topicId, score, total, timestamp }) => ({
      id,
      unitId,
      topicId,
      score,
      total,
      timestamp,
    }));
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
  const data = migratePersisted(raw as Record<string, unknown>);

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
    quizAttempts: sanitizeQuizAttempts(data.quizAttempts),
  };
}

export function toPersisted(state: ProgressState): PersistedProgress {
  return {
    version: PERSIST_VERSION,
    unitCompletions: state.unitCompletions,
    sessionLogs: state.sessionLogs.slice(0, MAX_SESSION_LOGS),
    totalTimeSeconds: state.totalTimeSeconds,
    quizAttempts: state.quizAttempts.slice(0, MAX_QUIZ_ATTEMPTS),
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
