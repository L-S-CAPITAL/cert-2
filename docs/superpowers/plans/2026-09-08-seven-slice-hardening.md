# ElectroTech Terminal Seven-Slice Hardening

> **For agentic workers:** Execute inline in this session. Slices 1–7 from the review. Do not expand scope past this list.

**Goal:** Make the packaged app boot, lock down Electron, fix the review bugs, and fill the product gaps (store, a11y, electives, quizzes, tests, README).

**Architecture:** Keep the Vite renderer + thin Electron main/preload. Progress lives in a validated `localStorage` store consumed via `useSyncExternalStore`. Preload exposes a read-only `window.electrotech` bridge only.

**Tech Stack:** Electron 30, Vite 5, React 18, TypeScript 5, Vitest.

## Global Constraints

- React 18 (do not upgrade to 19); pin `@types/react` to 18
- `lucide-react` is not used here; do not add it
- No shared imports from other home-directory projects
- Do not touch `~/.grok/`
- `base: './'` for file:// packaging
- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`

## File map

- Create: `src/stores/persist.ts`, `src/stores/persist.test.ts`, `src/stores/progress.test.ts`, `src/data/prerequisites.ts`, `src/data/prerequisites.test.ts`, `src/data/electives.ts`, `src/data/quizzes.ts`, `src/components/ErrorBoundary.tsx`, `src/components/HelpModal.tsx`, `src/vite-env.d.ts`, `icon.png`, `.gitignore`, `README.md`
- Modify: `electron-main.js`, `electron-preload.js`, `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/types.ts`, `src/stores/progress.ts`, `src/data/course.ts`, `src/App.tsx`, `src/main.tsx`, all `src/components/*`, `src/styles/terminal.css`

## Slices

1. Packaging + `npm run dev` (relative Vite base, `loadFile`, concurrently, `VITE_DEV_SERVER_URL`, preload+icon in `files`)
2. Electron security (isolation, sandbox, CSP, navigation deny, real preload)
3. UI bugs (status text, click bubbling, timer CSS, persist-safe timer, active-unit label, empty state, topic on logs)
4. Quiz 100% → `markTopicComplete`; empty-quiz guard
5. A11y + contrast + dialog + focus
6. Store (`useSyncExternalStore`, validate, cap logs, reset/export UI) + TS hygiene
7. Electives, remaining quizzes, content fixes, README, gitignore, icon, tests, fuses, error boundary, keyboard help
