import { useSyncExternalStore } from 'react';
import { ProgressState, QuizAttempt, SessionLog, Topic } from '../types';
import {
  MAX_QUIZ_ATTEMPTS,
  MAX_QUIZ_QUESTIONS,
  MAX_SESSION_LOGS,
  loadPersisted,
  savePersisted,
  toPersisted,
  sanitizePersistedState,
} from './persist';

type Listener = () => void;

function runtimeDefaults(): Pick<
  ProgressState,
  'startTime' | 'activeUnitId' | 'activeTopicId'
> {
  return {
    startTime: null,
    activeUnitId: null,
    activeTopicId: null,
  };
}

function fromStorage(storage: Storage): ProgressState {
  return {
    ...loadPersisted(storage),
    ...runtimeDefaults(),
  };
}

export function createProgressStore(storage: Storage) {
  let state: ProgressState = fromStorage(storage);
  let attemptCounter = 0;
  const listeners = new Set<Listener>();

  function emit() {
    for (const listener of listeners) listener();
  }

  function commit(next: ProgressState) {
    state = next;
    savePersisted(storage, state);
    emit();
  }

  const store = {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    getState(): ProgressState {
      return state;
    },

    getUnitCompletion(unitId: string, topics: Topic[]): number {
      const total = topics.length;
      if (total === 0) return 0;
      let completed = 0;
      for (const topic of topics) {
        if (state.unitCompletions[unitId]?.[topic.id]) completed++;
      }
      return Math.round((completed / total) * 100);
    },

    getFormattedTotalTime(): string {
      const total = state.totalTimeSeconds;
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    },

    getActiveSessionTime(): number {
      if (state.startTime === null) return 0;
      return Date.now() - state.startTime;
    },

    getFormattedActiveTime(): string {
      const elapsed = store.getActiveSessionTime();
      const total = Math.floor(elapsed / 1000);
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    startSession(unitId: string): void {
      if (state.startTime !== null) store.stopSession();
      commit({
        ...state,
        startTime: Date.now(),
        activeUnitId: unitId,
        activeTopicId: null,
      });
    },

    startTopicSession(unitId: string, topicId: string): void {
      if (state.startTime !== null) store.stopSession();
      commit({
        ...state,
        startTime: Date.now(),
        activeUnitId: unitId,
        activeTopicId: topicId,
      });
    },

    stopSession(): void {
      if (state.startTime === null) return;

      const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      let sessionLogs = state.sessionLogs;
      let totalTimeSeconds = state.totalTimeSeconds;

      if (elapsedSeconds > 0) {
        const entry: SessionLog = {
          id: Date.now().toString(),
          unitId: state.activeUnitId || 'unknown',
          topicId: state.activeTopicId,
          durationSeconds: elapsedSeconds,
          timestamp: new Date().toISOString(),
        };
        sessionLogs = [entry, ...state.sessionLogs].slice(0, MAX_SESSION_LOGS);
        totalTimeSeconds += elapsedSeconds;
      }

      commit({
        ...state,
        sessionLogs,
        totalTimeSeconds,
        ...runtimeDefaults(),
      });
    },

    markTopicComplete(unitId: string, topicId: string): void {
      commit({
        ...state,
        unitCompletions: {
          ...state.unitCompletions,
          [unitId]: {
            ...(state.unitCompletions[unitId] || {}),
            [topicId]: true,
          },
        },
      });
    },

    markTopicIncomplete(unitId: string, topicId: string): void {
      if (!state.unitCompletions[unitId]) return;
      commit({
        ...state,
        unitCompletions: {
          ...state.unitCompletions,
          [unitId]: {
            ...state.unitCompletions[unitId],
            [topicId]: false,
          },
        },
      });
    },

    /**
     * Save a finished quiz (newest first, capped at MAX_QUIZ_ATTEMPTS).
     * Invalid input (no questions, score out of range) is ignored.
     */
    recordQuizAttempt(unitId: string, topicId: string, score: number, total: number): void {
      if (
        !unitId ||
        !topicId ||
        !Number.isInteger(total) ||
        total < 1 ||
        total > MAX_QUIZ_QUESTIONS ||
        !Number.isInteger(score) ||
        score < 0 ||
        score > total
      ) {
        return;
      }
      const now = Date.now();
      attemptCounter += 1;
      const attempt: QuizAttempt = {
        id: `${now.toString(36)}-${attemptCounter}`,
        unitId,
        topicId,
        score,
        total,
        timestamp: new Date(now).toISOString(),
      };
      commit({
        ...state,
        quizAttempts: [attempt, ...state.quizAttempts].slice(0, MAX_QUIZ_ATTEMPTS),
      });
    },

    isTopicComplete(unitId: string, topicId: string): boolean {
      return state.unitCompletions[unitId]?.[topicId] ?? false;
    },

    getSessionLogs(): SessionLog[] {
      return state.sessionLogs;
    },

    onProgressChange(callback: Listener): () => void {
      return store.subscribe(callback);
    },

    exportProgress(): string {
      return JSON.stringify(toPersisted(state), null, 2);
    },

    importProgress(json: string): boolean {
      try {
        const raw = JSON.parse(json) as unknown;
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false;
        // Close out a running session (log + save it) before replacing state,
        // so the timer never keeps running against the imported data.
        store.stopSession();
        commit({
          ...sanitizePersistedState(raw),
          ...runtimeDefaults(),
        });
        return true;
      } catch {
        return false;
      }
    },

    reset(): void {
      // Stop and save a running session first, so the reset starts from a
      // stopped timer instead of silently discarding it mid-flight.
      store.stopSession();
      commit({
        ...sanitizePersistedState({}),
        ...runtimeDefaults(),
      });
    },
  };

  return store;
}

const defaultStorage: Storage =
  typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : {
        get length() {
          return 0;
        },
        clear() {},
        getItem() {
          return null;
        },
        key() {
          return null;
        },
        removeItem() {},
        setItem() {},
      };

export const progressStore = createProgressStore(defaultStorage);

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getState,
    progressStore.getState,
  );
}
