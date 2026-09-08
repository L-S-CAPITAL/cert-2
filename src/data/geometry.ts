import { DrillItem, Flashcard, MathModule, Unit } from '../types';
import { isModuleUnlocked, makeDrillPaper } from './drill';

export const TRIANGLE_345 = {
  a: 3,
  b: 4,
  c: 5,
  sin: 0.6,
  cos: 0.8,
  tan: 0.75,
} as const;

export const SOH_CAH_TOA = `
SOH  sin θ = opposite / hypotenuse
CAH  cos θ = adjacent  / hypotenuse
TOA  tan θ = opposite / adjacent

        opposite
           │
           │
adjacent ──┘ θ
hypotenuse = slope
`.trim();

export const PYTHAGORAS = `
        c (hypotenuse)
       /|
      / |
     /  | a
    /   |
   /θ___|
      b

a² + b² = c²
`.trim();

export const REVIEW_BANK: DrillItem[] = [
  {
    skill: 'pythagoras',
    question: 'In a right triangle, a² + b² = ?',
    options: ['a + b', 'c', 'c²', '2c'],
    correctAnswer: 2,
  },
  {
    skill: 'pythagoras',
    question: 'Sides 3 m and 4 m, right angle between them. Hypotenuse is:',
    options: ['5 m', '7 m', '12 m', '25 m'],
    correctAnswer: 0,
  },
  {
    skill: 'pythagoras',
    question: 'A tray run is 6 m along the wall and 8 m out. Diagonal length is:',
    options: ['10 m', '14 m', '48 m', '100 m'],
    correctAnswer: 0,
  },
  {
    skill: 'trig',
    question: 'SOH means sine equals:',
    options: [
      'adjacent / hypotenuse',
      'opposite / hypotenuse',
      'opposite / adjacent',
      'hypotenuse / opposite',
    ],
    correctAnswer: 1,
  },
  {
    skill: 'trig',
    question: 'CAH means cosine equals:',
    options: [
      'opposite / hypotenuse',
      'opposite / adjacent',
      'adjacent / hypotenuse',
      'adjacent / opposite',
    ],
    correctAnswer: 2,
  },
  {
    skill: 'trig',
    question: 'TOA means tangent equals:',
    options: [
      'opposite / adjacent',
      'adjacent / opposite',
      'opposite / hypotenuse',
      'adjacent / hypotenuse',
    ],
    correctAnswer: 0,
  },
  {
    skill: 'trig',
    question: 'In a 3-4-5 triangle, sin of the angle opposite 3 is:',
    options: ['3/4', '4/5', '3/5', '5/3'],
    correctAnswer: 2,
  },
  {
    skill: 'physics',
    question: 'In the water analogy, voltage is:',
    options: ['Flow rate', 'Pipe friction', 'Pressure', 'Pipe diameter'],
    correctAnswer: 2,
  },
  {
    skill: 'physics',
    question: 'In the water analogy, current is:',
    options: ['Pressure', 'Flow rate', 'Pipe material', 'Tank height only'],
    correctAnswer: 1,
  },
  {
    skill: 'tools',
    question: 'Insulated combination pliers are primarily for:',
    options: [
      'Cutting live conductors',
      'Gripping, bending and twisting (dead circuits)',
      'Stripping every cable size',
      'Hammering knockouts',
    ],
    correctAnswer: 1,
  },
  {
    skill: 'tools',
    question: 'Diagonal side cutters should not be used to:',
    options: [
      'Cut copper tails on an isolated circuit',
      'Trim cable ties',
      'Cut steel rod or live conductors',
      'Nip insulation off a dead end',
    ],
    correctAnswer: 2,
  },
  {
    skill: 'dmm',
    question: 'A typical DMM continuity function is marked with:',
    options: [
      'A battery symbol only', 'A speaker / diode-sound icon',
      'Hz',
      '°C',
    ],
    correctAnswer: 1,
  },
];

const DECOMPRESS_CARDS: Flashcard[] = [
  {
    front: 'Electrons in a copper conductor…',
    back: 'Are already in the metal. A voltage makes them drift as a group — that drift is current, not “new” electrons shooting down the cable at light speed.',
  },
  {
    front: 'How a pair of side cutters shapes a path',
    back: 'A clean cut on an isolated tail lets the conductor sit fully in a terminal. A crushed, live, or nicked conductor is a hot joint waiting to happen.',
  },
  {
    front: 'Pliers leverage',
    back: 'Force is highest near the joint. Grip there for stubborn ferrules; use the tips for positioning, not for breaking steel.',
  },
  {
    front: 'Water analogy — and its limit',
    back: 'Pressure ~ V, flow ~ I, restriction ~ R. Water does not have a magnetic field or a frequency. Use the picture, then come back to charge and field.',
  },
  {
    front: '3-4-5 on a tray',
    back: 'A right-angle run of 3 and 4 units needs 5 units of tray on the diagonal. Scale it: 3 m and 4 m → 5 m of ladder.',
  },
  {
    front: 'Continuity beep means…',
    back: 'A low-resistance path between the probes. Confirm the circuit is isolated first, or you are measuring a live path you did not intend.',
  },
];

export const GEOMETRY_MODULES: MathModule[] = [
  {
    id: 'g1',
    order: 1,
    title: "Pythagoras' Theorem",
    kind: 'tutorial',
    summary:
      'Use a² + b² = c² to find diagonal cable-tray lengths and the unknown side of a right-angled triangle.',
    concept:
      'On a right-angled triangle the side opposite the right angle is the hypotenuse c. Pythagoras says:\n\na² + b² = c²\n\nIf you know the two legs, the diagonal is c = √(a² + b²). If you know the hypotenuse and one leg, the other leg is √(c² − a²).\n\nThe 3-4-5 family is the electrician’s friend: 3² + 4² = 9 + 16 = 25 = 5². Scale it: 6-8-10, 9-12-15. A tray that goes 3 m along a wall then 4 m out needs 5 m of ladder on the diagonal — not 7 m (that would be adding the legs, which is the long way around).\n\nOnly works for a right angle. If the corner is not 90°, this theorem does not apply.',
    whyItMatters:
      'Containment, ladder tray, catenary and underground ducts are priced and cut on length. Guessing the diagonal by adding the two walls wastes tray and looks amateur. A 3-4-5 check also squares a frame before you hang a board: mark 3 along one edge, 4 along the other; the diagonal should be 5.',
    diagram: PYTHAGORAS,
    examples: [
      {
        title: 'Classic 3-4-5',
        problem: 'A right triangle has legs 3 m and 4 m. Find the hypotenuse.',
        steps: [
          'c² = 3² + 4² = 9 + 16 = 25.',
          'c = √25 = 5 m.',
        ],
        answer: '5 m',
      },
      {
        title: 'Cable tray diagonal',
        problem: 'A tray must span 6 m along a plant-room wall and 8 m out to a riser, at 90°. How much ladder?',
        steps: [
          'This is 3-4-5 scaled by 2: 6-8-10.',
          'c² = 6² + 8² = 36 + 64 = 100.',
          'c = 10 m of tray (plus bends and spare — length first).',
        ],
        answer: '10 m',
      },
      {
        title: 'Find a missing leg',
        problem: 'Hypotenuse 13 m, one leg 5 m. Other leg?',
        steps: [
          'b² = c² − a² = 169 − 25 = 144.',
          'b = √144 = 12 m.',
          '5-12-13 is another whole-number triple.',
        ],
        answer: '12 m',
      },
    ],
    keyPoints: [
      'a² + b² = c² only on a right-angled triangle',
      'c is the side opposite the 90° angle',
      '3-4-5 (and 6-8-10, 5-12-13) for trays and squaring up',
      'Missing leg: √(c² − a²), not c − a',
    ],
    quizQuestions: [
      {
        question: 'Pythagoras states:',
        options: ['a + b = c', 'a² + b² = c²', 'a² − b² = c', '2a + 2b = c'],
        correctAnswer: 1,
      },
      {
        question: 'Legs 3 m and 4 m. Hypotenuse is:',
        options: ['5 m', '7 m', '12 m', '25 m'],
        correctAnswer: 0,
      },
      {
        question: 'A 6 m by 8 m right-angle tray run needs about:',
        options: ['14 m of ladder', '10 m of ladder', '48 m of ladder', '7 m of ladder'],
        correctAnswer: 1,
      },
      {
        question: 'To find a leg when c and a are known:',
        options: ['c − a', 'c + a', '√(c² − a²)', 'c² + a²'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'g2',
    order: 2,
    title: 'Basic Trigonometry (SOH CAH TOA)',
    kind: 'tutorial',
    summary:
      'Sine, cosine and tangent on a right triangle — the same ratios used later for basic AC phase angles.',
    concept:
      'For an acute angle θ in a right triangle:\n\n• SOH  sin θ = opposite / hypotenuse\n• CAH  cos θ = adjacent  / hypotenuse\n• TOA  tan θ = opposite / adjacent\n\nOpposite is the side across from θ. Adjacent is the other leg touching θ. Hypotenuse is always the longest side.\n\nOn a 3-4-5 triangle, the angle opposite 3 has sin = 3/5 = 0.6, cos = 4/5 = 0.8, tan = 3/4 = 0.75.\n\nIn AC, a phase angle is often drawn the same way: the “real” (in-phase) voltage or current along the adjacent side, the “quadrature” (90° out) along the opposite side, and the resultant on the hypotenuse. Power factor is cos φ — adjacent over hypotenuse. You do not need phasors mastered yet; you do need the three ratios cold so the picture is not a blur when Cert II/III names φ.',
    whyItMatters:
      'Cable-tray rise over run is a tangent. A support bracket at 30° is a sine. Later, a lagging load is an angle on a triangle, not a different species of maths. SOH CAH TOA is one toolkit for geometry on the job and for the first AC diagrams.',
    diagram: SOH_CAH_TOA,
    examples: [
      {
        title: 'Sine on 3-4-5',
        problem: 'In a 3-4-5 triangle, sin of the angle opposite side 3?',
        steps: [
          'Opposite = 3, hypotenuse = 5.',
          'sin θ = 3/5 = 0.6.',
        ],
        answer: '0.6',
      },
      {
        title: 'Cosine — the power-factor shape',
        problem: 'Same triangle, cos of that angle?',
        steps: [
          'Adjacent = 4, hypotenuse = 5.',
          'cos θ = 4/5 = 0.8.',
          'If this were an AC triangle, 0.8 would be a power factor of 0.8 lag (shape only — not a full PF calculation).',
        ],
        answer: '0.8',
      },
      {
        title: 'Tangent for a rise',
        problem: 'A tray rises 1.5 m over 2 m of run. tan θ = ?',
        steps: [
          'tan θ = opposite / adjacent = 1.5 / 2 = 0.75.',
          'Same ratio as 3/4 on the 3-4-5.',
        ],
        answer: '0.75',
      },
    ],
    keyPoints: [
      'SOH CAH TOA: opp/hyp, adj/hyp, opp/adj',
      'Hypotenuse is opposite the right angle',
      '3-4-5 gives sin 0.6, cos 0.8, tan 0.75 for the small angle',
      'AC phase angle uses the same triangle picture; PF ~ cos φ',
    ],
    quizQuestions: [
      {
        question: 'sin θ equals:',
        options: [
          'adjacent / hypotenuse',
          'opposite / hypotenuse',
          'opposite / adjacent',
          'adjacent / opposite',
        ],
        correctAnswer: 1,
      },
      {
        question: 'cos θ equals:',
        options: [
          'adjacent / hypotenuse',
          'opposite / hypotenuse',
          'opposite / adjacent',
          'hypotenuse / adjacent',
        ],
        correctAnswer: 0,
      },
      {
        question: 'On a 3-4-5 triangle, tan of the angle opposite 3 is:',
        options: ['3/5', '4/5', '3/4', '5/4'],
        correctAnswer: 2,
      },
      {
        question: 'Power factor is the same ratio as:',
        options: ['sine', 'cosine', 'tangent', 'Pythagoras’ c only'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'g3',
    order: 3,
    title: 'Electrical Physics (The Water Analogy)',
    kind: 'tutorial',
    summary:
      'Map voltage to pressure, current to flow rate, and resistance to friction / opposition — then know where the analogy stops.',
    concept:
      'A useful picture for a first circuit:\n\n• Voltage (V) ↔ pressure. A pump (the source) sets how hard charge is pushed.\n• Current (I) ↔ flow rate. How much charge passes a point each second (amperes = coulombs per second).\n• Resistance (R) ↔ friction or a restriction in the pipe. Narrower pipe, longer pipe, or a rougher lining → less flow for the same pressure.\n\nOhm’s law is that sentence: I = V / R. More pressure or less restriction → more flow.\n\nLimits of the analogy (do not skip these):\n• Electrons are already in the metal; they drift slowly. Energy and the electric field travel fast.\n• Water does not make a magnetic field when it flows. Current does — that is how a clamp meter and a transformer work.\n• AC reverses; water in a hose usually does not.\n• A complete circuit is required. A cut conductor is an open pipe, not a “half flow.”',
    whyItMatters:
      'If voltage, current and resistance are only letters, transposition is memorising. If they are pressure, flow and opposition, I = V/R is obvious and so is “open circuit → no flow.” That picture also explains why a nicked conductor (higher R) runs hotter for the same I (P = I²R).',
    examples: [
      {
        title: 'Raise the pressure',
        problem: 'Same pipe (R fixed), pump pressure doubled. What happens to flow?',
        steps: [
          'I = V / R. R unchanged, V × 2.',
          'I doubles.',
          'Physically: harder push, more charge past a point each second.',
        ],
        answer: 'Current doubles',
      },
      {
        title: 'Kink the hose',
        problem: 'Same pump, you kink the hose (R up). Flow?',
        steps: [
          'R increased, V the same.',
          'I = V / R falls.',
          'On a cable: damage or a loose joint is a local restriction — heat at that point.',
        ],
        answer: 'Current falls; the restriction can run hot',
      },
      {
        title: 'Where water fails',
        problem: 'Why can a clamp meter read current on an insulated core?',
        steps: [
          'Moving charge makes a magnetic field around the conductor.',
          'The jaws read that field. Water in a plastic pipe does not do this.',
          'Keep the analogy for V, I, R — switch to field thinking for magnets, transformers and clamps.',
        ],
        answer: 'Current has a magnetic field; the water picture does not',
      },
    ],
    keyPoints: [
      'V ~ pressure, I ~ flow, R ~ restriction',
      'I = V/R is that mapping',
      'Open circuit = no path = no flow',
      'Analogy stops at magnetism, AC reversal, and drift vs energy speed',
    ],
    quizQuestions: [
      {
        question: 'In the water analogy, voltage maps to:',
        options: ['Flow rate', 'Pressure', 'Pipe colour', 'Tank volume only'],
        correctAnswer: 1,
      },
      {
        question: 'In the water analogy, current maps to:',
        options: ['Pressure', 'Temperature', 'Flow rate', 'Pipe length only'],
        correctAnswer: 2,
      },
      {
        question: 'A loose joint is most like:',
        options: [
          'A bigger pump',
          'A restriction that can run hot',
          'A shorter pipe always',
          'Zero resistance',
        ],
        correctAnswer: 1,
      },
      {
        question: 'The water analogy does not explain:',
        options: [
          'Why I falls when R rises',
          'Why a clamp meter can read current',
          'Why an open circuit stops flow',
          'Why a taller tank (more V) can mean more flow',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'g4',
    order: 4,
    title: 'Hand Tools Overview',
    kind: 'tutorial',
    summary:
      'Safe handling, leverage and grip for insulated combination pliers and diagonal side cutters.',
    concept:
      'Two tools you will live with:\n\nCombination pliers (linesman’s / combo pliers)\n• Serrated jaws for gripping and twisting, a cutter in the joint, insulated handles if they are electrical pliers.\n• Use the back of the jaws (near the joint) when you need leverage; use the tips to position, not to break bolts.\n• They are not a hammer, a spanner, or a live-line tool. Insulation is a last barrier, not a licence to work live.\n\nDiagonal side cutters (diags / dikes)\n• Bevelled cutting edges meet at a point. They cut copper and aluminium tails, cable ties, and some insulation — on isolated circuits.\n• Cut at 90° to the conductor, as close to the joint as the cut allows, in one squeeze. Twisting or prying with diags chips the edges and can launch the off-cut.\n• Never cut steel rod, masonry nails, or live conductors. Never use them as a stripping knife on a core you still need.\n\nInsulation (typically VDE / 1000 V marked)\n• Inspect for cracks, oil swell, or missing guards before every use.\n• Damaged insulation → tag out, replace. The rating is only for the tested tool as manufactured.',
    whyItMatters:
      'Most early-career hand injuries in this trade are crush, cut and poke from the wrong grip or a tool used as something else. A nicked conductor from a sloppy diag cut is also an electrical defect: high resistance, heat, failure under load. Leverage and insulation are WHS and workmanship, not optional extras.',
    examples: [
      {
        title: 'Leverage on combo pliers',
        problem: 'A ferrule will not start on a stiff earth tail. Where do you grip?',
        steps: [
          'Place the work deep in the jaws, near the pivot — maximum leverage.',
          'Twist with your wrist in line with the handles; do not yank sideways on the tips.',
          'If it still will not move, you need a better method (ferrule size, pre-twist), not a longer swing that slips into your palm.',
        ],
        answer: 'Grip near the joint, not at the tips',
      },
      {
        title: 'Diag cut on a tail',
        problem: 'Trim a stranded copper tail on an isolated board.',
        steps: [
          'Prove isolated. Eye protection on — off-cuts fly.',
          'Square the cutters to the conductor, squeeze through once.',
          'Do not use the cutters to pull the insulation off the remaining core.',
        ],
        answer: 'Isolated, square, one cut; never live, never steel',
      },
    ],
    keyPoints: [
      'Combo pliers: grip and twist; leverage near the pivot',
      'Diags: copper/aluminium on isolated circuits; not steel, not live',
      'Inspect 1000 V / VDE insulation every time',
      'Insulation is not permission to work live',
    ],
    quizQuestions: [
      {
        question: 'Maximum leverage on combination pliers is:',
        options: [
          'At the very tips',
          'Near the pivot / joint',
          'By swinging the handles as a hammer',
          'By holding one handle only',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Diagonal side cutters are not for:',
        options: [
          'Cutting isolated copper tails',
          'Cutting cable ties',
          'Cutting live conductors or steel rod',
          'Trimming an isolated earth',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Cracked insulation on “1000 V” pliers means:',
        options: [
          'Still fine below 230 V',
          'Tape it and continue',
          'Tag out and replace',
          'Only the cutter is affected',
        ],
        correctAnswer: 2,
      },
      {
        question: 'Insulated handles mean you may work live:',
        options: [
          'Yes, always',
          'Yes, under 50 V',
          'No — isolation first; insulation is a last barrier',
          'Yes, if the pliers are combo type',
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'g5',
    order: 5,
    title: 'Workshop Tools & Multimeter Basics',
    kind: 'tutorial',
    summary:
      'Mechanical wire strippers, insulated screwdrivers, and setting a DMM to continuity.',
    concept:
      'Mechanical wire strippers\n• Match the hole to the conductor size (the marking on the tool, not “whatever looks close”). Too small nicks the copper; too large slips and tears the insulation.\n• Square to the cable, close fully, pull the slug off the core. Do not twist strippers like a fidget — that spirals and nicks strands.\n\nInsulated screwdrivers\n• Tip must fit the fastener (the right Phillips / Pozidriv / slotted / Torx). Cam-out damages the screw and your wrist.\n• Insulation on the shank is for accidental contact, not for live work. Keep the tip undamaged; a mushroomed blade slips.\n\nDMM continuity\n• Function: a small test current; the meter beeps (and/or shows a low ohms reading) when the path is low resistance.\n• Dial / icon: usually a sound-wave or speaker symbol, often shared with the diode test (▶|).\n• Proves a path. It does not prove a circuit is safe. Isolate, test-for-dead with a proving unit, then use continuity if you need to ring out cores.\n• Parallel paths (other loads still connected) can beep when the core you care about is open. Know what you are across.',
    whyItMatters:
      'Nicked strands under a screw are a future hot joint. The wrong screwdriver chews terminals on a board you do not own. Continuity used on a live or parallel circuit gives a false story and can damage the meter. These three tools are how most first-year work actually gets done.',
    examples: [
      {
        title: 'Set the stripper',
        problem: 'Stripping 2.5 mm² TPS for a socket.',
        steps: [
          'Select the 2.5 mm² hole (or the marked AWG equivalent on some tools).',
          'Strip only as much as the terminal needs — not a thumb of bare copper.',
          'Inspect: no missing strands, no cut marks in the copper.',
        ],
        answer: 'Correct hole, correct length, inspect the core',
      },
      {
        title: 'Continuity on an isolated core',
        problem: 'Ring out a control core from panel to field, circuit isolated.',
        steps: [
          'Prove isolated. Meter on continuity (speaker / diode-sound icon).',
          'Short the probes together — you must hear the beep (prove the tester).',
          'One probe on each end of the intended core. Beep = path. No beep = open or you are on the wrong core.',
        ],
        answer: 'Isolate, prove the meter, then ring the core',
      },
    ],
    keyPoints: [
      'Stripper hole matches the conductor — inspect for nicks',
      'Screwdriver tip matches the fastener; insulation ≠ live work',
      'Continuity icon: speaker / sound waves, often with diode',
      'Prove isolated and prove the meter before you trust a beep',
    ],
    quizQuestions: [
      {
        question: 'A stripper hole that is too small will typically:',
        options: [
          'Leave insulation on',
          'Nick or cut strands',
          'Improve the crimp',
          'Only matter on aluminium',
        ],
        correctAnswer: 1,
      },
      {
        question: 'DMM continuity is commonly shown as:',
        options: [
          'A speaker or diode-sound icon',
          'A lightning bolt only',
          'VAC',
          'A battery and a thermometer',
        ],
        correctAnswer: 0,
      },
      {
        question: 'Before trusting a continuity beep you should:',
        options: [
          'Turn the dial to Hz',
          'Prove the circuit isolated and short the probes to hear the beep',
          'Hold both probes on the same terminal',
          'Set the range to 1000 V AC',
        ],
        correctAnswer: 1,
      },
      {
        question: 'Insulated screwdrivers are for:',
        options: [
          'Deliberate live tightening',
          'Fit and insulation as a last barrier — isolate first',
          'Chiselling knockouts',
          'Measuring current',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'g6',
    order: 6,
    title: 'Trig, Pythagoras, & Tool Safety',
    kind: 'drill',
    summary:
      'Mixed paper: SOH CAH TOA, Pythagoras, water-analogy physics, tool safety and DMM continuity icons.',
    concept:
      'Twelve questions, ten minutes. Skip is unanswered, not wrong. Pass at 70% with at least eight answered. This is the strand checkpoint before you decompress.',
    whyItMatters:
      'On a job these topics arrive mixed: you square a tray (3-4-5), glance at a phase-angle sketch (cos), then ring a core (continuity) with diags in the other hand. A mixed drill is closer to that than three separate worksheets.',
    examples: [
      {
        title: 'How the drill runs',
        problem: '12 mixed questions, 10:00 on the clock.',
        steps: [
          'Lock in or skip. Clock does not pause.',
          '≥ 8 answered at ≥ 70% marks the module complete.',
        ],
        answer: 'Retry until 3-4-5, SOH CAH TOA and the continuity icon are automatic',
      },
    ],
    keyPoints: [
      'a² + b² = c²; 3-4-5 family',
      'SOH CAH TOA',
      'V pressure, I flow, R restriction — analogy has limits',
      'Diags/combo insulated use; DMM speaker icon for continuity',
    ],
    quizQuestions: [
      {
        question: 'This mixed drill lasts:',
        options: ['90 seconds', '10 minutes', '30 minutes', '1.5 minutes per item'],
        correctAnswer: 1,
      },
    ],
    drillBank: REVIEW_BANK,
    drillSeconds: 600,
    drillPaperSize: 12,
    drillPassPercent: 70,
    drillPassAnswered: 8,
  },
  {
    id: 'g7',
    order: 7,
    title: 'Decompress & Recharge',
    kind: 'flashcards',
    summary:
      'Take a breaker. Picture electron drift in conductors, and how pliers and cutters shape those paths.',
    concept:
      'You have loaded geometry, a physics picture, and tool handling. This block is rest: flip a card, say the back, and visualise a single circuit — source, path, load, return — with a cleanly cut tail in a tight terminal and no nicks in the copper.\n\nElectrons are not tiny bullets from the socket. They drift; the field and the energy move. Your tools either preserve that path or damage it.',
    whyItMatters:
      'Fatigue is when a 3-4-5 becomes 3+4=7 of tray, or when diags wander onto a live tail. A short visualisation pass is a safety control, not a soft extra.',
    examples: [
      {
        title: 'One slow picture',
        problem: 'See a 230 V heater circuit, isolated, one tail being trimmed.',
        steps: [
          'Source, path, load, return. No current until the path is closed and energised.',
          'Diags square on an isolated tail. One cut. Core bright, not nicked.',
          'Terminal bites all strands. That joint is now part of R — keep it low.',
        ],
        answer: 'Clean path, isolated cut, all strands in the terminal',
      },
    ],
    keyPoints: [
      'Drift vs energy speed — do not picture bullets',
      'Tools either protect the path or damage it',
      'This module is rest — accuracy over speed',
      'Continuity is a path check after isolation',
    ],
    quizQuestions: [
      {
        question: 'Electron drift in copper is:',
        options: [
          'The same speed as light in the cable',
          'A slow group motion; energy/field travel much faster',
          'Zero until the insulation is stripped',
          'Only present in AC',
        ],
        correctAnswer: 1,
      },
      {
        question: 'A nicked strand under a screw is mainly a problem because:',
        options: [
          'It looks untidy only',
          'It raises local resistance and can run hot',
          'It lowers voltage at the source',
          'It improves flexibility',
        ],
        correctAnswer: 1,
      },
    ],
    flashcards: DECOMPRESS_CARDS,
  },
  {
    id: 'g8',
    order: 8,
    title: 'Study Guide & Key Focus',
    kind: 'guide',
    summary:
      'Pythagoras, SOH CAH TOA, continuity icons, and the physics picture — the working kit from this strand.',
    concept:
      'Keep three pictures:\n\n1. Pythagoras — a² + b² = c². 3-4-5 for trays and squaring.\n2. SOH CAH TOA — opp/hyp, adj/hyp, opp/adj. Cosine is the shape of power factor.\n3. DMM continuity — speaker / sound-wave icon, often with diode. Isolate, prove the meter, then ring the path.\n\nPhysics underneath: V pressure, I flow, R restriction. I = V/R. The water analogy helps; magnetism and AC are where you drop it.\n\nTools: combo pliers grip near the pivot; diags cut isolated copper, never live, never steel; strippers match the hole; screwdrivers match the tip.',
    whyItMatters:
      'This is the geometry, the first AC triangle, the reason a joint heats up, and the three tools in your pouch. If these are automatic, the next electrical calculations sit on a picture instead of a blank.',
    diagram: `${PYTHAGORAS}\n\n${SOH_CAH_TOA}\n\nDMM continuity: )))  or  ▶| )))   (speaker / diode-sound)`,
    tables: [
      {
        title: 'SOH CAH TOA',
        headers: ['Ratio', 'Formula', '3-4-5 (opp = 3)'],
        rows: [
          ['sin θ', 'opposite / hypotenuse', '3/5 = 0.6'],
          ['cos θ', 'adjacent / hypotenuse', '4/5 = 0.8'],
          ['tan θ', 'opposite / adjacent', '3/4 = 0.75'],
        ],
      },
      {
        title: 'Tool & meter cues',
        headers: ['Item', 'Do', 'Do not'],
        rows: [
          ['Combo pliers', 'Grip near pivot, insulated inspect', 'Hammer, live work, tip-break'],
          ['Side cutters', 'Square cut, isolated Cu/Al', 'Steel, live, pry'],
          ['DMM continuity', 'Isolate, prove beep, then ring', 'Trust a beep on a live/parallel mess'],
        ],
      },
    ],
    examples: [
      {
        title: 'One mixed check',
        problem: 'Tray 3 m by 4 m right angle; then ring the earth continuity on an isolated board.',
        steps: [
          'Diagonal tray: 5 m (3-4-5).',
          'Prove isolated. DMM to continuity (speaker icon). Short probes — beep.',
          'Earth path: beep means a path, not “safe to energise” by itself.',
        ],
        answer: '5 m of tray; continuity only after isolation and a proved meter',
      },
    ],
    keyPoints: [
      'a² + b² = c²; 3-4-5',
      'SOH CAH TOA; PF ~ cos φ',
      'V / I / R = pressure / flow / restriction',
      'Continuity = speaker icon; isolate first',
    ],
    quizQuestions: [
      {
        question: '3 m and 4 m at right angles need a diagonal of:',
        options: ['7 m', '5 m', '12 m', '1 m'],
        correctAnswer: 1,
      },
      {
        question: 'cos θ is:',
        options: [
          'opposite / hypotenuse',
          'adjacent / hypotenuse',
          'opposite / adjacent',
          'a² + b²',
        ],
        correctAnswer: 1,
      },
      {
        question: 'A DMM continuity function is typically the:',
        options: [
          'Speaker / diode-sound icon',
          'VDC lightning only',
          'Clamp-jaw symbol',
          '°C symbol',
        ],
        correctAnswer: 0,
      },
      {
        question: 'In the water analogy, resistance is:',
        options: ['Pressure', 'Flow rate', 'Friction / restriction', 'The tank lid'],
        correctAnswer: 2,
      },
    ],
  },
];

export const GEOMETRY_UNIT: Unit = {
  id: 'geometry',
  code: 'GEO',
  name: 'Geometry, Physics & Hand Tools',
  description:
    'Pythagoras, SOH CAH TOA, the water analogy, insulated pliers and cutters, strippers, DMM continuity, and a mixed drill. Does not count toward UEE22020 unit points.',
  prerequisites: [],
  points: 0,
  kind: 'core',
  topics: GEOMETRY_MODULES.map((module) => ({
    id: module.id,
    title: module.title,
    content: module.summary,
    keyPoints: module.keyPoints,
    quizQuestions: module.quizQuestions,
  })),
};

export function isGeometryModuleUnlocked(
  module: MathModule,
  completions: Record<string, boolean> | undefined,
): boolean {
  return isModuleUnlocked(GEOMETRY_MODULES, module, completions);
}

export function buildGeometryPaper(
  count: number,
  rng: () => number = Math.random,
) {
  return makeDrillPaper(REVIEW_BANK, count, rng);
}
