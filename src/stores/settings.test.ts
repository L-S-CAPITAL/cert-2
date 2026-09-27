import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  applyTheme,
  loadSettings,
  resolveTheme,
  sanitizeSettings,
  saveSettings,
} from './settings';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
  };
}

describe('settings', () => {
  it('starts with no theme choice and the timer panel collapsed', () => {
    expect(loadSettings(memoryStorage())).toEqual({ theme: null, timerExpanded: false });
    expect(loadSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips through storage', () => {
    const storage = memoryStorage();
    saveSettings({ theme: 'light', timerExpanded: true }, storage);
    expect(JSON.parse(storage.data[SETTINGS_KEY])).toEqual({ theme: 'light', timerExpanded: true });
    expect(loadSettings(storage)).toEqual({ theme: 'light', timerExpanded: true });
  });

  it('ignores corrupt or unknown values', () => {
    expect(loadSettings(memoryStorage({ [SETTINGS_KEY]: '{not json' }))).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ theme: 'neon', timerExpanded: 'yes' })).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('follows the system theme until the user picks one', () => {
    expect(resolveTheme(null, true)).toBe('light');
    expect(resolveTheme(null, false)).toBe('dark');
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('light', false)).toBe('light');
  });

  it('applies the theme as a data attribute on the root element', () => {
    const root = document.createElement('html');
    applyTheme('light', root);
    expect(root.getAttribute('data-theme')).toBe('light');
  });
});
