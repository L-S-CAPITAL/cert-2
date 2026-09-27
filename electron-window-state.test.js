import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import windowState from './electron-window-state.js';

const {
  DEFAULT_SIZE,
  MIN_SIZE,
  findVisibleWorkArea,
  sanitizeWindowState,
  loadWindowState,
  saveWindowState,
  captureWindowState,
} = windowState;

// A 1920x1080 primary display (taskbar at the bottom) and a 1280x1024
// secondary display to its right.
const primary = { x: 0, y: 0, width: 1920, height: 1040 };
const secondary = { x: 1920, y: 0, width: 1280, height: 1024 };
const displays = [primary, secondary];

describe('sanitizeWindowState', () => {
  it('uses the defaults when nothing valid was saved', () => {
    for (const raw of [null, undefined, 'nope', 42, [], {}, { width: 'big', height: 900 }]) {
      expect(sanitizeWindowState(raw, displays)).toEqual({
        width: DEFAULT_SIZE.width,
        height: DEFAULT_SIZE.height,
        isMaximized: false,
      });
    }
  });

  it('restores a saved position that is on a connected display', () => {
    expect(
      sanitizeWindowState({ x: 100, y: 50, width: 1200, height: 800, isMaximized: false }, displays),
    ).toEqual({ x: 100, y: 50, width: 1200, height: 800, isMaximized: false });
    expect(
      sanitizeWindowState({ x: 2000, y: 40, width: 1024, height: 700 }, displays),
    ).toEqual({ x: 2000, y: 40, width: 1024, height: 700, isMaximized: false });
  });

  it('drops the position when that display is gone', () => {
    // Saved on the secondary display, which is no longer connected.
    expect(sanitizeWindowState({ x: 2000, y: 40, width: 1024, height: 700 }, [primary])).toEqual({
      width: 1024,
      height: 700,
      isMaximized: false,
    });
  });

  it('drops the position when the title bar is off-screen', () => {
    // Above the top edge: the title bar could not be grabbed.
    expect(sanitizeWindowState({ x: 100, y: -300, width: 1000, height: 800 }, displays)).not.toHaveProperty('x');
    // Only a sliver on the left edge.
    expect(sanitizeWindowState({ x: -950, y: 100, width: 1000, height: 800 }, [primary])).not.toHaveProperty('x');
    // Below the bottom of the work area.
    expect(sanitizeWindowState({ x: 100, y: 1030, width: 1000, height: 800 }, [primary])).not.toHaveProperty('x');
  });

  it('pulls a partly off-screen window back onto its display', () => {
    expect(sanitizeWindowState({ x: 1500, y: 600, width: 1000, height: 800 }, [primary])).toEqual({
      x: 920,
      y: 240,
      width: 1000,
      height: 800,
      isMaximized: false,
    });
  });

  it('clamps the size to the minimum and to the display', () => {
    expect(sanitizeWindowState({ x: 10, y: 10, width: 300, height: 200 }, displays)).toEqual({
      x: 10,
      y: 10,
      width: MIN_SIZE.width,
      height: MIN_SIZE.height,
      isMaximized: false,
    });
    expect(sanitizeWindowState({ x: 0, y: 0, width: 5000, height: 4000 }, displays)).toEqual({
      x: 0,
      y: 0,
      width: 1920,
      height: 1040,
      isMaximized: false,
    });
    // No position: clamped to the primary display.
    expect(sanitizeWindowState({ width: 5000, height: 4000 }, displays)).toEqual({
      width: 1920,
      height: 1040,
      isMaximized: false,
    });
  });

  it('keeps the maximised flag and rounds fractional values', () => {
    expect(
      sanitizeWindowState({ x: 10.4, y: 20.6, width: 1000.5, height: 700.2, isMaximized: true }, displays),
    ).toEqual({ x: 10, y: 21, width: 1001, height: 700, isMaximized: true });
    expect(sanitizeWindowState({ isMaximized: true }, displays).isMaximized).toBe(false);
    expect(sanitizeWindowState({ width: 900, height: 700, isMaximized: 'yes' }, displays).isMaximized).toBe(false);
  });

  it('copes with no display information', () => {
    expect(sanitizeWindowState({ x: 10, y: 10, width: 1000, height: 700 }, [])).toEqual({
      width: 1000,
      height: 700,
      isMaximized: false,
    });
  });
});

describe('findVisibleWorkArea', () => {
  it('picks the display showing most of the title bar', () => {
    expect(findVisibleWorkArea({ x: 1800, y: 10, width: 1000, height: 700 }, displays)).toBe(secondary);
    expect(findVisibleWorkArea({ x: 1000, y: 10, width: 1000, height: 700 }, displays)).toBe(primary);
    expect(findVisibleWorkArea({ x: 5000, y: 10, width: 1000, height: 700 }, displays)).toBeNull();
  });
});

describe('loadWindowState / saveWindowState', () => {
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'window-state-'));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('round-trips through the JSON file', () => {
    const file = path.join(dir, 'nested', 'window-state.json');
    saveWindowState(file, { x: 40, y: 30, width: 1100, height: 720, isMaximized: true });
    expect(fs.existsSync(`${file}.tmp`)).toBe(false);
    expect(loadWindowState(file, displays)).toEqual({
      x: 40,
      y: 30,
      width: 1100,
      height: 720,
      isMaximized: true,
    });
  });

  it('falls back to the defaults for a missing or corrupt file', () => {
    const file = path.join(dir, 'window-state.json');
    expect(loadWindowState(file, displays)).toEqual({ ...DEFAULT_SIZE, isMaximized: false });
    fs.writeFileSync(file, '{"width": 1200, "hei');
    expect(loadWindowState(file, displays)).toEqual({ ...DEFAULT_SIZE, isMaximized: false });
  });

  it('captures the normal bounds of a window', () => {
    const win = {
      getNormalBounds: () => ({ x: 5, y: 6, width: 1000, height: 700 }),
      isMaximized: () => true,
    };
    expect(captureWindowState(win)).toEqual({ x: 5, y: 6, width: 1000, height: 700, isMaximized: true });
  });
});
