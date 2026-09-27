/**
 * Remembers the main window's size and position between launches.
 *
 * The bounds are stored as a small JSON file in app.getPath('userData'). On
 * load they are validated: bad or missing values fall back to the defaults,
 * the size is clamped to the minimum and to the display, and a saved
 * position is only reused if the window's title bar would land on a display
 * that is connected now (otherwise Electron centres the window).
 *
 * The functions here take plain data (display work areas, file paths) and
 * never import Electron, so they can be unit tested with Vitest.
 */
const fs = require('fs');
const path = require('path');

const WINDOW_STATE_FILE = 'window-state.json';

const DEFAULT_SIZE = { width: 1400, height: 900 };
const MIN_SIZE = { width: 800, height: 600 };

/** Height of the strip at the top of the window treated as the title bar. */
const TITLE_BAR_HEIGHT = 32;
/** How much of the title bar must be on a display for it to count as visible. */
const MIN_VISIBLE_WIDTH = 100;
const MIN_VISIBLE_HEIGHT = 16;

/**
 * @typedef {{ x: number, y: number, width: number, height: number }} Rect
 * @typedef {{ width: number, height: number, x?: number, y?: number, isMaximized: boolean }} WindowState
 */

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** @param {Rect} a @param {Rect} b */
function intersect(a, b) {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const width = Math.min(a.x + a.width, b.x + b.width) - x;
  const height = Math.min(a.y + a.height, b.y + b.height) - y;
  return { width: Math.max(0, width), height: Math.max(0, height) };
}

function isValidArea(area) {
  return (
    area &&
    isNumber(area.x) &&
    isNumber(area.y) &&
    isNumber(area.width) &&
    isNumber(area.height) &&
    area.width > 0 &&
    area.height > 0
  );
}

/**
 * The work area that shows enough of the window's title bar for the user to
 * grab it, or null if none does.
 *
 * @param {Rect} bounds
 * @param {Rect[]} workAreas
 * @returns {Rect | null}
 */
function findVisibleWorkArea(bounds, workAreas) {
  const titleBar = { x: bounds.x, y: bounds.y, width: bounds.width, height: TITLE_BAR_HEIGHT };
  const needWidth = Math.min(MIN_VISIBLE_WIDTH, bounds.width);
  let best = null;
  let bestWidth = 0;
  for (const area of workAreas) {
    if (!isValidArea(area)) continue;
    // The top edge itself must be on screen: a title bar above the top of
    // the work area cannot be dragged back down.
    if (bounds.y < area.y || bounds.y > area.y + area.height - MIN_VISIBLE_HEIGHT) continue;
    const overlap = intersect(titleBar, area);
    if (overlap.width >= needWidth && overlap.height >= MIN_VISIBLE_HEIGHT && overlap.width > bestWidth) {
      best = area;
      bestWidth = overlap.width;
    }
  }
  return best;
}

function clampSize(value, min, max) {
  const upper = isNumber(max) ? Math.max(min, max) : Infinity;
  return Math.round(Math.min(Math.max(value, min), upper));
}

/**
 * Turn whatever was read from disk into safe BrowserWindow bounds.
 *
 * @param {unknown} raw Parsed JSON (may be anything).
 * @param {Rect[]} workAreas Work areas of the connected displays, primary first.
 * @param {{ defaults?: {width:number,height:number}, min?: {width:number,height:number} }} [options]
 * @returns {WindowState}
 */
function sanitizeWindowState(raw, workAreas, options = {}) {
  const defaults = options.defaults ?? DEFAULT_SIZE;
  const min = options.min ?? MIN_SIZE;
  const areas = Array.isArray(workAreas) ? workAreas.filter(isValidArea) : [];
  const primary = areas[0];

  const state = raw && typeof raw === 'object' ? /** @type {Record<string, unknown>} */ (raw) : {};
  const hasSize = isNumber(state.width) && isNumber(state.height) && state.width > 0 && state.height > 0;
  const width = hasSize ? /** @type {number} */ (state.width) : defaults.width;
  const height = hasSize ? /** @type {number} */ (state.height) : defaults.height;
  const isMaximized = state.isMaximized === true;

  if (hasSize && isNumber(state.x) && isNumber(state.y)) {
    const bounds = {
      x: Math.round(/** @type {number} */ (state.x)),
      y: Math.round(/** @type {number} */ (state.y)),
      width: Math.max(Math.round(width), min.width),
      height: Math.max(Math.round(height), min.height),
    };
    const area = findVisibleWorkArea(bounds, areas);
    if (area) {
      // Fit the window on that display so no part of it is stranded off-screen.
      const fitWidth = clampSize(bounds.width, min.width, area.width);
      const fitHeight = clampSize(bounds.height, min.height, area.height);
      const x = Math.max(area.x, Math.min(bounds.x, area.x + area.width - fitWidth));
      const y = Math.max(area.y, Math.min(bounds.y, area.y + area.height - fitHeight));
      return { x, y, width: fitWidth, height: fitHeight, isMaximized };
    }
  }

  // No usable position: let Electron centre the window on the primary display.
  return {
    width: clampSize(width, min.width, primary?.width),
    height: clampSize(height, min.height, primary?.height),
    isMaximized: hasSize && isMaximized,
  };
}

/** Read and validate the saved state. Missing or corrupt files give defaults. */
function loadWindowState(filePath, workAreas, options) {
  let raw = null;
  try {
    raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    raw = null;
  }
  return sanitizeWindowState(raw, workAreas, options);
}

/** Write the state atomically (temp file + rename). Failures are ignored. */
function saveWindowState(filePath, state) {
  const tmpPath = `${filePath}.tmp`;
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(tmpPath, JSON.stringify(state), 'utf8');
    fs.renameSync(tmpPath, filePath);
  } catch {
    try {
      fs.rmSync(tmpPath, { force: true });
    } catch {
      // nothing else to clean up
    }
  }
}

/**
 * The state worth saving for a BrowserWindow: its normal (un-maximised)
 * bounds plus whether it is maximised.
 *
 * @param {{ getNormalBounds(): Rect, isMaximized(): boolean }} win
 */
function captureWindowState(win) {
  const { x, y, width, height } = win.getNormalBounds();
  return { x, y, width, height, isMaximized: win.isMaximized() };
}

module.exports = {
  WINDOW_STATE_FILE,
  DEFAULT_SIZE,
  MIN_SIZE,
  findVisibleWorkArea,
  sanitizeWindowState,
  loadWindowState,
  saveWindowState,
  captureWindowState,
};
