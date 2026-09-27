import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Content-Security-Policy for the packaged renderer.
 *
 * The packaged app loads dist/index.html over file:// via loadFile, where
 * session.webRequest.onHeadersReceived never runs, so the policy has to ship
 * as a <meta http-equiv> tag. It is injected only into production builds:
 * Vite dev needs inline scripts and the ws://localhost:5173 HMR socket, and
 * gets its (looser) policy from the response header set in electron-main.js.
 * frame-ancestors is ignored in a meta policy, so it is omitted here.
 */
const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

function productionCsp(): Plugin {
  return {
    name: 'electrotech-production-csp',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: PRODUCTION_CSP,
          },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), productionCsp()],
  server: {
    // Electron's dev script waits on and loads exactly this port; fail fast
    // instead of silently moving to 5174 when it is taken.
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    // Vite 8 bundles with Rolldown: rollupOptions is now rolldownOptions and
    // the object form of manualChunks is gone. Keep React in its own
    // long-lived "vendor" chunk, as before.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    // Let tests read the stylesheet (?raw) for the theme contrast checks.
    css: { include: [/terminal\.css/] },
  },
});
