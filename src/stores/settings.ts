/**
 * Display settings (theme, timer panel), kept in localStorage separately from
 * study progress. They are not part of the progress export / import / reset.
 */
export type Theme = 'dark' | 'light';

export interface Settings {
  /** Chosen theme, or null to follow the system (prefers-color-scheme). */
  theme: Theme | null;
  /** Whether the study timer panel stays open while the timer is idle. */
  timerExpanded: boolean;
}

export const SETTINGS_KEY = 'electrotech-settings';

export const DEFAULT_SETTINGS: Settings = { theme: null, timerExpanded: false };

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function browserStorage(): KeyValueStorage | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function sanitizeSettings(raw: unknown): Settings {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    theme: value.theme === 'dark' || value.theme === 'light' ? value.theme : null,
    timerExpanded: value.timerExpanded === true,
  };
}

export function loadSettings(storage: KeyValueStorage | null = browserStorage()): Settings {
  if (!storage) return { ...DEFAULT_SETTINGS };
  try {
    const text = storage.getItem(SETTINGS_KEY);
    return text ? sanitizeSettings(JSON.parse(text)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(
  settings: Settings,
  storage: KeyValueStorage | null = browserStorage(),
): void {
  try {
    storage?.setItem(SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)));
  } catch {
    // Storage full or blocked: settings simply do not persist.
  }
}

export function systemPrefersLight(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
  );
}

/** An explicit choice wins; until one is made, follow the system setting. */
export function resolveTheme(choice: Theme | null, prefersLight: boolean): Theme {
  return choice ?? (prefersLight ? 'light' : 'dark');
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = theme;
}
