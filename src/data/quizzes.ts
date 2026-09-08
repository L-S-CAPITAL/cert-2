import { QuizQuestion } from '../types';

export const EXTRA_QUIZZES: Record<string, QuizQuestion[]> = {
  'c1-t3': [
    {
      question: 'Which control is the most effective in the hierarchy of controls?',
      options: ['PPE', 'Administrative controls', 'Elimination', 'Engineering controls'],
      correctAnswer: 2,
    },
  ],
  'c1-t4': [
    {
      question: 'When should a construction incident be reported?',
      options: [
        'Only if someone is hospitalised',
        'At the end of the shift',
        'Immediately, including minor injuries',
        'Only when the client asks',
      ],
      correctAnswer: 2,
    },
  ],
  'c2-t2': [
    {
      question: 'What is the purpose of Lock Out Tag Out (LOTO)?',
      options: [
        'To label tools for inventory',
        'To isolate and secure energy sources before work',
        'To tag completed jobs',
        'To lock the site gate overnight',
      ],
      correctAnswer: 1,
    },
  ],
  'c2-t3': [
    {
      question: 'What should you do before touching conductors on a circuit you have isolated?',
      options: [
        'Assume it is dead because the isolator is off',
        'Test for dead with an approved tester',
        'Splash the board with de-ionised water',
        'Remove the main fuse by hand without PPE',
      ],
      correctAnswer: 1,
    },
  ],
  'c2-t4': [
    {
      question: 'What is the first action if a person is still in contact with live electricity?',
      options: [
        'Pull them away with bare hands',
        'Throw water on the installation',
        'Isolate the supply, then call 000',
        'Start CPR immediately without isolating',
      ],
      correctAnswer: 2,
    },
  ],
  'c3-t1': [
    {
      question: 'Which set describes the main parts of the Australian energy sector?',
      options: [
        'Generation, transmission, distribution, and retail',
        'Plumbing, carpentry, and painting',
        'Mining only',
        'Retail and advertising only',
      ],
      correctAnswer: 0,
    },
  ],
  'c3-t2': [
    {
      question: 'What document details step-by-step safe work procedures, hazards, and controls?',
      options: [
        'A feed-in tariff',
        'A Work Method Statement (SWMS)',
        'A tax invoice',
        'A marketing brochure',
      ],
      correctAnswer: 1,
    },
  ],
  'c3-t3': [
    {
      question: 'When should a toolbox talk be held?',
      options: [
        'Once a year',
        'Only after an incident',
        'Before starting a work task',
        'Only for apprentices',
      ],
      correctAnswer: 2,
    },
  ],
  'c4-t2': [
    {
      question: 'What trip current is typically used for personal-protection RCDs?',
      options: ['300 mA', '100 mA', '30 mA', '10 A'],
      correctAnswer: 2,
    },
  ],
  'c4-t3': [
    {
      question: 'Why must steel electrical enclosures be earthed?',
      options: [
        'To make them look finished',
        'To provide a fault path and keep exposed metal at earth potential',
        'To stop rust',
        'Earth is optional on steel',
      ],
      correctAnswer: 1,
    },
  ],
  'c5-t1': [
    {
      question: 'What is the first step in a systematic electrotechnology problem-solving method?',
      options: [
        'Replace the nearest component',
        'Define the problem and gather information',
        'Write the invoice',
        'Increase supply voltage',
      ],
      correctAnswer: 1,
    },
  ],
  'c5-t2': [
    {
      question: 'Insulation resistance is commonly checked with which instrument?',
      options: ['A clamp meter only', 'A megger (IR tester)', 'A spirit level', 'A torque wrench'],
      correctAnswer: 1,
    },
  ],
  'c5-t3': [
    {
      question: 'A technical fault report should include:',
      options: [
        'Only the part number replaced',
        'Symptom, diagnosis, solution, and verification results',
        'The worker’s tax file number',
        'A photo of the van',
      ],
      correctAnswer: 1,
    },
  ],
  'c6-t2': [
    {
      question: 'In a series circuit, which quantity is the same through every component?',
      options: ['Voltage drop', 'Current', 'Power', 'Resistance'],
      correctAnswer: 1,
    },
  ],
  'c6-t3': [
    {
      question: 'In a series voltage divider, voltage drop across a resistor is:',
      options: [
        'Independent of resistance',
        'Proportional to that resistor’s value',
        'Always half the supply',
        'Zero if another resistor is present',
      ],
      correctAnswer: 1,
    },
  ],
  'c6-t4': [
    {
      question: 'A useful first step when troubleshooting a single-path circuit is:',
      options: [
        'Replace every component',
        'Visual inspection and confirm the supply voltage',
        'Short the supply to earth',
        'Increase fuse size until it holds',
      ],
      correctAnswer: 1,
    },
  ],
  'c6-t5': [
    {
      question: 'How must voltage be measured with a multimeter?',
      options: [
        'In series with the load',
        'In parallel with the circuit under test',
        'With the probes shorted together on a live bus',
        'Only after removing the earth',
      ],
      correctAnswer: 1,
    },
  ],
  'c7-t2': [
    {
      question: 'What must be done before operating plant or equipment?',
      options: [
        'Skip checks if used yesterday',
        'Pre-start safety checks including guards and e-stop',
        'Remove safety guards for access',
        'Override interlocks',
      ],
      correctAnswer: 1,
    },
  ],
  'c7-t3': [
    {
      question: 'Before maintenance, equipment should be:',
      options: [
        'Left running so faults show up',
        'Fully isolated using LOTO',
        'Covered with a tarp only',
        'Moved off-site without isolation',
      ],
      correctAnswer: 1,
    },
  ],
  'c8-t2': [
    {
      question: 'What does a solar PV inverter do?',
      options: [
        'Converts DC from panels to AC for the home and grid',
        'Stores rainwater',
        'Steps 11 kV down to extra-low voltage only',
        'Replaces the main earthing electrode',
      ],
      correctAnswer: 0,
    },
  ],
  'c8-t3': [
    {
      question: 'Payback period for an energy upgrade is:',
      options: [
        'Investment cost divided by annual energy savings',
        'Annual savings times 10',
        'The warranty period',
        'Always 1 year',
      ],
      correctAnswer: 0,
    },
  ],
};
