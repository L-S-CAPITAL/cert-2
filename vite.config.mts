import { defineConfig, type Plugin } from 'vitest/config';
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
