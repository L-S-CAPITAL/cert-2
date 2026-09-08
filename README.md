# ElectroTech Terminal

Bloomberg-style desktop learning terminal for **UEE22020 Certificate II in Electrotechnology (Career Start)**.

Core units, electives, topic quizzes, Foundational Trade Mathematics, and a local study timer. Progress is stored on this machine only (`localStorage`).

## Requirements

- Node.js 18+
- npm 9+

## Develop

```bash
npm install
# If Electron’s binary is missing (install scripts blocked):
node node_modules/electron/install.js
npm test
npm run dev
```

`npm run dev` starts Vite on `http://localhost:5173` and Electron together. Electron loads that URL via `VITE_DEV_SERVER_URL`. To open DevTools:

```bash
ELECTRON_OPEN_DEVTOOLS=1 npm run dev
```

Renderer-only:

```bash
npm run dev:renderer
```

## Build a desktop package

```bash
npm run build:renderer   # typecheck + Vite (relative asset paths)
npm run pack             # unpacked dir in release/
npm run dist             # AppImage + deb
```

The packaged app loads `dist/index.html` with `loadFile` and a strict CSP. Preload runs sandboxed with `contextIsolation`.

## Keyboard

| Key | Action |
|-----|--------|
| `1`–`8` | Dashboard … Geometry & Tools, Technical Documents & Blueprints |
| `s` | Start/stop timer (unit must be selected) |
| `?` | Help |
| `Esc` | Close dialogs |

Export, import, and reset progress from **Course Overview**.

## Layout

- `electron-main.js` / `electron-preload.js` — window, CSP, `window.electrotech`
- `src/stores/progress.ts` — validated progress store
- `src/data/course.ts` — core units; `electives.ts` / `quizzes.ts` fill the rest
- `src/data/math.ts` — Foundational Trade Mathematics modules
- `src/data/algebra.ts` — Scientific notation, prefixes, Ohm’s law, algebra
- `src/data/geometry.ts` — Pythagoras, SOH CAH TOA, physics analogy, hand tools
- `src/data/blueprints.ts` — Schematics, residential plans, SLDs, schedules
