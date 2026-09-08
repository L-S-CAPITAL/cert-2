import { DrillItem, Flashcard, MathModule, Unit } from '../types';
import { isModuleUnlocked, makeDrillPaper } from './drill';

export const SERIES_PARALLEL = `
SERIES (single loop)              PARALLEL (multi-branch)
L -- fuse -- A -- B -- N          L -- fuse --+-- A --+-- N
              (one path)                      +-- B --+
                                              (two paths)

Series: same I through A and B; voltages add.
Parallel: same V across A and B; currents add.
`.trim();

export const RESIDENTIAL_PLAN = `
        N
   +----|----+----+
   |  SA     |  o |   SA = smoke alarm (interconnected)
 W |  [L]    S  G2| E  [L] = ceiling light
   |         |    |    S  = one-way light switch
   |  G2     |    |    G2 = double GPO
   +----+----|----+    scale: 1 square = 0.5 m (example)
        S

Typical bedroom/living fragment. Dimensions come from the
stated scale on the title block — never guess millimetres
from a printout without the scale bar.
`.trim();

export const SLD_TRACE = `
MEN / incoming 400/230 V
        |
   [MSB]  main switchboard  (3-ph bus L1 L2 L3 N E)
        |
        +-- DB-1  (lighting / GPOs  — sub-board A)
        |
        +-- DB-2  (mechanical / HVAC — sub-board B)
        |
        +-- DB-3  (essential / fire  — sub-board C)

Each outgoing line is a protective device + cable to that
sub-board. Final circuits leave the sub-board, not the MSB,
unless they are marked as MSB local.
`.trim();

export const OFFSHEET = `
Sheet E-103, grid C4 shows a feeder leaving the page:

    ──/── (TO SHEET E-104  [REF: 104-A2])

On E-104, look at grid A2 for the matching inbound tag:

    (FROM SHEET E-103  [REF: 103-C4]) ──/──

Same circuit. Two pages. Follow the pair, not the doodle.
`.trim();

export const SYMBOL_TABLE = [
  ['GPO (single)', '○ or circle-G', 'General purpose outlet 10 A typical'],
  ['GPO (double)', 'G2 / twin outlet', 'Two sockets, usually one circuit'],
  ['Lighting point', '○ with + or [L]', 'Ceiling/wall luminaire'],
  ['One-way switch', 'S', 'Single pole, one location'],
  ['Two-way switch', 'S2', 'Two locations, one lighting point'],
  ['Smoke alarm', 'SA', 'Interconnected 240 V + battery typical'],
  ['Distribution board', 'DB / rectangle', 'Final-circuit origin'],
] as const;

export const SAMPLE_SCHEDULES = [
  {
    code: 'DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO)',
    meaning:
      'Board DB-1A, chassis/section 1, circuit 3. Cable 2.5 mm² TPS. Protection 16 A RCBO.',
  },
  {
    code: 'MSB / Sub-DB-2 / Feeder (4C+E 16mm2 / 63A MCCB)',
    meaning:
      'From the main board to sub-board DB-2. Four-core + earth 16 mm². 63 A MCCB.',
  },
  {
    code: 'DB-1B / Ckt-L4 (1.5mm2 TPS / 10A RCBO / lighting)',
    meaning:
      'Board DB-1B, lighting circuit L4. 1.5 mm² TPS. 10 A RCBO.',
  },
  {
    code: 'DB-2 / Ckt-P7 (2.5mm2 / 20A MCB / dedicated GPO)',
    meaning:
      'Board DB-2, power circuit P7. 2.5 mm². 20 A MCB (no residual-current in this string — check the drawing notes).',
  },
  {
    code: 'DB-3 / Ckt-F1 (fire / 2C+E 2.5mm2 / 16A / essential)',
    meaning:
      'Essential/fire board DB-3, circuit F1. 2C+E 2.5 mm², 16 A, essential supply.',
  },
];

export const REVIEW_BANK: DrillItem[] = [
  {
    skill: 'schematic',
    question: 'In a series loop, current through each load is:',
    options: ['Split by resistance', 'The same', 'Zero after the first load', 'Only in the last load'],
    correctAnswer: 1,
  },
  {
    skill: 'schematic',
    question: 'In a parallel circuit, voltage across each branch is:',
    options: ['Split in half', 'The supply voltage (same across branches)', 'Zero on open branches only', 'Always 12 V'],
    correctAnswer: 1,
  },
  {
    skill: 'blueprint',
    question: 'On an Australian residential electrical plan, G2 typically means:',
    options: ['Gas meter', 'Double GPO', 'Earth grid', 'Generator'],
    correctAnswer: 1,
  },
  {
    skill: 'blueprint',
    question: 'SA on a room layout is usually:',
    options: ['Switch A', 'Smoke alarm', 'Sub-antenna', 'Socket analogue'],
    correctAnswer: 1,
  },
  {
    skill: 'sld',
    question: 'On a commercial SLD, power normally flows:',
    options: [
      'From final GPOs up to the street',
      'From the main board down to sub-boards, then final circuits',
      'Only on the lighting page',
      'Alphabetically by room name',
    ],
    correctAnswer: 1,
  },
  {
    skill: 'offsheet',
    question: 'TO SHEET E-104 [REF: 104-A2] means continue on:',
    options: [
      'Sheet 104, any grid',
      'Sheet E-104, grid A2',
      'Sheet A2, grid 104',
      'The cover sheet only',
    ],
    correctAnswer: 1,
  },
  {
    skill: 'schedule',
    question: 'In DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO), 16A RCBO is the:',
    options: ['Cable size', 'Protective device', 'Room name', 'Switch height'],
    correctAnswer: 1,
  },
  {
    skill: 'schedule',
    question: '2.5mm2 TPS in a schedule line is the:',
    options: ['Breaker rating', 'Cable type and size', 'Board name', 'Phase colour'],
    correctAnswer: 1,
  },
  {
    skill: 'symbol',
    question: 'A lighting point on a domestic plan is commonly shown as:',
    options: ['A double rectangle', 'A circle with a cross / [L]', 'A triangle only', 'The letter R'],
    correctAnswer: 1,
  },
  {
    skill: 'schedule',
    question: 'MSB / Sub-DB-2 / Feeder describes:',
    options: [
      'A lighting point in a bedroom',
      'A supply from the main board to sub-board 2',
      'A smoke alarm circuit only',
      'An off-sheet connector grid',
    ],
    correctAnswer: 1,
  },
];

const HOME_CARDS: Flashcard[] = [
  {
    front: 'Walk the kitchen — what should you be able to point to?',
    back: 'Double GPOs at bench height, possibly a dedicated circuit for an oven/hotplate, a lighting point and its switch, and the nearest smoke alarm outside sleeping areas.',
  },
  {
    front: 'Bedroom — smoke alarm and lighting',
    back: 'Ceiling SA (interconnected), ceiling light, switch at the door on the handle side, GPO(s) on walls. Mentally draw the switch leg from S to [L].',
  },
  {
    front: 'Where does this circuit “start” on a drawing?',
    back: 'At a circuit breaker / RCBO on a board, not at the socket. The schedule line names that origin (DB / Ckt).',
  },
  {
    front: 'Two sockets in one room — series or parallel?',
    back: 'Final GPOs on one circuit are parallel branches off the same TPS, not a series loop through each appliance.',
  },
  {
    front: 'If you cannot find the board on the wall…',
    back: 'On a blueprint it is a DB rectangle with a schedule. In the house it is the meter box / load centre. Same object, two views.',
  },
];

export const BLUEPRINT_MODULES: MathModule[] = [
  {
    id: 'b1',
    order: 1,
    title: 'Circuit Schematics (Series vs. Parallel)',
    kind: 'tutorial',
    summary:
      'Sketch and compare a single-loop series circuit with a multi-branch parallel circuit.',
    concept:
      'A schematic shows electrical function, not the physical layout of a room.\n\nSeries: one path. Open any point and the whole loop dies. Current is the same through every load. Voltages add (V = V1 + V2). Christmas-tree lamps of the old type were series; a house is not.\n\nParallel: two or more branches from the same supply nodes. Each branch sees the supply voltage. Currents add (I = I1 + I2). Open one branch and the others stay alive. This is how GPOs and lights are arranged on a final circuit: many loads, one protective device, parallel connections.\n\nIf a drawing looks “in a line” along a wall, it can still be electrically parallel — follow the conductors, not the furniture.',
    whyItMatters:
      'Misreading series vs parallel is how people expect a second GPO to go dead when the first is off, or why they cannot see that a blown lamp should not kill the rest of the circuit. Every later blueprint is this idea with more symbols.',
    diagram: SERIES_PARALLEL,
    examples: [
      {
        title: 'Two heaters, series vs parallel',
        problem: 'Two identical heaters on 230 V. Compare connection.',
        steps: [
          'Series: each heater sees about 115 V; current is one value; if one opens, both stop.',
          'Parallel: each sees 230 V; currents add at the breaker; one open, the other still heats.',
          'Domestic fixed loads are paralleled, each with the full voltage.',
        ],
        answer: 'House loads are parallel, not series',
      },
      {
        title: 'Sketch check',
        problem: 'Does a string of GPOs along a skirting mean series?',
        steps: [
          'The TPS loop in the wall is a cable route, not a series of voltages.',
          'Each GPO taps L and N (and E) — that is a parallel branch.',
          'The schematic is a comb off L/N, not a daisy-chain of loads through the element.',
        ],
        answer: 'Skirting run ≠ series schematic',
      },
    ],
    keyPoints: [
      'Series: one path, same I, voltages add',
      'Parallel: branches, same V, currents add',
      'Final circuits in a dwelling are parallel',
      'Schematic = function; plan = position',
    ],
    quizQuestions: [
      {
        question: 'In a series loop the current in each load is:',
        options: ['Different in every load', 'The same', 'Zero after the first', 'Split equally always'],
        correctAnswer: 1,
      },
      {
        question: 'In a parallel circuit each branch voltage is:',
        options: ['Half the supply', 'The supply voltage', 'Added together', 'Undefined'],
        correctAnswer: 1,
      },
      {
        question: 'Domestic GPOs on one circuit are connected:',
        options: ['In series through each appliance', 'In parallel on L, N and E', 'Only on earth', 'Only at the meter'],
        correctAnswer: 1,
      },
      {
        question: 'A schematic is meant to show:',
        options: ['Furniture layout', 'Electrical function and connection', 'Paint colour', 'The scale bar only'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'b2',
    order: 2,
    title: 'Residential Blueprints',
    kind: 'tutorial',
    summary:
      'Read a residential room layout: smoke alarms, double GPOs, light switches, and scaled dimensions.',
    concept:
      'A lighting/power plan is a plan view of the building with electrical symbols overlaid. You are looking down through the ceiling.\n\nTypical marks (training set — always check the drawing legend):\n• G2 — double GPO\n• S — one-way switch, usually on the handle side of the door\n• [L] or a crossed circle — lighting point\n• SA — smoke alarm (interconnected with others)\n\nScale lives in the title block (e.g. 1:100). A 10 mm line on paper at 1:100 is 1000 mm (1 m) on site. Never scale from a photocopy without checking the bar.\n\nHeights (GPO typically 300 mm AFFL, switch 1000 mm AFFL, or as specified) are in notes or a typical detail, not always printed on every symbol.',
    whyItMatters:
      'This is the drawing you install from: where the socket actually goes, which wall the switch is on, whether a smoke alarm is in the corridor. Wrong wall = a callback. Wrong scale = a kitchen bench with no GPO.',
    diagram: RESIDENTIAL_PLAN,
    tables: [
      {
        title: 'Residential marks (check the legend)',
        headers: ['Mark', 'Meaning', 'Where you usually see it'],
        rows: SYMBOL_TABLE.filter((row) =>
          ['GPO (double)', 'Lighting point', 'One-way switch', 'Smoke alarm'].includes(
            row[0],
          ),
        ).map((row) => [row[0], row[1], row[2]]),
      },
    ],
    examples: [
      {
        title: 'Place the switch',
        problem: 'Door swings in from the east, handle on the south. Where is S?',
        steps: [
          'Switch on the handle side so a person hits S as they enter.',
          'On the plan, that is the south side of the east door.',
          'The switch leg then runs to [L] — electrically a switched active, not a mystery third colour until you read the spec.',
        ],
        answer: 'Handle side of the door, not the hinge side',
      },
      {
        title: 'Scale a dimension',
        problem: 'Scale 1:50. A GPO is 20 mm from a wall on the print. Site distance?',
        steps: [
          '1:50 means 1 mm on paper = 50 mm on site.',
          '20 mm × 50 = 1000 mm = 1.0 m off that wall.',
          'Confirm against a written dimension if one exists — written wins over scaling.',
        ],
        answer: '1.0 m (written dimensions override scaling)',
      },
    ],
    keyPoints: [
      'G2 = double GPO, S = switch, [L] = light, SA = smoke alarm',
      'Read the legend; symbols vary by office',
      'Scale from the title block / bar; written dims win',
      'Switch on the handle side of the door',
    ],
    quizQuestions: [
      {
        question: 'G2 on a residential electrical plan typically means:',
        options: ['Gas 2', 'Double GPO', 'Grid 2', 'Generator 2'],
        correctAnswer: 1,
      },
      {
        question: 'SA commonly marks a:',
        options: ['Sub-antenna', 'Smoke alarm', 'Switch array', 'Service authority'],
        correctAnswer: 1,
      },
      {
        question: 'At scale 1:100, 10 mm on paper is:',
        options: ['10 mm on site', '100 mm on site', '1 m on site', '10 m on site'],
        correctAnswer: 2,
      },
      {
        question: 'A light switch is usually drawn:',
        options: [
          'On the hinge side of the door',
          'On the handle side of the door',
          'In the centre of the room',
          'Only on the SLD',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'b3',
    order: 3,
    title: 'Commercial Single Line Diagrams (SLDs)',
    kind: 'tutorial',
    summary:
      'Trace multi-phase distribution from the main board down to sub-boards.',
    concept:
      'A single-line diagram (SLD) collapses three-phase conductors into one line per circuit so you can see the hierarchy:\n\nIncoming supply → main switchboard (MSB) → feeders → sub-distribution boards (DB-1, DB-2, …) → final circuits.\n\nEach line is not “one wire.” It stands for the group (e.g. 4C+E) plus its protective device. Notes on the line give cable size, fault rating, and device type (MCCB, fuse, RCBO).\n\nTrace with a finger: start at the incoming, pass the main switch / incomer, then each feeder. A load on DB-2 does not originate on DB-1. Essential/fire boards are often a separate feeder from the MSB so they can be maintained independently.\n\nMEN / earthing is shown at the main; sub-boards generally do not get a second MEN — follow the project standard.',
    whyItMatters:
      'Isolation, fault-finding and additions all start on the SLD. If you isolate DB-1 thinking it feeds the mechanical plant, and the plant is on DB-2, you have not made the circuit dead. Tracing the SLD is the difference between a lockout and a lucky guess.',
    diagram: SLD_TRACE,
    examples: [
      {
        title: 'Where does a kitchen GPO originate?',
        problem: 'SLD shows MSB → DB-1 (tenancy) and MSB → DB-2 (mechanical). Kitchen GPOs listed under DB-1.',
        steps: [
          'Kitchen GPOs are final circuits of DB-1, not of the MSB (unless marked MSB local).',
          'To isolate them, isolate the relevant RCBO on DB-1, or the DB-1 incomer if you need the whole board.',
          'DB-2 can stay energised — different feeder.',
        ],
        answer: 'Origin is DB-1, reached via the MSB feeder to DB-1',
      },
      {
        title: 'Read a feeder line',
        problem: 'MSB — 4C+E 16 mm² — 63 A MCCB → DB-2',
        steps: [
          'From main board to sub-board 2.',
          'Four cores + earth, 16 mm².',
          'Protected by a 63 A moulded-case breaker at the origin (confirm direction of supply on the drawing).',
        ],
        answer: 'Feeder to DB-2, 16 mm² 4C+E, 63 A MCCB',
      },
    ],
    keyPoints: [
      'SLD = hierarchy, not a furniture plan',
      'Power flows MSB → sub-boards → finals',
      'One line on an SLD is a whole circuit group',
      'Isolate the board that actually feeds the load',
    ],
    quizQuestions: [
      {
        question: 'On a commercial SLD, distribution is typically:',
        options: [
          'GPOs → street → MSB',
          'MSB → sub-boards → final circuits',
          'Each room has its own MSB',
          'Only single-phase ever',
        ],
        correctAnswer: 1,
      },
      {
        question: 'A single line on an SLD usually represents:',
        options: [
          'One furniture item',
          'A circuit group (device + cable + destination)',
          'Only the earth',
          'A smoke alarm',
        ],
        correctAnswer: 1,
      },
      {
        question: 'To isolate loads listed under DB-2 you must:',
        options: [
          'Always kill the whole building',
          'Trace and isolate DB-2 (or its feeder), not a random other board',
          'Only switch lights off',
          'Open the MEN link first every time',
        ],
        correctAnswer: 1,
      },
      {
        question: 'MSB / Sub-DB-2 / Feeder is a:',
        options: [
          'Lighting point symbol',
          'Supply from the main board to sub-board 2',
          'GPO height note',
          'Smoke alarm interconnection',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'b4',
    order: 4,
    title: 'Multi-Page Off-Sheet Connectors',
    kind: 'tutorial',
    summary:
      'Follow page-to-page tags and alphanumeric grid coordinates such as TO SHEET E-104 [REF: 104-A2].',
    concept:
      'A commercial set will not fit on one sheet. When a cable or bus leaves a drawing, the drafter places an off-sheet connector:\n\nTO SHEET E-104 [REF: 104-A2]\n\nMeans: continue this exact circuit on sheet E-104, at grid A2. Grids are the letters along one edge and numbers along the other — like a street directory.\n\nThe destination sheet should show a matching inbound tag:\nFROM SHEET E-103 [REF: 103-C4]\n\nIf the pair does not match, stop and raise an RFI — do not invent a route. Sheet numbers (E-104) and grids (A2) are independent: the sheet tells you which PDF/page; the grid tells you where to look on that page.',
    whyItMatters:
      'Feeders, fire circuits and control cables routinely hop pages. If you only search the sheet in your hand, you will “lose” a circuit that is drawn correctly two pages later. Off-sheet tags are the breadcrumbs.',
    diagram: OFFSHEET,
    examples: [
      {
        title: 'Follow the tag',
        problem: 'On E-103 at C4: TO SHEET E-104 [REF: 104-A2]. What do you open?',
        steps: [
          'Open sheet E-104 (electrical sheet 104), not architectural A2.',
          'Find grid A2 (column A, row 2, or as the grid is printed).',
          'Look for FROM SHEET E-103 [REF: 103-C4] and continue the same feeder.',
        ],
        answer: 'E-104, grid A2, matching FROM tag',
      },
      {
        title: 'Broken pair',
        problem: 'E-104 A2 has no inbound connector.',
        steps: [
          'Do not assume the nearest bus is the same circuit.',
          'Check revision clouds and the drawing list.',
          'Raise it — missing off-sheets are a coordination defect, not a field puzzle.',
        ],
        answer: 'Stop and query; do not invent the continuation',
      },
    ],
    keyPoints: [
      'TO SHEET E-104 [REF: 104-A2] = sheet E-104, grid A2',
      'Expect a matching FROM tag on the far sheet',
      'Sheet number and grid are different things',
      'No matching tag → RFI, not guesswork',
    ],
    quizQuestions: [
      {
        question: 'TO SHEET E-104 [REF: 104-A2] continues on:',
        options: [
          'Sheet A2 only',
          'Sheet E-104 at grid A2',
          'Sheet 104-A of the architectural set',
          'The SLD cover only',
        ],
        correctAnswer: 1,
      },
      {
        question: 'The matching inbound tag should name:',
        options: [
          'A random other feeder',
          'The originating sheet and grid (e.g. FROM E-103 C4)',
          'Only the contractor name',
          'The paint schedule',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Grid A2 is:',
        options: [
          'A cable size',
          'An alphanumeric location on the sheet',
          'Always the title block',
          'A breaker rating',
        ],
        correctAnswer: 1,
      },
      {
        question: 'If the destination grid has no connector:',
        options: [
          'Use the nearest cable',
          'Query / RFI — do not invent the route',
          'Assume the circuit is deleted',
          'Scale from the north point',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'b5',
    order: 5,
    title: 'Decoding Circuit Schedules',
    kind: 'tutorial',
    summary:
      'Break identification strings such as DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO) into board, circuit, cable and device.',
    concept:
      'A schedule line is a sentence. Read it left to right:\n\nDB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO)\n\n1. DB-1A — which board (distribution board 1, section or chassis A).\n2. Ch-1 — chassis, column, or way-group 1 on that board (office standard — check the legend).\n3. Ckt-3 — circuit number 3 on that chassis.\n4. (2.5mm2 TPS — cable: 2.5 mm² thermoplastic-sheathed.\n5. 16A RCBO) — protective device: 16 A residual-current breaker with overcurrent.\n\nOther tokens you will see: MSB (main), Sub-DB (sub-board), MCCB (moulded-case), MCB (miniature, no residual current unless noted), 4C+E (four core + earth), L / P / F prefixes for lighting, power, fire.\n\nThe schedule is the legal-ish shopping list that matches the SLD and the plan. If they disagree, the issue is coordination, not your memory.',
    whyItMatters:
      'You will pull cable, label cores and pick breakers from this string. Mixing 1.5 mm² lighting with a 16 A power RCBO, or landing Ckt-3 on the wrong chassis, is how boards fail inspection. Decode every slash before you cut.',
    tables: [
      {
        title: 'Five example lines',
        headers: ['Schedule string', 'In plain language'],
        rows: SAMPLE_SCHEDULES.map((row) => [row.code, row.meaning]),
      },
    ],
    examples: [
      {
        title: 'Word by word',
        problem: 'DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO)',
        steps: [
          'Board: DB-1A.',
          'Where on the board: chassis 1.',
          'Which way: circuit 3.',
          'Cable: 2.5 mm² TPS (typical GPO).',
          'Device: 16 A RCBO (overcurrent + residual current).',
        ],
        answer: 'DB-1A chassis 1 circuit 3 — 2.5 mm² TPS on a 16 A RCBO',
      },
      {
        title: 'Feeder vs final',
        problem: 'MSB / Sub-DB-2 / Feeder (4C+E 16mm2 / 63A MCCB)',
        steps: [
          'This is not a GPO circuit. It is a feeder.',
          'Origin MSB, destination sub-board 2.',
          '16 mm² four-core + earth, 63 A MCCB.',
        ],
        answer: 'MSB-to-DB-2 feeder, not a final circuit',
      },
    ],
    keyPoints: [
      'Left to right: board → location on board → circuit → cable → device',
      'TPS / mm² = cable; RCBO/MCB/MCCB = protection',
      'Feeder lines go board-to-board; Ckt-n is usually a final',
      'Legend beats folklore when Ch- or L/P/F prefixes appear',
    ],
    quizQuestions: [
      {
        question: 'In DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO), Ckt-3 is the:',
        options: ['Cable size', 'Circuit number', 'Room name', 'Scale'],
        correctAnswer: 1,
      },
      {
        question: '16A RCBO is the:',
        options: ['Cable', 'Protective device', 'GPO height', 'Sheet number'],
        correctAnswer: 1,
      },
      {
        question: '2.5mm2 TPS names the:',
        options: ['Breaker only', 'Cable size and type', 'Phase rotation', 'Smoke alarm'],
        correctAnswer: 1,
      },
      {
        question: 'MSB / Sub-DB-2 / Feeder is:',
        options: [
          'A lighting point',
          'A board-to-board supply',
          'A double GPO',
          'An off-sheet grid only',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'b6',
    order: 6,
    title: 'Blueprint Symbols & Schedules',
    kind: 'drill',
    summary:
      'Recall standard electrical plan symbols and decode circuit-schedule strings under time.',
    concept:
      'Twelve mixed items: series/parallel, residential marks (G2, SA, S, [L]), SLD flow, off-sheet tags, and schedule decoding (including the five example codes). Ten minutes. Skip is unanswered. Pass at 70% with at least eight answered.\n\nBefore you start, look away and redraw from memory: double GPO, lighting point, one-way switch, smoke alarm, DB rectangle. Then sit the paper.',
    whyItMatters:
      'On site you will not have this tutorial open. You need the marks and the slashes in muscle memory so a schedule line and a plan symbol mean the same circuit in your head.',
    examples: [
      {
        title: 'Five codes to know cold',
        problem: 'Decode without looking back.',
        steps: SAMPLE_SCHEDULES.map(
          (row, i) => `${i + 1}. ${row.code} → ${row.meaning}`,
        ),
        answer: 'Board / circuit / cable / device every time',
      },
    ],
    tables: [
      {
        title: 'Redraw these from memory',
        headers: ['Symbol idea', 'Common mark'],
        rows: SYMBOL_TABLE.map((row) => [row[0], row[1]]),
      },
    ],
    keyPoints: [
      'G2, S, [L], SA, DB — legend first, then memory',
      'Schedule: DB / chassis / Ckt / cable / device',
      'SLD flows down; off-sheet names sheet + grid',
      '70% of ≥8 answered to pass this drill',
    ],
    quizQuestions: [
      {
        question: 'This symbols-and-schedules drill lasts:',
        options: ['90 seconds', '10 minutes', '30 minutes', 'One hour'],
        correctAnswer: 1,
      },
    ],
    drillBank: REVIEW_BANK,
    drillSeconds: 600,
    drillPaperSize: 10,
    drillPassPercent: 70,
    drillPassAnswered: 7,
  },
  {
    id: 'b7',
    order: 7,
    title: 'Domestic Layout Reflection',
    kind: 'flashcards',
    summary:
      'Walk your own home in your head: GPOs, light switches, smoke alarms — then match them to plan marks.',
    concept:
      'Close the laptop after one slow pass of these cards and walk the dwelling you are in. For each room name: lighting point, switch position (handle side?), GPO count (single/double), smoke alarm. Then imagine the schedule line that would feed them (which DB, lighting vs power circuit).\n\nThis is not a test of your landlord. It is converting a real space into the two views you have learned: plan symbols and a board schedule.',
    whyItMatters:
      'Drawings are a translation of buildings. If you cannot reverse-translate your own kitchen, a stranger’s blueprint will stay abstract. Reflection is how the last six modules become a trade, not a PDF.',
    examples: [
      {
        title: 'One room',
        problem: 'Stand in a bedroom doorway.',
        steps: [
          'Switch at your hand? That is S on the plan.',
          'Ceiling light in view? [L]. Smoke alarm in the room or hall? SA.',
          'Wall sockets: G or G2. They are parallel on a power circuit, not series with the lamp.',
        ],
        answer: 'S, [L], SA, G2 — then guess DB / Ckt type (lighting vs power)',
      },
    ],
    keyPoints: [
      'Walk rooms: S, [L], G/G2, SA',
      'Switches on the handle side',
      'GPOs parallel; lighting a different Ckt on the same or another RCBO',
      'Every outlet has a board origin',
    ],
    quizQuestions: [
      {
        question: 'Two GPOs in a living room on one circuit are electrically:',
        options: ['Series through each toaster', 'Parallel branches', 'Only earthed', 'Off-sheet only'],
        correctAnswer: 1,
      },
      {
        question: 'A smoke alarm on a domestic plan is commonly marked:',
        options: ['G2', 'SA', 'MSB', 'MCCB'],
        correctAnswer: 1,
      },
      {
        question: 'The origin of a bedroom light circuit is:',
        options: [
          'The lamp-holder',
          'A protective device on a board (schedule Ckt)',
          'The door handle',
          'The scale bar',
        ],
        correctAnswer: 1,
      },
    ],
    flashcards: HOME_CARDS,
  },
  {
    id: 'b8',
    order: 8,
    title: 'Study Guide & Key Focus',
    kind: 'guide',
    summary:
      'Draw standard symbols from memory. Decode schedule lines. Trace MSB → sub-board on an SLD.',
    concept:
      'Three skills to keep:\n\n1. Symbols — G2 double GPO, S switch, [L] light, SA smoke alarm, DB board. Always confirm the legend.\n2. Schedules — left to right: board / chassis / circuit / cable / device. Example: DB-1A / Ch-1 / Ckt-3 (2.5mm2 TPS / 16A RCBO).\n3. SLD trace — incoming → MSB → feeder → sub-board → finals. Off-sheet: TO SHEET E-104 [REF: 104-A2] continues at E-104 grid A2.\n\nSeries vs parallel sits underneath: finals are parallel; a schematic loop that is series is a different animal from a cable run along a skirting.',
    whyItMatters:
      'If you can redraw the marks, parse a schedule line, and point to the board that actually feeds a load, you can install, isolate and fault-find from the documents instead of from hope.',
    diagram: `${SERIES_PARALLEL}\n\n${SLD_TRACE}`,
    tables: [
      {
        title: 'Symbols to redraw from memory',
        headers: ['Item', 'Common mark', 'Notes'],
        rows: SYMBOL_TABLE.map((row) => [row[0], row[1], row[2]]),
      },
      {
        title: 'Schedule decode (five lines)',
        headers: ['String', 'Meaning'],
        rows: SAMPLE_SCHEDULES.map((row) => [row.code, row.meaning]),
      },
    ],
    examples: [
      {
        title: 'Full path',
        problem: 'Plan shows G2 in a tenancy kitchen. Schedule: DB-1A / Ckt-P3 (2.5mm2 / 16A RCBO). SLD: MSB → DB-1A.',
        steps: [
          'Symbol G2 = double GPO on the kitchen wall (plan).',
          'It is final circuit P3 on DB-1A, 2.5 mm², 16 A RCBO (schedule).',
          'DB-1A is fed from the MSB (SLD). Isolate P3 or DB-1A, not DB-2.',
        ],
        answer: 'Plan position + schedule identity + SLD origin',
      },
    ],
    keyPoints: [
      'G2, S, [L], SA, DB — redraw from memory, then check the legend',
      'Schedule: board / Ckt / mm² / device',
      'SLD: MSB down to sub-boards',
      'Off-sheet = sheet number + grid',
    ],
    quizQuestions: [
      {
        question: 'G2 is typically a:',
        options: ['Smoke alarm', 'Double GPO', 'Main switchboard', 'Feeder MCCB'],
        correctAnswer: 1,
      },
      {
        question: 'DB-1A / Ckt-3 (2.5mm2 TPS / 16A RCBO) names a 16 A RCBO as the:',
        options: ['Cable', 'Protective device', 'Room', 'Scale'],
        correctAnswer: 1,
      },
      {
        question: 'Power on a commercial SLD is traced:',
        options: [
          'From GPOs up to the street first',
          'From the main board down to sub-boards',
          'Only on architectural plans',
          'Alphabetically',
        ],
        correctAnswer: 1,
      },
      {
        question: 'REF: 104-A2 is a:',
        options: [
          'Cable size',
          'Grid location on sheet 104',
          'Breaker rating',
          'Smoke alarm type',
        ],
        correctAnswer: 1,
      },
    ],
  },
];

export const BLUEPRINT_UNIT: Unit = {
  id: 'blueprints',
  code: 'DWG',
  name: 'Technical Documents & Blueprints',
  description:
    'Series vs parallel schematics, residential plans, commercial SLDs, off-sheet connectors, circuit schedules, and symbol memory. Does not count toward UEE22020 points.',
  prerequisites: [],
  points: 0,
  kind: 'core',
  topics: BLUEPRINT_MODULES.map((module) => ({
    id: module.id,
    title: module.title,
    content: module.summary,
    keyPoints: module.keyPoints,
    quizQuestions: module.quizQuestions,
  })),
};

export function isBlueprintModuleUnlocked(
  module: MathModule,
  completions: Record<string, boolean> | undefined,
): boolean {
  return isModuleUnlocked(BLUEPRINT_MODULES, module, completions);
}

export function buildBlueprintPaper(
  count: number,
  rng: () => number = Math.random,
) {
  return makeDrillPaper(REVIEW_BANK, count, rng);
}
