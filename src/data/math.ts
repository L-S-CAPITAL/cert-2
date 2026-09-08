import { DrillItem, Flashcard, MathModule, Unit } from '../types';
import { isModuleUnlocked, makeDrillPaper, scoreDrill } from './drill';

export { scoreDrill };

export const DRILL_SECONDS = 600;

export const EIGHTHS = [
  { fraction: '1/8', decimal: 0.125, percent: '12.5%' },
  { fraction: '1/4', decimal: 0.25, percent: '25%' },
  { fraction: '3/8', decimal: 0.375, percent: '37.5%' },
  { fraction: '1/2', decimal: 0.5, percent: '50%' },
  { fraction: '5/8', decimal: 0.625, percent: '62.5%' },
  { fraction: '3/4', decimal: 0.75, percent: '75%' },
  { fraction: '7/8', decimal: 0.875, percent: '87.5%' },
] as const;

export const DRILL_BANK: DrillItem[] = [
  {
    skill: 'decimal',
    question: 'Convert 1/2 to a decimal (no calculator).',
    options: ['0.2', '0.5', '0.25', '1.2'],
    correctAnswer: 1,
  },
  {
    skill: 'decimal',
    question: 'Convert 1/4 to a decimal.',
    options: ['0.14', '0.4', '0.25', '0.75'],
    correctAnswer: 2,
  },
  {
    skill: 'decimal',
    question: 'Convert 3/4 to a decimal.',
    options: ['0.34', '0.43', '0.7', '0.75'],
    correctAnswer: 3,
  },
  {
    skill: 'decimal',
    question: 'Convert 1/8 to a decimal.',
    options: ['0.125', '0.18', '0.8', '0.0125'],
    correctAnswer: 0,
  },
  {
    skill: 'decimal',
    question: 'Convert 3/8 to a decimal.',
    options: ['0.3', '0.38', '0.375', '0.835'],
    correctAnswer: 2,
  },
  {
    skill: 'decimal',
    question: 'Convert 5/8 to a decimal.',
    options: ['0.58', '0.625', '0.652', '0.875'],
    correctAnswer: 1,
  },
  {
    skill: 'decimal',
    question: 'Convert 7/8 to a decimal.',
    options: ['0.78', '0.875', '0.788', '0.125'],
    correctAnswer: 1,
  },
  {
    skill: 'fraction',
    question: '1/8 + 1/8 =',
    options: ['1/16', '2/8 = 1/4', '1/4 + 1/8', '8/8'],
    correctAnswer: 1,
  },
  {
    skill: 'fraction',
    question: '1/2 + 1/4 =',
    options: ['1/6', '2/6', '3/4', '1/8'],
    correctAnswer: 2,
  },
  {
    skill: 'fraction',
    question: '3/4 − 1/8 =',
    options: ['2/4', '5/8', '1/2', '2/8'],
    correctAnswer: 1,
  },
  {
    skill: 'fraction',
    question: '1 3/8 as an improper fraction is:',
    options: ['4/8', '11/8', '13/8', '3/8'],
    correctAnswer: 1,
  },
  {
    skill: 'fraction',
    question: '2 1/4 − 7/8 =',
    options: ['1 3/8', '1 1/4', '1 5/8', '2 1/8'],
    correctAnswer: 0,
  },
  {
    skill: 'bodmas',
    question: '3 + 4 × 2 =',
    options: ['14', '11', '10', '24'],
    correctAnswer: 1,
  },
  {
    skill: 'bodmas',
    question: '(8 − 2) × 3 =',
    options: ['2', '14', '18', '24'],
    correctAnswer: 2,
  },
  {
    skill: 'bodmas',
    question: '16 ÷ 4 × 2 =',
    options: ['2', '8', '32', '1'],
    correctAnswer: 1,
  },
  {
    skill: 'bodmas',
    question: '5 + 3² =',
    options: ['16', '64', '11', '14'],
    correctAnswer: 3,
  },
  {
    skill: 'bodmas',
    question: '20 − 6 ÷ 2 + 1 =',
    options: ['8', '18', '15', '7'],
    correctAnswer: 1,
  },
  {
    skill: 'percent',
    question: '10% of 230 V =',
    options: ['2.3 V', '10 V', '23 V', '2300 V'],
    correctAnswer: 2,
  },
  {
    skill: 'percent',
    question: '80% of a 20 A breaker rating =',
    options: ['16 A', '18 A', '2 A', '24 A'],
    correctAnswer: 0,
  },
  {
    skill: 'percent',
    question: '5% of 400 V =',
    options: ['5 V', '20 V', '8 V', '50 V'],
    correctAnswer: 1,
  },
];

export function buildDrillPaper(
  count: number,
  rng: () => number = Math.random,
) {
  return makeDrillPaper(DRILL_BANK ?? [], count, rng);
}

const FLASHCARDS: Flashcard[] = [
  { front: 'Ohm’s law (voltage)', back: 'V = I × R' },
  { front: 'Ohm’s law (current)', back: 'I = V ÷ R' },
  { front: 'Ohm’s law (resistance)', back: 'R = V ÷ I' },
  { front: 'Power (basic)', back: 'P = V × I' },
  { front: 'Power from current and resistance', back: 'P = I² × R' },
  { front: 'Power from voltage and resistance', back: 'P = V² ÷ R' },
  { front: '1/8 as a decimal', back: '0.125' },
  { front: '3/8 as a decimal', back: '0.375' },
  { front: '5/8 as a decimal', back: '0.625' },
  { front: '7/8 as a decimal', back: '0.875' },
  { front: 'BODMAS / BIDMAS', back: 'Brackets, Orders (indices), Division/Multiplication (left to right), Addition/Subtraction (left to right)' },
  { front: '80% breaker loading (continuous)', back: 'Design continuous load ≤ 0.8 × breaker rating (e.g. 16 A on a 20 A breaker)' },
];

export const MATH_MODULES: MathModule[] = [
  {
    id: 'm1',
    order: 1,
    title: 'Basic Fractions & Decimals',
    kind: 'tutorial',
    summary:
      'Convert common trade fractions (1/2, 1/4, 3/4, then eighths) to decimals without a calculator.',
    concept:
      'A fraction is a division: numerator ÷ denominator. 1/2 means 1 ÷ 2 = 0.5. On the tools you will meet halves, quarters and eighths constantly — tape measures, knockouts, bushings, and imperial fittings still use them even on metric sites. Memorise the family, then you can read a scale and write a decimal for a calculator or a drawing without stopping to divide longhand every time.\n\nHalves and quarters first:\n• 1/2 = 0.5\n• 1/4 = 0.25 (half of a half)\n• 3/4 = 0.75 (three lots of 0.25)\n\nEighths are half of a quarter (0.25 ÷ 2 = 0.125):\n• 1/8 = 0.125, 2/8 = 1/4 = 0.25, 3/8 = 0.375, 4/8 = 1/2 = 0.5, 5/8 = 0.625, 6/8 = 3/4 = 0.75, 7/8 = 0.875.',
    whyItMatters:
      'If you mis-read 3/4" as 0.34 you are nearly 10 mm out on a single mark. Cable glands, locknuts and strut holes are unforgiving. Electricians also convert fractions to decimals before they sit in Ohm’s law or voltage-drop arithmetic. Doing 1/2, 1/4 and 3/4 in your head is the foundation for every later module.',
    examples: [
      {
        title: 'Half a metre of tail',
        problem: 'A drawing calls for 1/2 m of earth tail. What decimal metres is that?',
        steps: [
          'Fraction 1/2 means 1 ÷ 2.',
          '1 ÷ 2 = 0.5.',
          'Write 0.5 m (or 500 mm).',
        ],
        answer: '0.5 m',
      },
      {
        title: 'Quarter-inch gland clearance',
        problem: 'A template shows 1/4". Convert to a decimal inch, no calculator.',
        steps: [
          '1/4 = 1 ÷ 4.',
          '4 goes into 1.00 two times (0.25) because 4 × 0.25 = 1.',
          'Check: 1/4 is half of 1/2, and half of 0.5 is 0.25.',
        ],
        answer: '0.25"',
      },
      {
        title: 'Three-quarters along a ladder rack',
        problem: 'You have marked 3/4 of a 1.00 m stick. Decimal metres?',
        steps: [
          '3/4 = 3 ÷ 4.',
          '4 × 0.75 = 3, so 3 ÷ 4 = 0.75.',
          'Check: 1/4 = 0.25, three of those is 0.75.',
        ],
        answer: '0.75 m',
      },
    ],
    keyPoints: [
      'A fraction is division: numerator ÷ denominator',
      '1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75 — learn these cold',
      '1/8 = 0.125; every extra eighth adds 0.125',
      'Always sanity-check: 3/4 must be more than 1/2',
    ],
    quizQuestions: [
      {
        question: '1/2 as a decimal is:',
        options: ['0.2', '0.5', '0.25', '1.2'],
        correctAnswer: 1,
      },
      {
        question: '1/4 as a decimal is:',
        options: ['0.4', '0.14', '0.25', '0.75'],
        correctAnswer: 2,
      },
      {
        question: '3/4 as a decimal is:',
        options: ['0.34', '0.75', '0.43', '1.34'],
        correctAnswer: 1,
      },
      {
        question: 'Which is largest?',
        options: ['1/4', '1/2', '3/4', '1/8'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'm2',
    order: 2,
    title: 'Advanced Fractional Addition & Subtraction',
    kind: 'tutorial',
    summary:
      'Add and subtract mixed fractions used in measuring lengths (for example 1 3/8").',
    concept:
      'You can only add or subtract fractions that share a denominator. Convert mixed numbers to improper fractions (or split the whole and the fraction), find a common denominator, add/subtract numerators, then simplify.\n\nMixed → improper: 1 3/8 = (1 × 8 + 3)/8 = 11/8.\n\nCommon denominators for trade eighths and sixteenths: 8 and 16. Halves and quarters already sit on 8: 1/2 = 4/8, 1/4 = 2/8, 3/4 = 6/8.\n\nAfter adding, if the numerator is larger than the denominator, pull out wholes: 15/8 = 1 7/8.',
    whyItMatters:
      'Gland plates, DIN rail cut-outs, earth-bar centres and imperial locknuts are specified as mixed fractions. Adding two offsets of 1 3/8" and 2 1/4" in your head (or on the tape) is faster and safer than guessing. A 1/8" error stacks across a run of holes.',
    examples: [
      {
        title: 'Two box offsets',
        problem: 'Add 1 3/8" + 2 1/4".',
        steps: [
          'Convert 1/4 to eighths: 1/4 = 2/8, so 2 1/4" = 2 2/8".',
          'Wholes: 1 + 2 = 3.',
          'Fractions: 3/8 + 2/8 = 5/8.',
          'Combine: 3 5/8".',
        ],
        answer: '3 5/8"',
      },
      {
        title: 'Cut-back from a 4" mark',
        problem: '4" − 1 3/8".',
        steps: [
          'Write 4 as 3 8/8 (borrow one whole = 8/8).',
          '3 − 1 = 2 wholes.',
          '8/8 − 3/8 = 5/8.',
          'Result 2 5/8".',
        ],
        answer: '2 5/8"',
      },
      {
        title: 'Improper fraction check',
        problem: 'Express 1 3/8" as an improper fraction, then as a decimal.',
        steps: [
          '1 3/8 = 11/8.',
          '11 ÷ 8 = 1.375 (because 8 × 1.375 = 11).',
          'Check: 1 + 0.375 = 1.375.',
        ],
        answer: '11/8 = 1.375"',
      },
    ],
    keyPoints: [
      'Same denominator before you add or subtract',
      '1/2 = 4/8, 1/4 = 2/8, 3/4 = 6/8',
      'Mixed to improper: wholes × denominator + numerator',
      'Borrow 8/8 when subtracting a larger fraction from a whole',
    ],
    quizQuestions: [
      {
        question: '1 3/8" as an improper fraction is:',
        options: ['4/8', '8/3', '11/8', '13/8'],
        correctAnswer: 2,
      },
      {
        question: '1 3/8" + 2 1/4" =',
        options: ['3 1/8"', '3 4/8"', '3 5/8"', '4 1/8"'],
        correctAnswer: 2,
      },
      {
        question: '4" − 1 3/8" =',
        options: ['2 5/8"', '3 3/8"', '2 3/8"', '3 5/8"'],
        correctAnswer: 0,
      },
      {
        question: '3/4 − 1/8 =',
        options: ['2/4', '1/2', '5/8', '2/8'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'm3',
    order: 3,
    title: 'Order of Operations (BODMAS/BIDMAS)',
    kind: 'tutorial',
    summary:
      'Solve multi-step arithmetic by Brackets, Orders, Division/Multiplication, Addition/Subtraction.',
    concept:
      'BODMAS (also taught as BIDMAS) is the order that keeps a written calculation unambiguous:\n1. Brackets\n2. Orders (powers and roots — the “I” in BIDMAS is Indices)\n3. Division and Multiplication, left to right — they are equal priority\n4. Addition and Subtraction, left to right — also equal priority\n\nA common trap is doing all addition before multiplication, or treating ÷ as weaker than ×. 16 ÷ 4 × 2 is (16 ÷ 4) × 2 = 8, not 16 ÷ 8 = 2.\n\nAnother trap: 5 + 3² is 5 + 9 = 14, not 8² = 64. Orders before addition.',
    whyItMatters:
      'Electrical formulae stack operations: P = V × I, series resistances add, parallel uses reciprocals, energy is P × t. If you evaluate 230 × 10 + 12 / 2 in the wrong order you will size a load or a fuse from fiction. BODMAS is how you and a calculator (in scientific mode) stay aligned.',
    examples: [
      {
        title: 'Multiplication before addition',
        problem: '3 + 4 × 2',
        steps: [
          'No brackets. No orders.',
          'Multiplication first: 4 × 2 = 8.',
          'Then addition: 3 + 8 = 11.',
          'Not 7 × 2 = 14.',
        ],
        answer: '11',
      },
      {
        title: 'Brackets first',
        problem: '(8 − 2) × 3',
        steps: [
          'Brackets: 8 − 2 = 6.',
          'Then 6 × 3 = 18.',
          'Without brackets, 8 − 2 × 3 = 8 − 6 = 2.',
        ],
        answer: '18',
      },
      {
        title: 'Left-to-right ÷ and ×',
        problem: '16 ÷ 4 × 2',
        steps: [
          'Division and multiplication share priority, so go left to right.',
          '16 ÷ 4 = 4.',
          '4 × 2 = 8.',
        ],
        answer: '8',
      },
      {
        title: 'Orders before addition',
        problem: '5 + 3²',
        steps: [
          'Orders (indices) before addition: 3² = 9.',
          '5 + 9 = 14.',
        ],
        answer: '14',
      },
      {
        title: 'Mixed four-step',
        problem: '20 − 6 ÷ 2 + 1',
        steps: [
          'Division first: 6 ÷ 2 = 3.',
          'Now 20 − 3 + 1.',
          'Left to right: 20 − 3 = 17, then 17 + 1 = 18.',
        ],
        answer: '18',
      },
    ],
    keyPoints: [
      'Brackets, then Orders/indices, then ÷ and × left to right, then + and − left to right',
      '÷ and × are the same priority — never “do all the × first”',
      '+ and − are the same priority — left to right',
      'Write a new line after each BODMAS step so you can audit the working',
    ],
    quizQuestions: [
      {
        question: '3 + 4 × 2 =',
        options: ['14', '11', '10', '24'],
        correctAnswer: 1,
      },
      {
        question: '(8 − 2) × 3 =',
        options: ['2', '14', '18', '24'],
        correctAnswer: 2,
      },
      {
        question: '16 ÷ 4 × 2 =',
        options: ['2', '8', '32', '1'],
        correctAnswer: 1,
      },
      {
        question: '5 + 3² =',
        options: ['64', '16', '14', '11'],
        correctAnswer: 2,
      },
      {
        question: '20 − 6 ÷ 2 + 1 =',
        options: ['8', '18', '15', '7'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'm4',
    order: 4,
    title: 'Trade Percentages',
    kind: 'tutorial',
    summary:
      'Percentages for electrical tolerances, safety margins, and simple increments.',
    concept:
      'Percent means “per hundred”. 5% = 5/100 = 0.05. To take a percentage of a quantity: convert the percent to a decimal, then multiply.\n\n• 10% of 230 V = 0.10 × 230 = 23 V\n• 5% of 400 V = 0.05 × 400 = 20 V\n• 80% of 20 A = 0.80 × 20 = 16 A\n\nA 10% increase multiplies by 1.10. A 10% decrease multiplies by 0.90. “Add a 25% margin” means multiply by 1.25.\n\nQuick 10%: move the decimal one place left (230 → 23). 5% is half of 10%. 1% is one-tenth of 10%.',
    whyItMatters:
      'You will use percentages for voltage-drop budgets (often 5% at the circuit, check AS/NZS 3000 for the actual limit on the job), continuous-load derating on breakers (commonly 80%), tolerance on supply (e.g. 230 V ±10%), and “add 10% spare” on cable length or containment. Getting 80% of 20 A wrong is a nuisance trip or an overloaded protective device.',
    examples: [
      {
        title: 'Supply tolerance',
        problem: 'What is 10% of 230 V (nominal single-phase)?',
        steps: [
          '10% = 0.10.',
          '0.10 × 230 = 23.',
          'Shortcut: 10% is the number with the decimal shifted one place: 23 V.',
        ],
        answer: '23 V',
      },
      {
        title: 'Continuous load on a breaker',
        problem: '80% of a 20 A breaker rating.',
        steps: [
          '80% = 0.80.',
          '0.80 × 20 = 16 A.',
          'A 16 A continuous load is the usual planning cap on a 20 A device.',
        ],
        answer: '16 A',
      },
      {
        title: 'Voltage-drop budget',
        problem: '5% of a 400 V three-phase nominal.',
        steps: [
          '5% = 0.05.',
          '0.05 × 400 = 20 V.',
          'Or: 10% of 400 is 40 V; half of that is 20 V.',
        ],
        answer: '20 V',
      },
      {
        title: 'Add a length margin',
        problem: 'A run is 40 m. Add 10% spare. What length do you pull?',
        steps: [
          '10% of 40 m = 4 m.',
          '40 + 4 = 44 m.',
          'Same as 40 × 1.10 = 44 m.',
        ],
        answer: '44 m',
      },
    ],
    keyPoints: [
      'n% of x = (n / 100) × x',
      '10% = shift the decimal one place; 5% = half of 10%',
      '80% loading: 0.8 × device rating',
      '“Add 10%” means multiply by 1.10, not by 0.10',
    ],
    quizQuestions: [
      {
        question: '10% of 230 V is:',
        options: ['2.3 V', '23 V', '10 V', '230 V'],
        correctAnswer: 1,
      },
      {
        question: '80% of 20 A is:',
        options: ['8 A', '12 A', '16 A', '18 A'],
        correctAnswer: 2,
      },
      {
        question: '5% of 400 V is:',
        options: ['5 V', '20 V', '40 V', '80 V'],
        correctAnswer: 1,
      },
      {
        question: '40 m plus 10% spare is:',
        options: ['4 m', '36 m', '44 m', '50 m'],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 'm5',
    order: 5,
    title: 'Math Review & Speed Drill',
    kind: 'drill',
    summary:
      'Ten-minute timed self-test on fractions, decimals, and BODMAS to build reflex speed.',
    concept:
      'Speed on site is not rushing the working — it is having the easy conversions already in muscle memory so you can spend attention on the circuit, not on 3/8 = ?. This drill mixes modules 1–4 under a 10-minute clock. Answer what you can; skipped items do not count as wrong, but they do not raise your percent either.\n\nTarget: at least eight answered with 70% or better. That marks the module complete. You can retry as often as you like.',
    whyItMatters:
      'When a leading hand asks “what’s 80% of 32?” or you are converting a tape reading while holding a ladder, you will not open a calculator app. Reflexes come from timed, mixed practice — the same way you learn to strip cable to length.',
    examples: [
      {
        title: 'How the drill runs',
        problem: '12 mixed questions, 10:00 on the clock.',
        steps: [
          'One question at a time. Four options.',
          'Answer or skip. The clock does not pause.',
          'At 0:00 or when the paper is finished, you see score / answered.',
        ],
        answer: 'Aim for ≥ 70% with at least 8 answered',
      },
    ],
    keyPoints: [
      '10 minutes, mixed fractions / decimals / BODMAS / percentages',
      'Skipped questions are unanswered, not incorrect',
      '70% of answered (minimum 8) marks the module complete',
      'Retry until the conversions feel automatic',
    ],
    quizQuestions: [
      {
        question: 'The speed drill lasts:',
        options: ['2 minutes', '5 minutes', '10 minutes', '30 minutes'],
        correctAnswer: 2,
      },
      {
        question: 'A skipped drill question is counted as:',
        options: [
          'Incorrect',
          'Correct',
          'Unanswered (ignored in the percent)',
          'Half a mark',
        ],
        correctAnswer: 2,
      },
    ],
    drillSeconds: DRILL_SECONDS,
    drillBank: DRILL_BANK,
    drillPaperSize: 12,
    drillPassPercent: 70,
    drillPassAnswered: 8,
  },
  {
    id: 'm6',
    order: 6,
    title: 'Mental Recovery & Flashcards',
    kind: 'flashcards',
    summary:
      'Rest your mind for the algebraic challenges ahead. Review flashcards of core equations briefly.',
    concept:
      'You have just loaded fractions, mixed numbers, BODMAS and percentages. Before algebra (rearranging V = IR, P = VI, and later energy and three-phase), park the working memory and only rehearse the identities. Flip a card, say the back out loud, then check. Two slow passes beat one panicked cram.\n\nThis module is deliberately light. Sit, breathe, and treat the cards as a cool-down, not another exam.',
    whyItMatters:
      'Fatigue is how 3 + 4 × 2 becomes 14 on a real job. A short recovery block between drills and algebra is a safety control, not a luxury. The cards you keep are the ones you will rearrange later: Ohm’s law and power.',
    examples: [
      {
        title: 'How to use a card',
        problem: 'Front: “Ohm’s law (current)”',
        steps: [
          'Cover the back. Say the formula.',
          'I = V ÷ R. Check.',
          'If you hesitated, put the card to the left and see it again at the end.',
        ],
        answer: 'I = V ÷ R',
      },
    ],
    keyPoints: [
      'This is a rest module — accuracy over speed',
      'Ohm’s law: V = IR, I = V/R, R = V/I',
      'Power: P = VI = I²R = V²/R',
      'Keep eighths (0.125 steps) on the same cards',
    ],
    quizQuestions: [
      {
        question: 'Ohm’s law for current is:',
        options: ['I = V × R', 'I = V ÷ R', 'I = R ÷ V', 'I = P ÷ R'],
        correctAnswer: 1,
      },
      {
        question: 'P = I² × R is a formula for:',
        options: ['Voltage', 'Resistance', 'Power', 'Energy'],
        correctAnswer: 2,
      },
      {
        question: 'The point of this module is to:',
        options: [
          'Learn new BODMAS traps',
          'Rest and rehearse core identities',
          'Sit the 10-minute drill again',
          'Skip Ohm’s law until Cert III',
        ],
        correctAnswer: 1,
      },
    ],
    flashcards: FLASHCARDS,
  },
  {
    id: 'm7',
    order: 7,
    title: 'Study Guide & Key Focus',
    kind: 'guide',
    summary:
      'Focus on fractions-to-decimals conversions and BODMAS. Master 1/8 through 7/8 quickly.',
    concept:
      'If you only keep two skills from this strand, keep these:\n\n1. Eighths as decimals, instantly.\n2. BODMAS, including left-to-right for ÷/× and +/−.\n\nEighths table (learn down, then up):\n1/8 = 0.125\n1/4 = 2/8 = 0.25\n3/8 = 0.375\n1/2 = 4/8 = 0.5\n5/8 = 0.625\n3/4 = 6/8 = 0.75\n7/8 = 0.875\n\nPattern: each extra eighth adds 0.125. 4/8 is the halfway 0.5. Odds (1, 3, 5, 7) all end in 5.\n\nBODMAS recap: Brackets → Orders → Division/Multiplication left to right → Addition/Subtraction left to right. 3 + 4 × 2 = 11. 16 ÷ 4 × 2 = 8. 5 + 3² = 14.',
    tables: [
      {
        title: 'Eighths — learn this cold',
        headers: ['Fraction', 'Decimal', 'Percent'],
        rows: EIGHTHS.map((row) => [
          row.fraction,
          String(row.decimal),
          row.percent,
        ]),
      },
    ],
    whyItMatters:
      'Every later electrical calculation sits on decimal numbers and a defined order of operations. If 5/8 and BODMAS are automatic, Ohm’s law rearrangements and voltage-drop arithmetic become algebra, not arithmetic panic.',
    examples: [
      {
        title: 'Build 5/8 from 1/8',
        problem: 'What is 5/8 as a decimal, using the 0.125 step only?',
        steps: [
          '1/8 = 0.125.',
          '5 × 0.125 = 0.625.',
          'Check: 4/8 = 0.5, plus one more eighth 0.125 = 0.625.',
        ],
        answer: '0.625',
      },
      {
        title: 'BODMAS checkpoint',
        problem: '8 + 12 ÷ 4 × 2 − 1',
        steps: [
          '÷ and × left to right: 12 ÷ 4 = 3, then 3 × 2 = 6.',
          'Now 8 + 6 − 1.',
          'Left to right: 14 − 1 = 13.',
        ],
        answer: '13',
      },
    ],
    keyPoints: [
      'Memorise 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8 as decimals',
      'Each eighth is 0.125',
      'BODMAS: brackets, orders, ÷× L→R, +− L→R',
      '3 + 4 × 2 = 11, never 14',
    ],
    quizQuestions: [
      {
        question: '5/8 as a decimal is:',
        options: ['0.58', '0.625', '0.875', '0.5'],
        correctAnswer: 1,
      },
      {
        question: '7/8 as a decimal is:',
        options: ['0.78', '0.875', '0.7', '0.125'],
        correctAnswer: 1,
      },
      {
        question: '3/8 as a decimal is:',
        options: ['0.3', '0.38', '0.375', '0.8'],
        correctAnswer: 2,
      },
      {
        question: '8 + 12 ÷ 4 × 2 − 1 =',
        options: ['13', '11', '5', '15'],
        correctAnswer: 0,
      },
    ],
  },
];

export const MATH_UNIT: Unit = {
  id: 'math',
  code: 'MATH',
  name: 'Foundational Trade Mathematics',
  description:
    'Fractions, decimals, BODMAS, trade percentages, a timed drill, equation flashcards, and an eighths study guide. Does not count toward UEE22020 unit points.',
  prerequisites: [],
  points: 0,
  kind: 'core',
  topics: MATH_MODULES.map((module) => ({
    id: module.id,
    title: module.title,
    content: module.summary,
    keyPoints: module.keyPoints,
    quizQuestions: module.quizQuestions,
  })),
};

export function findMathTopic(topicId: string) {
  return MATH_UNIT.topics.find((topic) => topic.id === topicId);
}

export function isMathModuleUnlocked(
  module: MathModule,
  completions: Record<string, boolean> | undefined,
): boolean {
  return isModuleUnlocked(MATH_MODULES, module, completions);
}
