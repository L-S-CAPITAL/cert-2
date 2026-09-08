import { DrillItem, Flashcard, MathModule, Unit } from '../types';
import { isModuleUnlocked, makeDrillPaper } from './drill';

export const PREFIX_TARGET_SECONDS = 90;

export const PREFIX_SCALE = [
  { prefix: 'M', name: 'mega', exp: 6, factor: '1 000 000', example: '1 MW = 10^6 W' },
  { prefix: 'k', name: 'kilo', exp: 3, factor: '1 000', example: '1 kV = 10^3 V' },
  { prefix: '(none)', name: 'base unit', exp: 0, factor: '1', example: '1 A, 1 V, 1 Ω, 1 W' },
  { prefix: 'm', name: 'milli', exp: -3, factor: '0.001', example: '1 mA = 10^-3 A' },
  { prefix: 'µ', name: 'micro', exp: -6, factor: '0.000 001', example: '1 µA = 10^-6 A' },
] as const;

export const OHM_CIRCLE = `
        V
      /   \\
     /     \\
    I   ×   R

Cover the unknown. Remaining letters show the move:
  V = I × R
  I = V ÷ R
  R = V ÷ I
`.trim();

export const POWER_CIRCLE = `
        P
      /   \\
     /     \\
    V   ×   I

  P = V × I
  V = P ÷ I
  I = P ÷ V
  also P = I²R = V²/R
`.trim();

export const REVIEW_BANK: DrillItem[] = [
  {
    skill: 'prefix',
    question: '10^3 as a metric prefix is:',
    options: ['milli (m)', 'micro (µ)', 'kilo (k)', 'mega (M)'],
    correctAnswer: 2,
  },
  {
    skill: 'prefix',
    question: '10^6 as a metric prefix is:',
    options: ['kilo (k)', 'mega (M)', 'milli (m)', 'micro (µ)'],
    correctAnswer: 1,
  },
  {
    skill: 'prefix',
    question: '10^-3 as a metric prefix is:',
    options: ['kilo (k)', 'mega (M)', 'micro (µ)', 'milli (m)'],
    correctAnswer: 3,
  },
  {
    skill: 'prefix',
    question: '10^-6 as a metric prefix is:',
    options: ['milli (m)', 'micro (µ)', 'kilo (k)', 'mega (M)'],
    correctAnswer: 1,
  },
  {
    skill: 'prefix',
    question: '0.05 mA in amperes is:',
    options: ['0.05 A', '0.00005 A', '0.005 A', '50 A'],
    correctAnswer: 1,
  },
  {
    skill: 'prefix',
    question: '2.2 kΩ in ohms is:',
    options: ['2.2 Ω', '22 Ω', '2200 Ω', '2 200 000 Ω'],
    correctAnswer: 2,
  },
  {
    skill: 'prefix',
    question: '470 mV in volts is:',
    options: ['470 V', '0.47 V', '0.047 V', '4.7 V'],
    correctAnswer: 1,
  },
  {
    skill: 'prefix',
    question: '3.3 MΩ in ohms is:',
    options: ['3300 Ω', '33 000 Ω', '3 300 000 Ω', '0.0033 Ω'],
    correctAnswer: 2,
  },
  {
    skill: 'ohm',
    question: 'From I = V / R, voltage is:',
    options: ['V = I / R', 'V = R / I', 'V = I × R', 'V = I + R'],
    correctAnswer: 2,
  },
  {
    skill: 'ohm',
    question: 'From I = V / R, resistance is:',
    options: ['R = I / V', 'R = V / I', 'R = V × I', 'R = V + I'],
    correctAnswer: 1,
  },
  {
    skill: 'ohm',
    question: 'I = 2 A, R = 12 Ω. V =',
    options: ['6 V', '10 V', '24 V', '14 V'],
    correctAnswer: 2,
  },
  {
    skill: 'ohm',
    question: 'V = 230 V, R = 46 Ω. I ≈',
    options: ['0.2 A', '5 A', '10 A', '46 A'],
    correctAnswer: 1,
  },
  {
    skill: 'algebra',
    question: 'Solve 3x + 5 = 20 for x.',
    options: ['x = 5', 'x = 15', 'x = 8.3', 'x = 25'],
    correctAnswer: 0,
  },
  {
    skill: 'algebra',
    question: 'Solve 4R + 10 = 50 for R.',
    options: ['R = 10', 'R = 15', 'R = 40', 'R = 60'],
    correctAnswer: 0,
  },
  {
    skill: 'algebra',
    question: 'If 2x = 18, x =',
    options: ['8', '9', '16', '36'],
    correctAnswer: 1,
  },
];

export const TRANSPOSE_BANK: DrillItem[] = [
  {
    skill: 'ohm',
    question: 'Given I and R, which formula gives V?',
    options: ['V = I / R', 'V = I × R', 'V = R / I', 'V = I + R'],
    correctAnswer: 1,
  },
  {
    skill: 'ohm',
    question: 'Given V and R, which formula gives I?',
    options: ['I = V × R', 'I = R / V', 'I = V / R', 'I = V + R'],
    correctAnswer: 2,
  },
  {
    skill: 'ohm',
    question: 'Given V and I, which formula gives R?',
    options: ['R = V × I', 'R = I / V', 'R = V / I', 'R = V + I'],
    correctAnswer: 2,
  },
  {
    skill: 'power',
    question: 'Given V and I, which formula gives P?',
    options: ['P = V / I', 'P = V × I', 'P = I / V', 'P = V + I'],
    correctAnswer: 1,
  },
  {
    skill: 'power',
    question: 'Given P and I, which formula gives V?',
    options: ['V = P × I', 'V = I / P', 'V = P / I', 'V = P + I'],
    correctAnswer: 2,
  },
  {
    skill: 'power',
    question: 'Given P and V, which formula gives I?',
    options: ['I = P / V', 'I = V / P', 'I = P × V', 'I = P + V'],
    correctAnswer: 0,
  },
  {
    skill: 'power',
    question: 'Given I and R, which formula gives P?',
    options: ['P = I / R', 'P = I × R', 'P = I² × R', 'P = R / I²'],
    correctAnswer: 2,
  },
  {
    skill: 'power',
    question: 'Given V and R, which formula gives P?',
    options: ['P = V × R', 'P = V² / R', 'P = R / V²', 'P = V / R²'],
    correctAnswer: 1,
  },
  {
    skill: 'ohm',
    question: 'A 12 V lamp draws 3 A. R =',
    options: ['4 Ω', '9 Ω', '15 Ω', '36 Ω'],
    correctAnswer: 0,
  },
  {
    skill: 'power',
    question: '230 V at 10 A. P =',
    options: ['23 W', '240 W', '2300 W', '0.043 W'],
    correctAnswer: 2,
  },
];

export function buildAlgebraPaper(
  count: number,
  rng: () => number = Math.random,
) {
  return makeDrillPaper(REVIEW_BANK, count, rng);
}

export function buildTransposePaper(
  count: number,
  rng: () => number = Math.random,
) {
  return makeDrillPaper(TRANSPOSE_BANK, count, rng);
}

const REFLECT_CARDS: Flashcard[] = [
  {
    front: 'Voltage V in a circuit is like…',
    back: 'Electrical pressure that pushes charge. Higher V → more push for the same path.',
  },
  {
    front: 'Current I in a circuit is like…',
    back: 'Flow of charge (electrons in metal). Measured in amperes: coulombs per second.',
  },
  {
    front: 'Resistance R in a circuit is like…',
    back: 'Opposition to that flow. More R → less I for the same V (I = V / R).',
  },
  {
    front: 'Power P in a circuit is…',
    back: 'The rate energy is converted (heat, light, motion). P = V × I joules per second (watts).',
  },
  {
    front: 'Why I = V / R matches electron flow',
    back: 'More pressure (V) or an easier path (smaller R) means more charge passing a point each second.',
  },
  {
    front: 'A milliamp vs a microamp',
    back: 'mA is 10^-3 A (thousandths). µA is 10^-6 A (millionths). Same quantity, different scale.',
  },
];

export const ALGEBRA_MODULES: MathModule[] = [
  {
    id: 'a1',
    order: 1,
    title: 'Powers of 10 & Exponents',
    kind: 'tutorial',
    summary:
      'Write large and small electrical quantities as 10³, 10⁶, 10⁻³ and 10⁻⁶ instead of long strings of zeros.',
    concept:
      'An exponent on 10 counts how many places the decimal moves.\n\n• 10³ = 10 × 10 × 10 = 1 000 (decimal three places right)\n• 10⁶ = 1 000 000\n• 10⁰ = 1\n• 10⁻³ = 1 / 10³ = 0.001 (decimal three places left)\n• 10⁻⁶ = 0.000 001\n\nScientific notation is a × 10ⁿ with 1 ≤ a < 10. 230 V = 2.30 × 10² V. 0.047 A = 4.7 × 10⁻² A.\n\nMultiplying powers of ten: add the exponents (10³ × 10⁻⁶ = 10⁻³). Dividing: subtract them (10⁶ / 10³ = 10³).',
    whyItMatters:
      'Cable resistance, leakage current and radio-frequency values swing from mega to micro on one drawing. Writing 0.000047 A invites a missed zero; 47 × 10⁻⁶ A (or 47 µA) does not. Every metric prefix in the next module is just a named power of ten.',
    examples: [
      {
        title: 'A large number',
        problem: 'Write 1 000 000 Ω using a power of ten.',
        steps: [
          'Count zeros after 1: six zeros.',
          '1 000 000 = 10⁶.',
          'Or 1.0 × 10⁶ Ω, which is 1 MΩ in the next module.',
        ],
        answer: '10^6 Ω',
      },
      {
        title: 'A small number',
        problem: 'Write 0.001 A as a power of ten.',
        steps: [
          '0.001 is 1 / 1000 = 1 / 10³ = 10⁻³.',
          'Decimal moved three places left from 1 to 0.001.',
        ],
        answer: '10^-3 A',
      },
      {
        title: 'Combine powers',
        problem: '10^6 × 10^-3',
        steps: [
          'Add exponents: 6 + (−3) = 3.',
          '10^6 × 10^-3 = 10^3 = 1000.',
        ],
        answer: '10^3',
      },
    ],
    keyPoints: [
      '10^n moves the decimal n places right; 10^-n moves it left',
      '10^3 = 1000, 10^6 = 1 000 000, 10^-3 = 0.001, 10^-6 = 0.000 001',
      'Multiply powers of ten by adding exponents',
      'Scientific notation: a × 10^n with 1 ≤ a < 10',
    ],
    quizQuestions: [
      {
        question: '10^3 equals:',
        options: ['30', '100', '1000', '0.001'],
        correctAnswer: 2,
      },
      {
        question: '10^-3 equals:',
        options: ['-30', '0.001', '0.003', '1000'],
        correctAnswer: 1,
      },
      {
        question: '10^6 equals:',
        options: ['1 000 000', '60', '0.000 001', '100 000'],
        correctAnswer: 0,
      },
      {
        question: '10^6 × 10^-3 =',
        options: ['10^9', '10^3', '10^-18', '10^2'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'a2',
    order: 2,
    title: 'Metric Prefix Conversions',
    kind: 'tutorial',
    summary:
      'Convert between mega (M), kilo (k), milli (m) and micro (µ). Example: 0.05 mA to amperes.',
    concept:
      'A prefix is a nickname for a power of ten. On electrical drawings the four you will live in are:\n\n• M  mega   10^6     (megawatt, megohm)\n• k  kilo   10^3     (kilovolt, kiloohm)\n• m  milli  10^-3    (milliamp, millivolt)\n• µ  micro  10^-6    (microamp, microfarad) — written u when µ is unavailable\n\nMilli (m) and micro (µ) are different. 1 mA = 1000 µA. Mixing them up is a factor-of-1000 error.\n\nTo convert to the base unit, multiply by the factor: 0.05 mA = 0.05 × 10^-3 A = 5 × 10^-5 A = 0.00005 A.\n\nTo go the other way, divide by the factor: 0.00005 A = 50 × 10^-6 A = 50 µA.',
    whyItMatters:
      'Clamp meters, RCD ratings, electronics current and megger readings all speak prefix. If a drawing says 50 mA trip and you treat it as 50 µA, the device will never look “wrong” on paper and will never protect anyone. Convert to base units before you calculate, then convert back to report the answer.',
    examples: [
      {
        title: '0.05 mA to amperes',
        problem: 'Convert 0.05 mA to A.',
        steps: [
          'milli means × 10^-3.',
          '0.05 × 10^-3 = 0.00005 A.',
          'Check: 0.05 mA = 50 µA, and 50 × 10^-6 = 0.00005 A.',
        ],
        answer: '0.00005 A (5 × 10^-5 A)',
      },
      {
        title: 'Kilohms to ohms',
        problem: '2.2 kΩ in ohms.',
        steps: [
          'kilo means × 10^3.',
          '2.2 × 1000 = 2200 Ω.',
        ],
        answer: '2200 Ω',
      },
      {
        title: 'Millivolts to volts',
        problem: '470 mV to V.',
        steps: [
          '470 × 10^-3 = 0.470 V.',
          'Or move the decimal three places left: 470 → 0.470.',
        ],
        answer: '0.47 V',
      },
      {
        title: 'Megohms to ohms',
        problem: '3.3 MΩ in ohms.',
        steps: [
          'mega means × 10^6.',
          '3.3 × 1 000 000 = 3 300 000 Ω.',
        ],
        answer: '3 300 000 Ω',
      },
    ],
    tables: [
      {
        title: 'Prefix scale (learn M, k, m, µ)',
        headers: ['Prefix', 'Name', 'Power', 'Factor'],
        rows: PREFIX_SCALE.map((row) => [
          row.prefix,
          row.name,
          `10^${row.exp}`,
          row.factor,
        ]),
      },
    ],
    keyPoints: [
      'M = 10^6, k = 10^3, m = 10^-3, µ = 10^-6',
      'milli (m) is not micro (µ) — 1000× apart',
      'To base units: multiply by the prefix factor',
      '0.05 mA = 0.00005 A = 50 µA',
    ],
    quizQuestions: [
      {
        question: '0.05 mA in amperes is:',
        options: ['0.05 A', '0.00005 A', '0.005 A', '50 A'],
        correctAnswer: 1,
      },
      {
        question: 'The prefix for 10^-6 is:',
        options: ['milli (m)', 'kilo (k)', 'micro (µ)', 'mega (M)'],
        correctAnswer: 2,
      },
      {
        question: '2.2 kΩ equals:',
        options: ['2.2 Ω', '220 Ω', '2200 Ω', '2.2 MΩ'],
        correctAnswer: 2,
      },
      {
        question: '1 mA compared with 1 µA is:',
        options: ['The same', '1000 times larger', '1000 times smaller', '10 times larger'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'a3',
    order: 3,
    title: "Introduction to Ohm's Law Transposition",
    kind: 'tutorial',
    summary:
      'Start from I = V / R and isolate each variable: V = I × R and R = V / I.',
    concept:
      'Ohm’s law in current form is I = V / R. Algebra does not change the physics — it only changes which letter sits alone.\n\nTo get V: multiply both sides by R.\n  I = V / R\n  I × R = V\n  V = I × R\n\nTo get R: start from V = I × R and divide both sides by I.\n  R = V / I\n\nThe Ohm’s law circle is the same three statements. Cover the letter you want; the other two show whether you multiply (side by side) or divide (one above the other).\n\nWhatever you do to one side, do to the other. Units must match: V in volts, I in amperes, R in ohms — convert prefixes first.',
    whyItMatters:
      'You rarely get a worksheet that already asks for I. On site you measure two quantities and need the third: a voltage across a known heater element, a current through a known resistor, a resistance from V and I on the meter. Transposition is how one formula serves all three jobs.',
    diagram: OHM_CIRCLE,
    examples: [
      {
        title: 'Find V',
        problem: 'I = 2 A through R = 12 Ω. Find V.',
        steps: [
          'Want V, so V = I × R.',
          'V = 2 × 12 = 24 V.',
          'Check: I = 24 / 12 = 2 A. Consistent.',
        ],
        answer: '24 V',
      },
      {
        title: 'Find I',
        problem: 'V = 230 V across R = 46 Ω. Find I.',
        steps: [
          'I = V / R.',
          'I = 230 / 46 = 5 A.',
        ],
        answer: '5 A',
      },
      {
        title: 'Find R',
        problem: 'A 12 V lamp draws 3 A. Find R.',
        steps: [
          'R = V / I.',
          'R = 12 / 3 = 4 Ω.',
        ],
        answer: '4 Ω',
      },
    ],
    keyPoints: [
      'I = V / R, V = I × R, R = V / I — same law',
      'Cover the unknown on the circle; remaining letters tell the operation',
      'Do the same operation to both sides of the equals sign',
      'Convert mA, kΩ, etc. to A and Ω before substituting',
    ],
    quizQuestions: [
      {
        question: 'From I = V / R, V equals:',
        options: ['V = I / R', 'V = I × R', 'V = R / I', 'V = I + R'],
        correctAnswer: 1,
      },
      {
        question: 'From I = V / R, R equals:',
        options: ['R = V / I', 'R = I / V', 'R = V × I', 'R = I − V'],
        correctAnswer: 0,
      },
      {
        question: 'I = 2 A, R = 12 Ω. V =',
        options: ['6 V', '10 V', '14 V', '24 V'],
        correctAnswer: 3,
      },
      {
        question: 'V = 12 V, I = 3 A. R =',
        options: ['4 Ω', '9 Ω', '15 Ω', '36 Ω'],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'a4',
    order: 4,
    title: "Solving Linear Equations for 'x'",
    kind: 'tutorial',
    summary:
      'Balance both sides of an equals sign to isolate an unknown — the same moves used on V, I and R.',
    concept:
      'A linear equation is a balance. 3x + 5 = 20 means “three lots of x, plus five, is twenty.” To isolate x:\n\n1. Undo addition/subtraction first (the last BODMAS layer).\n   3x + 5 = 20\n   3x = 20 − 5 = 15\n2. Undo multiplication/division.\n   x = 15 / 3 = 5\n\nCheck by substituting back: 3(5) + 5 = 20. True.\n\nIf x is on the right, you can swap sides (equals is symmetric) or still operate on both sides. 18 = 2x is the same as 2x = 18, so x = 9.\n\nElectrical version: 4R + 10 = 50 is “four resistors plus a 10 Ω extra = 50 Ω.” Same steps, R = 10 Ω.',
    whyItMatters:
      'Transposing Ohm’s law is this skill with nicer letters. Voltage-drop, series strings and “what resistor do I need?” are all isolate-the-unknown. If you can solve for x on paper, you can solve for R on a job without memorising three separate tricks.',
    examples: [
      {
        title: 'Undo add, then divide',
        problem: '3x + 5 = 20',
        steps: [
          'Subtract 5 from both sides: 3x = 15.',
          'Divide both sides by 3: x = 5.',
          'Check: 3 × 5 + 5 = 20.',
        ],
        answer: 'x = 5',
      },
      {
        title: 'Unknown on the right',
        problem: '18 = 2x',
        steps: [
          'Same as 2x = 18.',
          'Divide both sides by 2: x = 9.',
        ],
        answer: 'x = 9',
      },
      {
        title: 'Electrical stand-in',
        problem: '4R + 10 = 50  (four equal resistors plus 10 Ω = 50 Ω)',
        steps: [
          'Subtract 10: 4R = 40.',
          'Divide by 4: R = 10 Ω.',
          'Check: 4 × 10 + 10 = 50.',
        ],
        answer: 'R = 10 Ω',
      },
      {
        title: 'With a prefix',
        problem: 'I × 2.2 kΩ = 11 V. Find I in mA.',
        steps: [
          'Convert 2.2 kΩ → 2200 Ω first.',
          'I = 11 / 2200 = 0.005 A.',
          '0.005 A = 5 mA.',
        ],
        answer: '5 mA',
      },
    ],
    keyPoints: [
      'Equals means balance — same operation on both sides',
      'Undo +/− first, then ×/÷ (reverse BODMAS)',
      'Substitute back to check',
      'Convert prefixes before substituting numbers',
    ],
    quizQuestions: [
      {
        question: '3x + 5 = 20. x =',
        options: ['5', '15', '8', '25'],
        correctAnswer: 0,
      },
      {
        question: '2x = 18. x =',
        options: ['8', '9', '16', '36'],
        correctAnswer: 1,
      },
      {
        question: '4R + 10 = 50. R =',
        options: ['10', '15', '40', '60'],
        correctAnswer: 0,
      },
      {
        question: 'To isolate x in 5x − 7 = 18 you first:',
        options: [
          'Divide by 5',
          'Add 7 to both sides',
          'Subtract 18',
          'Multiply by 5',
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'a5',
    order: 5,
    title: 'Math & Formula Review',
    kind: 'drill',
    summary:
      'Drill metric prefix conversions and algebraic transpositions until they feel automatic.',
    concept:
      'This is a mixed paper: powers of ten, M/k/m/µ conversions, Ohm’s law moves, and isolate-x. Ten minutes, twelve questions. Skip does not count as wrong. Pass at 70% with at least eight answered.',
    whyItMatters:
      'Prefix mistakes and frozen transpositions are the two fastest ways to get a correct formula and a wrong number. Mixing them under a clock is how they become one skill instead of two homework topics.',
    examples: [
      {
        title: 'How the review runs',
        problem: '12 mixed questions, 10:00 on the clock.',
        steps: [
          'One question, four options.',
          'Lock in or skip. Clock does not pause.',
          '≥ 8 answered at ≥ 70% marks the module complete.',
        ],
        answer: 'Retry until prefixes and transpositions feel automatic',
      },
    ],
    keyPoints: [
      'M k m µ and 10^6 10^3 10^-3 10^-6',
      'V = IR, I = V/R, R = V/I',
      'Undo +/− then ×/÷',
      '70% of at least 8 answered to pass',
    ],
    quizQuestions: [
      {
        question: 'This review drill lasts:',
        options: ['90 seconds', '5 minutes', '10 minutes', '1.5 minutes per question'],
        correctAnswer: 2,
      },
    ],
    drillBank: REVIEW_BANK,
    drillSeconds: 600,
    drillPaperSize: 12,
    drillPassPercent: 70,
    drillPassAnswered: 8,
  },
  {
    id: 'a6',
    order: 6,
    title: 'Algebraic & Metric Prefix Drills',
    kind: 'drill',
    summary:
      'Timed transpositions of Ohm’s law and power equations. Target under 1.5 minutes per equation.',
    concept:
      'Each equation is its own sprint: 1 minute 30 seconds on the clock. Cover the unknown, write the move, pick the option. Prefixes should already be converted in your head from module 2.\n\nPower sits on the same pattern as Ohm’s law: P = V × I, so V = P / I and I = P / V. Also P = I²R and P = V²/R.\n\nPass: at least 6 answered, 70% correct, and average time on answered items at or under 90 seconds.',
    whyItMatters:
      'A leading hand will not wait while you recite a rhyme. Sub-90-second transpositions mean you can size a load or check a reading while still looking at the circuit, not at a formula sheet.',
    examples: [
      {
        title: 'One sprint',
        problem: 'Given P and I, find V.',
        steps: [
          'P = V × I, so V = P / I.',
          'If that took under 1:30 you are on target.',
        ],
        answer: 'V = P / I',
      },
    ],
    keyPoints: [
      '1:30 maximum per equation',
      'Ohm: V = IR, I = V/R, R = V/I',
      'Power: P = VI = I²R = V²/R',
      'Average ≤ 90 s and 70% of at least 6 answered to pass',
    ],
    quizQuestions: [
      {
        question: 'The per-equation target is:',
        options: ['10 minutes', '30 seconds', '1.5 minutes', '5 minutes'],
        correctAnswer: 2,
      },
    ],
    drillBank: TRANSPOSE_BANK,
    drillPaperSize: 8,
    drillPassPercent: 70,
    drillPassAnswered: 6,
    perQuestionSeconds: PREFIX_TARGET_SECONDS,
  },
  {
    id: 'a7',
    order: 7,
    title: 'Reflect',
    kind: 'flashcards',
    summary:
      'Pause and connect the formulae to real circuits and electron flow — not just letters on a page.',
    concept:
      'V, I, R and P are not exam tokens. In a metal, electrons are already there. A voltage source rearranges the electric field so they drift; that drift is current. Resistance is how hard the material and geometry make that drift. Power is how fast electrical energy becomes heat, light or motion.\n\nI = V / R says: more pressure, or an easier path, more flow. P = V × I says: a lot of pressure with a lot of flow dumps a lot of energy per second — that is why a 230 V × 10 A heater is 2.3 kW and hot.\n\nPrefixes do not change the physics. 50 mA and 0.05 A are the same flow. The prefix only keeps the number readable.\n\nThe pipe analogy (pressure / flow / restriction) helps intuition. It is an analogy, not a model of electrons as water. Use it, then come back to charge, field and energy.',
    whyItMatters:
      'People who only memorise V = IR freeze when the letters move. People who see pressure, flow and opposition can transpose because they already know what must stay true in the circuit. That is the difference between a formula and a trade.',
    examples: [
      {
        title: 'Same law, physical reading',
        problem: 'Why must I drop if R rises and V is fixed?',
        steps: [
          'V is the pressure the source maintains.',
          'R rose — the path is harder.',
          'Less charge passes per second: I = V / R falls.',
          'The circuit did the algebra before you wrote it.',
        ],
        answer: 'Fixed V, larger R → smaller I',
      },
    ],
    keyPoints: [
      'V = electrical pressure, I = charge flow, R = opposition, P = energy per second',
      'I = V/R is that sentence in symbols',
      'Prefixes rescale the same physical quantity',
      'Pipe analogy is a crutch — the quantities are field, charge and energy',
    ],
    quizQuestions: [
      {
        question: 'In Ohm’s law, current is the physical idea of:',
        options: [
          'Electrical pressure',
          'Charge flowing per second',
          'Energy stored',
          'Cable colour',
        ],
        correctAnswer: 1,
      },
      {
        question: 'If V is fixed and R increases, I:',
        options: ['Increases', 'Stays the same', 'Decreases', 'Becomes power'],
        correctAnswer: 2,
      },
      {
        question: '50 mA compared with 0.05 A is:',
        options: [
          'A thousand times smaller',
          'The same current',
          'A thousand times larger',
          'A voltage',
        ],
        correctAnswer: 1,
      },
    ],
    flashcards: REFLECT_CARDS,
  },
  {
    id: 'a8',
    order: 8,
    title: 'Study Guide & Key Focus',
    kind: 'guide',
    summary:
      'Ohm’s law circle plus the metric prefix scale (M, k, m, µ). Isolate V, I, R and power quickly.',
    concept:
      'Keep two pictures:\n\n1. Prefix ladder — each step is 10³ (or 10^-3 going down):\n   M (10^6) → k (10^3) → base → m (10^-3) → µ (10^-6)\n   milli is m, micro is µ. Never swap them.\n\n2. Ohm’s law circle — cover the unknown.\n   V on top, I and R below. Side by side means multiply; one over the other means divide.\n   Power uses the same pattern with P, V and I.\n\nPractice until covering a letter is faster than reciting a rhyme. Convert prefixes to base units, substitute, then prefix the answer if needed.',
    whyItMatters:
      'This is the working kit for almost every Cert II calculation that follows: current in a heater, voltage at a load, resistance from a meter, power of a circuit, and any value that arrived as mA or kΩ.',
    diagram: `${OHM_CIRCLE}\n\n${POWER_CIRCLE}`,
    tables: [
      {
        title: 'Prefix scale (M, k, m, µ)',
        headers: ['Prefix', 'Name', 'Power of 10', 'Example'],
        rows: PREFIX_SCALE.filter((row) => row.prefix !== '(none)').map((row) => [
          row.prefix,
          row.name,
          `10^${row.exp}`,
          row.example,
        ]),
      },
    ],
    examples: [
      {
        title: 'Full path: prefix then transpose',
        problem: 'A 24 V supply feeds a 2.2 kΩ resistor. Find I in mA.',
        steps: [
          '2.2 kΩ = 2200 Ω.',
          'I = V / R = 24 / 2200 ≈ 0.0109 A.',
          '0.0109 A ≈ 11 mA (to two figures).',
        ],
        answer: '≈ 11 mA',
      },
    ],
    keyPoints: [
      'M 10^6, k 10^3, m 10^-3, µ 10^-6',
      'Cover the unknown on the V–I–R circle',
      'P = VI; cover to get V = P/I or I = P/V',
      'Prefixes first, then substitute, then prefix the answer',
    ],
    quizQuestions: [
      {
        question: 'Covering V on the Ohm’s law circle leaves:',
        options: ['I × R', 'I / R', 'I + R', 'P / I'],
        correctAnswer: 0,
      },
      {
        question: 'The prefix µ means:',
        options: ['10^-3', '10^-6', '10^3', '10^6'],
        correctAnswer: 1,
      },
      {
        question: 'P = 2300 W, V = 230 V. I =',
        options: ['0.1 A', '10 A', '230 A', '2530 A'],
        correctAnswer: 1,
      },
      {
        question: '0.05 mA is how many amperes?',
        options: ['5 × 10^-2 A', '5 × 10^-5 A', '5 × 10^-6 A', '5 × 10^3 A'],
        correctAnswer: 1,
      },
    ],
  },
];

export const ALGEBRA_UNIT: Unit = {
  id: 'algebra',
  code: 'ALG',
  name: 'Scientific Notation, Prefixes & Algebra',
  description:
    'Powers of ten, metric prefixes, Ohm’s law transposition, linear equations, timed drills, and a physical-meaning reflection. Does not count toward UEE22020 unit points.',
  prerequisites: [],
  points: 0,
  kind: 'core',
  topics: ALGEBRA_MODULES.map((module) => ({
    id: module.id,
    title: module.title,
    content: module.summary,
    keyPoints: module.keyPoints,
    quizQuestions: module.quizQuestions,
  })),
};

export function isAlgebraModuleUnlocked(
  module: MathModule,
  completions: Record<string, boolean> | undefined,
): boolean {
  return isModuleUnlocked(ALGEBRA_MODULES, module, completions);
}
