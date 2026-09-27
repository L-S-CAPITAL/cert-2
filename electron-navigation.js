const path = require('path');
const { pathToFileURL } = require('url');

function originOf(url) {
  try {
    const origin = new URL(url).origin;
    return origin && origin !== 'null' ? origin : null;
  } catch {
    return null;
  }
}

/**
 * Build the navigation allow-list used by will-navigate / will-redirect.
 *
 * - DevTools front-end URLs are allowed.
 * - The Vite dev server is allowed only when the app is NOT packaged, and
 *   only on an exact origin match (scheme + host + port), so look-alike
 *   hosts such as http://localhost:5173.evil.test are rejected.
 * - file:// URLs are allowed only inside <appDir>/dist after URL
 *   normalisation (so "dist/../secret" is rejected).
 *
 * @param {{ devServerUrl?: string, isPackaged: boolean, appDir: string }} options
 * @returns {(url: string) => boolean}
 */
function createUrlGuard({ devServerUrl, isPackaged, appDir }) {
  const devOrigin = !isPackaged && devServerUrl ? originOf(devServerUrl) : null;
  const distIndex = pathToFileURL(path.join(appDir, 'dist', 'index.html')).href;
  const distPrefix = `${pathToFileURL(path.join(appDir, 'dist')).href}/`;

  return function isAllowedUrl(url) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    if (parsed.protocol === 'devtools:' || parsed.protocol === 'chrome-devtools:') {
      return true;
    }
    if (devOrigin && parsed.origin === devOrigin) {
      return true;
    }
    if (parsed.protocol === 'file:') {
      parsed.hash = '';
      parsed.search = '';
      return parsed.href === distIndex || parsed.href.startsWith(distPrefix);
    }
    return false;
  };
}

module.exports = { createUrlGuard };
