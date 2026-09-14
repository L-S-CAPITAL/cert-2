<div align="center">

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ███████╗██╗     ███████╗ ██████╗████████╗██████╗  ██████╗      ║
║   ██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗     ║
║   █████╗  ██║     █████╗  ██║        ██║   ██████╔╝██║   ██║     ║
║   ██╔══╝  ██║     ██╔══╝  ██║        ██║   ██╔══██╗██║   ██║     ║
║   ███████╗███████╗███████╗╚██████╗   ██║   ██║  ██║╚██████╔╝     ║
║   ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝      ║
║                                                                  ║
║              T E C H     T E R M I N A L                         ║
║                                                                  ║
║     UEE22020  ·  Certificate II in Electrotechnology             ║
║                  Career Start  ·  TAFE Queensland                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

# ElectroTech Terminal

**A Bloomberg-style desktop learning terminal for UEE22020.**

Core units. Electives. Topic quizzes. Foundational trade mathematics.  
Algebra, geometry, and blueprint literacy. A local study timer.  
Progress never leaves this machine.

[![Electron](https://img.shields.io/badge/Electron-30-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Privacy](https://img.shields.io/badge/data-localStorage%20only-111111?style=flat-square)](#privacy--progress)

<br />

[Quick start](#quick-start) ·
[What it is](#what-it-is) ·
[Curriculum](#curriculum) ·
[Terminal map](#terminal-map) ·
[Shortcuts](#keyboard) ·
[Architecture](#architecture) ·
[Build](#package-a-desktop-build)

</div>

---

## What it is

ElectroTech Terminal is a **keyboard-first, offline desktop app** that treats Certificate II study the way a trading floor treats a market: one dark screen, dense information, instant navigation, and a running clock.

It is a **study companion**, not a registered training organisation and not a substitute for TAFE Queensland assessment, workplace evidence, or a White Card issued by an approved provider. Content is written against the **UEE22020 Certificate II in Electrotechnology (Career Start)** packaging — eight core units plus a selected elective set — and four extra “strand” panels that drill the mathematics, notation, geometry, and drawing literacy the trade actually uses on day one.

| Designed for | Not designed for |
|---|---|
| Apprentices and career-start students who want a single pane of glass | Official competency assessment or RPL evidence |
| Rapid revision of WHS, circuits, components, and drawings | Live-work instruction or licence practice |
| Timed drills and topic quizzes with local progress | Cloud LMS, accounts, or multi-device sync |
| Quiet, private study on a laptop | Collecting personal data |

Provider context in the app header: **TAFE Queensland**. Course homepage referenced in `package.json`:

https://tafeqld.edu.au/course/17/17886/certificate-ii-in-electrotechnology-career-start

---

## Why a terminal

Most study apps look like a brochure. This one looks like a **workstation**.

- Dark phosphor palette, monospaced labels, amber highlights, status bar at the foot of the screen.
- Eight numbered panels, same muscle memory as a Bloomberg function key row.
- A persistent **TIMER** rail so study time is attributed to a unit, not guessed later.
- Quizzes that actually close the loop: **100% on a topic quiz marks that topic complete**.
- Prerequisite gates so you cannot skip past `UEECD0007` into units that depend on it.
- Export / import / reset of progress as a single JSON file — useful when a machine is wiped or a trainer wants a snapshot.

If you already live in a workshop, a switchroom, or a code editor, the UI should feel like a tool, not a course portal.

---

## Feature set

### Course spine

- **8 core units** (140 packaged core points in-app) with topics, key points, and quizzes.
- **4 electives** covering multi-path circuits, drawings & standards, fixing/securing, and documentation.
- Prerequisite unlocking via unit codes (`src/data/prerequisites.ts`).
- Course overview with points, topic counts, career outcomes, and a live completion bar.

### Strand panels (beyond the packaged units)

| Panel | What you work |
|---|---|
| **Foundational Trade Mathematics** | Fractions & decimals, mixed-number arithmetic, BODMAS, trade percentages, timed speed drill, flashcards |
| **Scientific Notation, Prefixes & Algebra** | SI prefixes, scientific notation, Ohm’s law rearrangements, algebraic substitution |
| **Geometry, Physics & Hand Tools** | Pythagoras, SOH CAH TOA, trade physics analogies, common hand tools |
| **Technical Documents & Blueprints** | Schematics vs wiring diagrams, residential plans, single-line diagrams, schedules |

Modules mix **tutorials**, **worked examples**, **reference tables**, **flashcards**, and **timed drills**. Drill pass rules live on the module (default speed drill: 10 minutes, mixed paper, ≥70% of answered with a minimum answered count).

### Study operations

- Select a unit (core, elective, or strand) and press **`s`** to start or stop the timer.
- Session log records unit, optional topic, duration, and ISO timestamp.
- Logs are capped (`MAX_SESSION_LOGS` in the persist layer) so `localStorage` cannot grow without bound.
- Active session is stopped on window unload so a crashed close still writes time.

### Safety of the runtime

Packaged Electron is locked down on purpose:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Strict **Content-Security-Policy** (dev CSP allows the Vite HMR websocket; prod does not)
- Navigation and `window.open` denied except the local dist tree / dev server
- Preload exposes a **read-only** `window.electrotech` bridge (`platform` + version strings) — no file system, no Node
- Single-instance lock so a second launch focuses the existing window

---

## Curriculum

Figures below are **what this terminal ships**, not a claim about every possible UEE22020 packaging a provider may offer. Elective points required by the qualification packaging in-app metadata: **220**. Electives included here total **120** points — enough to study the selected units, not a complete elective menu.

### Core — 8 units

| Code | Unit | Pts | Gate |
|---|---|---|---|
| `CPCCWHS1001` | Prepare to work safely in the construction industry | 20 | — |
| `UEECD0007` | Apply work health and safety regulations, codes and practices in the workplace | 20 | — |
| `UEECD0009` | Carry out routine work activities in an energy sector environment | 15 | `UEECD0007` |
| `UEECD0021` | Identify and select components, accessories and materials for energy sector work activities | 15 | `UEECD0007`, `UEECD0009` |
| `UEECD0038` | Provide solutions and report on routine electrotechnology problems | 20 | see unit record |
| `UEECD0046` | Solve problems in single path circuits | 20 | see unit record |
| `UEECD0052` | Use routine equipment/plant/technologies in an energy sector environment | 15 | see unit record |
| `UEERE0021` | Provide basic sustainable energy solutions for energy reduction in residential premises | 15 | see unit record |

Typical topic coverage inside the cores includes WHS legislation and the PCBU duty, PPE and the hierarchy of controls, LOTO and test-for-dead, electrical risk and first response, energy-sector documentation and toolbox talks, component ratings and AS/NZS 3008 cable selection, protective devices, single-path circuit theory, and basic sustainable-energy measures.

### Electives — 4 units

| Code | Unit | Pts | Gate |
|---|---|---|---|
| `UEECD0044` | Solve problems in multiple path circuits | 40 | `UEECD0007` |
| `UEECD0051` | Use drawings, diagrams, schedules, standards, codes and specifications | 40 | `UEECD0007` |
| `UEECD0020` | Fix and secure electrotechnology equipment | 20 | `UEECD0007` |
| `UEECO0002` | Maintain documentation | 20 | — |

### Career outcomes (as shown in Course Overview)

- Trades Assistant
- Electrotechnology Apprentice

Industry demand figure carried in course metadata: on the order of **26,000** openings over a five-year window (provider-facing statistic, not a forecast from this repo).

---

## Terminal map

Eight tabs. Keys `1`–`8`. The TIMER pane stays visible on the right.

```
┌──────────────────────────────── ElectroTech Terminal ────────────────────────────────┐
│  UEE22020  ·  Certificate II in Electrotechnology (Career Start)  ·  TAFE Queensland │
├──────┬───────┬─────────────┬─────────────────┬────────┬─────────┬─────────┬──────────┤
│ 1    │ 2     │ 3           │ 4               │ 5      │ 6       │ 7       │ 8        │
│ DASH │ UNITS │ LOG         │ INFO            │ MATH   │ ALG     │ GEO     │ DWG      │
├──────┴───────┴─────────────┴─────────────────┴────────┴─────────┴─────────┴──────────┤
│  MAIN PANEL                                              │  TIMER                    │
│  dashboard / units / sessions / overview / strand        │  select unit · start/stop │
│                                                          │  live elapsed · totals    │
├──────────────────────────────────────────────────────────┴───────────────────────────┤
│  STATUS BAR · completion · clock · environment                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

| Key | Panel | You use it to |
|---|---|---|
| `1` | **Dashboard** | Glance completion, hot units, where to resume |
| `2` | **Units** | Expand core and elective units, read topics, sit quizzes, mark complete |
| `3` | **Session Log** | Audit timed study against unit / topic |
| `4` | **Course Overview** | Points, outcomes, unit table, **export / import / reset** |
| `5` | **Foundational Trade Mathematics** | Tutorials, flashcards, 10-minute speed drill |
| `6` | **Scientific Notation, Prefixes & Algebra** | Notation, SI prefixes, Ohm’s law, algebra |
| `7` | **Geometry, Physics & Hand Tools** | Right triangles, trig, physics analogy, tools |
| `8` | **Technical Documents & Blueprints** | Schematics, plans, SLDs, schedules |

Press **`?`** anywhere (outside a form field) for the in-app keyboard card. **`Esc`** closes dialogs.

---

## Quick start

### Requirements

- **Node.js 18+**
- **npm 9+**
- A desktop OS Electron can run on (Linux, macOS, Windows)

### Install and run

```bash
git clone https://github.com/L-S-CAPITAL/cert-2.git
cd cert-2
npm install

# If Electron’s binary is missing (install scripts blocked by policy):
node node_modules/electron/install.js

npm test
npm run dev
```

`npm run dev` starts **Vite on `http://localhost:5173`** and **Electron** together via `concurrently`. Electron loads that URL through `VITE_DEV_SERVER_URL`.

```bash
# Detached DevTools
ELECTRON_OPEN_DEVTOOLS=1 npm run dev

# Renderer only (browser, no Electron chrome)
npm run dev:renderer
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite + Electron, hot reload |
| `npm run dev:renderer` | Vite only |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest watch |
| `npm run build:renderer` | `tsc --noEmit` + Vite (`base: './'` for `file://`) |
| `npm run pack` | Unpacked app under `release/` |
| `npm run dist` | Platform installer (Linux: AppImage + deb; Windows: NSIS; macOS: education category) |
| `npm run preview` | Vite preview of the built renderer |

---

## Package a desktop build

```bash
npm run build:renderer   # typecheck + Vite with relative asset paths
npm run pack             # unpacked directory in release/
npm run dist             # installers
```

The packaged app loads `dist/index.html` with `loadFile`. Production CSP is tight (`script-src 'self'`, no eval, no remote connect). `afterPack` runs `scripts/afterPack.js` (Electron fuses). Output directory: **`release/`**.

App identity from `package.json`:

| Field | Value |
|---|---|
| npm name | `electrotech-terminal` |
| product name | ElectroTech Terminal |
| appId | `com.electrotech.terminal` |
| version | `1.0.0` |

---

## Privacy & progress

There is **no account, no backend, and no telemetry**.

| Fact | Detail |
|---|---|
| Storage | Browser `localStorage` on this machine |
| Shape | Validated / sanitised on read (`src/stores/persist.ts`) |
| Contents | Topic completions, session logs, accumulated seconds |
| Runtime-only | Active timer start stamp — not written until the session stops |
| Export | Course Overview → **Export** → `electrotech-progress.json` |
| Import | Same panel; invalid JSON is rejected |
| Reset | Confirmed destructive wipe of completions, logs, and time |

Treat the export file as study notes, not credentials. If you share a machine, export then reset.

---

## Keyboard

Shortcuts are ignored while focus is in an input, select, textarea, or contenteditable field.

| Key | Action |
|---|---|
| `1` | Dashboard |
| `2` | Core / elective units |
| `3` | Session log |
| `4` | Course overview |
| `5` | Foundational Trade Mathematics |
| `6` | Scientific Notation, Prefixes & Algebra |
| `7` | Geometry, Physics & Hand Tools |
| `8` | Technical Documents & Blueprints |
| `s` | Start or stop the study timer (a unit must be selected) |
| `?` | Help |
| `Esc` | Close dialogs |

---

## Architecture

Thin Electron shell. Fat, typed renderer. Content as data.

```
cert-2/
├── electron-main.js          # window, CSP, navigation allow-list, single-instance
├── electron-preload.js       # contextBridge → window.electrotech (read-only)
├── index.html
├── icon.png
├── vite.config.ts            # React plugin, base: './'
├── tsconfig.json
├── scripts/afterPack.js      # Electron fuses after pack
├── docs/superpowers/plans/   # hardening notes (seven-slice plan)
└── src/
    ├── main.tsx
    ├── App.tsx               # tabs, shortcuts, timer rail
    ├── types.ts              # Unit, Topic, Progress, MathModule, …
    ├── styles/terminal.css   # phosphor terminal chrome
    ├── stores/
    │   ├── persist.ts        # load / save / sanitise / cap logs
    │   └── progress.ts       # useSyncExternalStore store
    ├── data/
    │   ├── course.ts         # COURSE_INFO + CORE_UNITS + ALL_UNITS
    │   ├── electives.ts
    │   ├── quizzes.ts        # extra topic quizzes merged into units
    │   ├── prerequisites.ts
    │   ├── math.ts           # foundational modules + drill bank
    │   ├── algebra.ts
    │   ├── geometry.ts
    │   ├── blueprints.ts
    │   └── drill.ts          # paper builder, scoring, unlock helpers
    └── components/           # Dashboard, UnitPanel, quizzes, strands, chrome
```

### Data model (abridged)

```ts
type UnitKind = 'core' | 'elective';

interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  quizQuestions?: QuizQuestion[];
}

interface Unit {
  id: string;
  code: string;
  name: string;
  description: string;
  prerequisites: string[];   // unit codes, not ids
  points: number;
  topics: Topic[];
  kind?: UnitKind;
}
```

Strand content uses `MathModule` (`tutorial` | `drill` | `flashcards` | `guide`) with worked examples, optional tables, flashcards, and drill banks.

### Progress store

`createProgressStore(storage)` is a tiny external store:

- `subscribe` / `getState` consumed by React through `useSyncExternalStore`
- Completions are `Record<unitId, Record<topicId, boolean>>`
- `startSession` / `startTopicSession` / `stopSession`
- `markTopicComplete` on a perfect quiz
- `exportProgress` / `importProgress` / `reset` with sanitisation

Tests live beside the modules they cover: `*.test.ts` under `src/data/` and `src/stores/`.

### Security posture (packaged)

| Control | Setting |
|---|---|
| Context isolation | on |
| Node in renderer | off |
| Sandbox | on |
| Preload surface | `platform`, `versions` only |
| CSP (prod) | `default-src 'self'`; no remote connect; no object |
| New windows | denied |
| Off-tree navigation | prevented |
| Vite base | `./` so `file://` assets resolve |

---

## How to study with it

A practical loop that matches how the app is wired:

1. Open **Dashboard** (`1`). See what is incomplete.
2. Move to **Units** (`2`). Expand a unit. Read the topic. Hit the key points.
3. Sit the quiz. A full score completes the topic; anything less leaves it open.
4. Select that unit in the TIMER rail and press **`s`**. Work. Press **`s`** again.
5. When the theory is soft, switch to **MATH** (`5`) and run the speed drill cold.
6. Before a drawings or circuits class, warm up on **ALG** / **GEO** / **DWG**.
7. Once a week, **Export** from Course Overview so a disk failure is not a term of lost ticks.

Prerequisite units must be fully topic-complete before dependents unlock. That is intentional — it mirrors the packaging notes on units such as `UEECD0009` and `UEECD0021`.

---

## Accessibility

The hardening pass wired the chrome for keyboard and AT use:

- Tabs expose `role="tablist"` / `tab` / `tabpanel` with `aria-selected` and `aria-controls`
- Help and quizzes are dialogs; `Esc` dismisses
- Progress bars carry `role="progressbar"` and value attributes
- Contrast and focus treatment live in `src/styles/terminal.css`
- Shortcuts skip form fields so typing an answer does not change tabs

Further contrast or screen-reader work should start in the CSS custom properties and the modal components, not by adding an icon library — **lucide-react is intentionally unused**.

---

## Testing

```bash
npm test
```

Coverage is unit-level and biased toward the parts that must not silently corrupt a student’s year:

- Course / elective / strand data shape
- Prerequisite unlock logic
- Persist sanitisation and log cap
- Progress mutations (complete, import, reset, session accounting)
- Algebra / geometry / blueprint module invariants

Add a test next to the file you change. Prefer Vitest + jsdom; do not stand up Electron for data tests.

---

## Disclaimer

ElectroTech Terminal is an **unofficial learning aid**.

- It is **not** issued by TAFE Queensland, the Australian Skills Quality Authority, or a state electrical safety office.
- It does **not** confer a White Card, an electrical licence, or competency in UEE22020.
- Circuit, WHS, and standards notes are study prompts. On a live site, the current **AS/NZS 3000**, the **Electrical Safety Act** in your jurisdiction, the PCBU’s procedures, and a licensed supervisor win every argument.
- Do not treat quiz distractors as a complete hazard register. Do not work live from this app.

If a unit code, point value, or prerequisite in this repo disagrees with your training package or your provider’s delivery plan, **your provider is the source of truth**.

---

## Contributing

The original hardening scope is recorded in:

[`docs/superpowers/plans/2026-09-08-seven-slice-hardening.md`](docs/superpowers/plans/2026-09-08-seven-slice-hardening.md)

House rules from that plan still apply:

- Stay on **React 18** (do not jump to 19; keep `@types/react` on 18)
- Do not add `lucide-react`
- Keep Electron thin; keep content in `src/data/*`
- Preserve `base: './'`, isolation, sandbox, and CSP
- New quizzes belong in the topic or in `src/data/quizzes.ts`, then wire completion through the existing quiz modal

Useful first contributions: more worked examples, extra drill-bank items with a `skill` tag, missing quizzes on topics that still have none, and pack smoke-tests on Windows / macOS.

---

## Licence

No licence file is published on the repository at the time of writing. Treat the code as proprietary to **L-S-CAPITAL** until a `LICENSE` is added. Do not assume MIT or Apache rights.

---

<div align="center">

**Study the circuit. Log the hours. Leave the machine.**

`UEE22020` · ElectroTech Terminal · local-only progress

<br />

<sub>Built with Electron 30 · React 18 · TypeScript 5 · Vite 5 · Vitest 2</sub>

</div>
