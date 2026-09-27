import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import navigation from './electron-navigation.js';

const { createUrlGuard } = navigation;
const appDir = path.resolve('/opt/electrotech/resources/app.asar');
const file = (...parts) => pathToFileURL(path.join(appDir, ...parts)).href;

describe('createUrlGuard', () => {
  const dev = createUrlGuard({
    devServerUrl: 'http://localhost:5173',
    isPackaged: false,
    appDir,
  });
  const packaged = createUrlGuard({
    devServerUrl: 'http://localhost:5173',
    isPackaged: true,
    appDir,
  });

  it('allows the dev server only on an exact origin match', () => {
    expect(dev('http://localhost:5173/')).toBe(true);
    expect(dev('http://localhost:5173/src/main.tsx?t=1')).toBe(true);
    expect(dev('http://localhost:5173.evil.test/')).toBe(false);
    expect(dev('http://localhost:51730/')).toBe(false);
    expect(dev('https://localhost:5173/')).toBe(false);
    expect(dev('http://127.0.0.1:5173/')).toBe(false);
    expect(dev('http://localhost:5173@evil.test/')).toBe(false);
  });

  it('never allows the dev server origin in a packaged app', () => {
    expect(packaged('http://localhost:5173/')).toBe(false);
  });

  it('allows files inside dist only', () => {
    for (const guard of [dev, packaged]) {
      expect(guard(file('dist', 'index.html'))).toBe(true);
      expect(guard(`${file('dist', 'index.html')}#units`)).toBe(true);
      expect(guard(file('dist', 'assets', 'index.js'))).toBe(true);
      expect(guard(file('electron-main.js'))).toBe(false);
      expect(guard(`${file('dist')}/../electron-main.js`)).toBe(false);
      expect(guard(file('dist-evil', 'index.html'))).toBe(false);
    }
  });

  it('rejects remote and malformed URLs, allows DevTools', () => {
    expect(packaged('https://example.com/')).toBe(false);
    expect(packaged('javascript:alert(1)')).toBe(false);
    expect(packaged('not a url')).toBe(false);
    expect(packaged('devtools://devtools/bundled/inspector.html')).toBe(true);
  });
});
