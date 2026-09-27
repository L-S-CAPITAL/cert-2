import { Flashcard, QuizQuestion } from '../types';

/**
 * Quiz questions and flashcards for the electives UEECD0008, UEECD0019 and
 * UEECD0035.
 *
 * Written in our own words from the official unit text on the National
 * Training Register (training.gov.au): elements, performance criteria,
 * range of conditions, performance evidence, knowledge evidence and
 * assessment conditions. Checked 28 Sep 2026. No textbook or other
 * third-party material was used. Each question notes the part of the unit
 * it comes from (PC = performance criterion, PE = performance evidence,
 * KE = knowledge evidence, AC = assessment conditions, RC = range of
 * conditions).
 *
 * Questions stay general on purpose: no numeric values or standard clause
 * numbers, because the unit text does not give any.
 */
export interface ElectiveStudySet {
  unitId: string;
  code: string;
  /** Official unit page the questions and cards are written from. */
  sourceUrl: string;
  checked: string;
  /** Quiz questions by topic id (one topic per official element). */
  quizzes: Record<string, QuizQuestion[]>;
  flashcards: Flashcard[];
}

const CHECKED = '2026-09-28';

export const UEECD0008_STUDY: ElectiveStudySet = {
  unitId: 'e5',
  code: 'UEECD0008',
  sourceUrl: 'https://training.gov.au/Training/Details/UEECD0008',
  checked: CHECKED,
  quizzes: {
    // Element 1: Plan energy sector support activity
    'e5-t1': [
      {
        // PC 1.3
        question:
          'While preparing for the job you spot a hazard that nobody had identified before. What should you do?',
        options: [
          'Keep working and mention it at the next toolbox talk',
          'Note it on the job safety assessment and ask your work supervisor for advice',
          'Deal with it your own way without telling anyone',
          'Record it only after the job is finished',
        ],
        correctAnswer: 1,
      },
      {
        // PC 1.4
        question: 'Where should the nature, scope and location of the work come from?',
        options: [
          'Your best guess from the materials on site',
          'Whoever happens to be nearby',
          'The work instructions and your supervisor or another appropriate person',
          'You work it out after starting',
        ],
        correctAnswer: 2,
      },
      {
        // PC 1.7
        question: 'What must happen to tools, equipment and testing devices before the work starts?',
        options: [
          'They are obtained and checked for correct operation and safety',
          'They are only checked if they fail during the job',
          'Nothing, as long as they were used last week',
          'They are borrowed from another crew without checking',
        ],
        correctAnswer: 0,
      },
      {
        // PC 1.5
        question: 'Why do you seek advice from your supervisor while planning the work?',
        options: [
          'So the supervisor does the work instead',
          'So you can skip the workplace procedures',
          'It is only needed once the work is finished',
          'So your work is coordinated effectively with other people',
        ],
        correctAnswer: 3,
      },
    ],
    // Element 2: Undertake energy sector support activity
    'e5-t2': [
      {
        // PC 2.3
        question: 'How must mechanical equipment be installed?',
        options: [
          'Anywhere convenient, as long as it works',
          'Straight and square, in the required location and within acceptable tolerances',
          'Loosely, so someone else can position it later',
          'Level only if the customer asks for it',
        ],
        correctAnswer: 1,
      },
      {
        // PC 2.2
        question: 'Plant and equipment are checked against which of these?',
        options: [
          'Manufacturer guidelines or instructions, WHS/OHS requirements and workplace procedures',
          'Personal preference',
          'Whatever is quickest on the day',
          'Only the purchase price',
        ],
        correctAnswer: 0,
      },
      {
        // PC 2.6
        question: 'Something unplanned happens partway through the job. What is the right response?',
        options: [
          'Ignore it and finish the job',
          'Leave the site without telling anyone',
          'Refer it to your supervisor and follow their directions',
          'Change the job plan yourself',
        ],
        correctAnswer: 2,
      },
      {
        // PC 2.5 and PE
        question: 'In this unit, how are work instructions carried out?',
        options: [
          'Alone, with no contact with anyone',
          'Only by the customer',
          'After the supervisor has left the site',
          'Under supervision',
        ],
        correctAnswer: 3,
      },
    ],
    // Element 3: Complete energy sector work activity
    'e5-t3': [
      {
        // PC 3.2
        question: 'What must happen to the work site when the job is finished?',
        options: [
          'It is cleaned and made safe in line with workplace procedures',
          'It is left for the next trade to clean up',
          'Only the tools are removed',
          'Nothing, if the customer is not home',
        ],
        correctAnswer: 0,
      },
      {
        // PC 3.3
        question: 'Who do you notify when the work is complete?',
        options: [
          'No one, the finished job speaks for itself',
          'Your supervisor, following workplace procedures',
          'Only the equipment manufacturer',
          'Only the next shift, if you see them',
        ],
        correctAnswer: 1,
      },
      {
        // PC 3.1
        question: 'Which risk controls apply while you finish off a job?',
        options: [
          'None: risk controls stop once the last fixing is done',
          'Only the ones the customer asks for',
          'The WHS/OHS work completion risk control measures and workplace procedures',
          'Only personal protective equipment',
        ],
        correctAnswer: 2,
      },
      {
        // PE (assessment requirements)
        question: 'To be assessed competent, how many times must you show you can do the work?',
        options: [
          'Once, in any setting',
          'Never: a written test is enough',
          'Only when the supervisor is absent',
          'On at least two separate occasions',
        ],
        correctAnswer: 3,
      },
    ],
  },
  flashcards: [
    {
      front: 'UEECD0008: what are the three elements?',
      back: 'Plan the energy sector support activity, undertake it, then complete it.',
    },
    {
      front: 'You find a hazard that was not identified before. What do you do?',
      back: 'Note it on the job safety assessment and ask your work supervisor for advice.',
    },
    {
      front: 'Tools, equipment and testing devices: before you start',
      back: 'Get what the job needs and check it works correctly and is safe.',
    },
    {
      front: 'How must mechanical equipment be installed?',
      back: 'Straight and square, in the required location, within acceptable tolerances and to relevant industry standards.',
    },
    {
      front: 'Something unplanned happens on the job',
      back: 'Refer it to your supervisor and follow their directions.',
    },
    {
      front: 'Examples of preparatory tasks in the performance evidence',
      back: 'Maintaining fire integrity; placing and securing accessories; routing, placing and securing cables; using testing devices; using hand and power tools safely.',
    },
    {
      front: 'What must you know about hand, fixed and portable power tools?',
      back: 'Their hazards, care and maintenance, the types and what they are for, requirements for using them on construction sites, and how to use them correctly and safely.',
    },
    {
      front: 'Finishing the job: three steps',
      back: 'Follow the completion risk controls, clean the site and make it safe, and tell your supervisor the work is complete.',
    },
    {
      front: 'How is competence in this unit assessed?',
      back: 'Against all the elements and performance criteria, on at least two separate occasions, in a workplace or a simulated workplace.',
    },
  ],
};

export const UEECD0019_STUDY: ElectiveStudySet = {
  unitId: 'e6',
  code: 'UEECD0019',
  sourceUrl: 'https://training.gov.au/Training/Details/UEECD0019',
  checked: CHECKED,
  quizzes: {
    // Element 1: Prepare for dismantling, assembling and fabrication work
    'e6-t1': [
      {
        // PC 1.4
        question: 'Where do you get the scope of the work to be done?',
        options: [
          'From relevant documentation and your work supervisor',
          'From whatever parts are lying on the bench',
          'From an online forum',
          'You decide once the job is under way',
        ],
        correctAnswer: 0,
      },
      {
        // PC 1.3
        question: 'Which of these must be identified and applied before dismantling, assembling or fabricating?',
        options: [
          'Only verbal tips from a workmate',
          'Whichever method is fastest',
          'Work instructions, workplace procedures, industry standards, codes of practice and regulations',
          "Only the tool maker's advertising",
        ],
        correctAnswer: 2,
      },
      {
        // PC 1.7
        question: 'What must happen to tools, equipment and measuring devices before the work?',
        options: [
          'They are only checked once a year',
          'They are obtained and checked for correct operation and safety',
          'They are used first and checked if a problem shows up',
          'They are shared without checking',
        ],
        correctAnswer: 1,
      },
      {
        // KE: workshop planning and materials
        question: 'Under workshop planning, the knowledge evidence says you must know about:',
        options: [
          'Designing high-voltage substations',
          'Setting prices for customers',
          'Programming industrial controllers',
          'Typical non-electrical hazards in the workplace and control measures for them',
        ],
        correctAnswer: 3,
      },
    ],
    // Element 2: Dismantle and assemble utilities industry apparatus
    'e6-t2': [
      {
        // PC 2.2
        question: 'Before you dismantle apparatus, what must be checked?',
        options: [
          'That the circuits, apparatus or plant are checked and isolation is confirmed',
          'Only that the apparatus looks clean',
          'That the customer has left the room',
          'Nothing, if the apparatus is switched off at the front panel',
        ],
        correctAnswer: 0,
      },
      {
        // PC 2.5
        question: 'Why are components marked or tagged while you dismantle apparatus?',
        options: [
          'To show who owns them',
          'So the apparatus can be reassembled correctly and efficiently',
          'So they can be sold separately',
          'It is only needed for new apparatus',
        ],
        correctAnswer: 1,
      },
      {
        // PC 2.6
        question: 'How should dismantled components and parts be stored?',
        options: [
          'In a loose pile on the floor',
          'In your pockets until reassembly',
          'Protected against loss or damage, following manufacturer instructions and workplace procedures',
          'Anywhere, as long as it is close by',
        ],
        correctAnswer: 2,
      },
      {
        // PC 2.9 to 2.11
        question: 'Which set of steps finishes a dismantling and assembling job?',
        options: [
          'Leave the tools out for the next person and go',
          'Throw away leftover parts without checking',
          'Tell your supervisor only if something went wrong',
          'Do quality checks, tidy the site, clean and store tools, and notify your supervisor',
        ],
        correctAnswer: 3,
      },
    ],
    // Element 3: Fabricate utilities industry components
    'e6-t3': [
      {
        // PC 3.5
        question: 'How are component dimensions worked out?',
        options: [
          'By measuring directly, or by calculating from the job drawings and instructions',
          'By estimating by eye',
          'By copying the nearest similar part',
          'By asking the customer',
        ],
        correctAnswer: 0,
      },
      {
        // PC 3.6 and PE
        question: 'When fabricating components you measure, mark out, cut, join and fix accurately while also:',
        options: [
          'Working as fast as possible whatever the waste',
          'Minimising waste of materials and energy and damage to the surroundings or services',
          'Using the most material you can for strength',
          'Skipping marking out to save time',
        ],
        correctAnswer: 1,
      },
      {
        // KE: low tolerance measurement; PE
        question: 'Which instruments does the unit name for low-tolerance measurement of components?',
        options: [
          'A multimeter and a clamp meter',
          'A spirit level and a string line',
          'Vernier calipers and micrometers',
          'A tape measure only',
        ],
        correctAnswer: 2,
      },
      {
        // KE: joining techniques
        question: 'Which joining techniques are listed in the knowledge evidence?',
        options: [
          'Adhesive tape and cable ties only',
          'Nails and staples',
          'Rivets only',
          'Machine screws, and welding, brazing or soldering',
        ],
        correctAnswer: 3,
      },
    ],
  },
  flashcards: [
    {
      front: 'UEECD0019: what are the three elements?',
      back: 'Prepare for the work, dismantle and assemble apparatus, and fabricate components.',
    },
    {
      front: 'Before dismantling apparatus',
      back: 'Check the circuits, apparatus or plant and confirm they are isolated, following WHS/OHS requirements and procedures.',
    },
    {
      front: 'Why mark or tag components during dismantling?',
      back: 'So the apparatus can be put back together correctly and efficiently.',
    },
    {
      front: 'Storing dismantled parts',
      back: 'Protect them against loss or damage, following manufacturer instructions and workplace procedures.',
    },
    {
      front: 'Where do component dimensions come from?',
      back: 'Measure them directly, or calculate them from the job drawings and instructions.',
    },
    {
      front: 'Low-tolerance measuring tools named in the unit',
      back: 'Vernier calipers and micrometers.',
    },
    {
      front: 'Joining techniques in the knowledge evidence',
      back: 'Machine screws, and welding, brazing or soldering.',
    },
    {
      front: 'Sheet metal techniques you need to know',
      back: 'Cutting, bending, drilling or punching, joining, and cutting mitres.',
    },
    {
      front: 'Tapping and threading',
      back: 'Cutting internal and external threads in materials used for electrotechnology work.',
    },
    {
      front: 'Mechanical drawings you must be able to read',
      back: 'Orthogonal (third angle) projection, including detail and assembly drawings, and pictorial views.',
    },
    {
      front: 'Cord-connected electrical equipment',
      back: 'Know the requirements for testing and tagging it.',
    },
    {
      front: 'Reducing waste',
      back: 'Use sustainable energy work practices to cut waste when marking out and when fabricating with sheet metal.',
    },
  ],
};

export const UEECD0035_STUDY: ElectiveStudySet = {
  unitId: 'e7',
  code: 'UEECD0035',
  sourceUrl: 'https://training.gov.au/Training/Details/UEECD0035',
  checked: CHECKED,
  quizzes: {
    // Element 1: Prepare to instruct in the use of electrotechnology apparatus
    'e7-t1': [
      {
        // PC 1.3
        question: 'Who confirms which apparatus the user is to be instructed on?',
        options: [
          'Your work supervisor and/or the relevant person',
          'You choose the apparatus you know best',
          'The first customer you meet',
          'Nobody: you instruct on everything on site',
        ],
        correctAnswer: 0,
      },
      {
        // PC 1.5 and PE
        question: 'How do you become familiar with the apparatus before instructing someone?',
        options: [
          'By watching the customer use it',
          'By reading the manufacturer user instructions and applying them in a practice run-through',
          'By guessing how it works during the session',
          'By reading the price tag and box',
        ],
        correctAnswer: 1,
      },
      {
        // PC 1.4
        question: 'The safety features and safe use of the apparatus are reviewed against:',
        options: [
          'Your memory of a similar product',
          'Advice from a friend',
          'The manufacturer instructions',
          'Nothing: safety is covered on the day',
        ],
        correctAnswer: 2,
      },
      {
        // KE and PE: evaluating user needs
        question: 'What does the unit expect you to be able to evaluate about the user?',
        options: [
          'How much they earn',
          'Which electrical licence class they hold',
          'How much to charge them',
          'Their instructional needs and their ability to use the apparatus',
        ],
        correctAnswer: 3,
      },
    ],
    // Element 2: Instruct user in the use of electrotechnology apparatus
    'e7-t2': [
      {
        // PC 2.1
        question: 'What must users be told about the apparatus?',
        options: [
          'Its safety features and safe use, following manufacturer instructions, regulatory requirements and safe work methods',
          'Only its price and warranty length',
          'Only the colour options',
          'Nothing, if they seem confident',
        ],
        correctAnswer: 0,
      },
      {
        // PC 2.3
        question: 'How do you check the user has understood?',
        options: [
          'Assume they understood if they nod',
          'Give them the chance to ask questions and show they understand the safety aspects, set-up and operation',
          'Ask your supervisor instead of the user',
          'Leave and wait for them to call if there is a problem',
        ],
        correctAnswer: 1,
      },
      {
        // PC 2.4 and PE
        question: 'What happens to the manufacturer user instructions and related documentation?',
        options: [
          'You take them back to the workshop',
          'They go out with the packaging',
          'They are given to the appropriate person/s',
          'They are kept by the installer',
        ],
        correctAnswer: 2,
      },
      {
        // PC 2.6
        question: 'How should the instruction be given?',
        options: [
          'As quickly as possible, whatever the result',
          'By letting the user try things until something works',
          'Only in writing, with no demonstration',
          'Efficiently, without damage to the apparatus, surroundings or services, using sustainable energy practices',
        ],
        correctAnswer: 3,
      },
    ],
  },
  flashcards: [
    {
      front: 'UEECD0035: what are the two elements?',
      back: 'Prepare to instruct in the use of the apparatus, then instruct the user in its use.',
    },
    {
      front: 'Who confirms which apparatus to instruct on?',
      back: 'Your work supervisor and/or the relevant person.',
    },
    {
      front: 'Getting familiar with the apparatus',
      back: 'Read the manufacturer user instructions and apply them in a practice run-through before instructing.',
    },
    {
      front: 'What must users be told about the apparatus?',
      back: 'The safety features and safe use of the apparatus, following manufacturer instructions, regulatory requirements and safe work methods.',
    },
    {
      front: 'What do you instruct users in?',
      back: 'Setting up and using the apparatus, following the manufacturer instructions.',
    },
    {
      front: 'Checking understanding',
      back: 'Let users ask questions and show they understand the safety aspects, set-up and operation.',
    },
    {
      front: 'Handing over',
      back: 'Give the manufacturer user instructions and related documentation to the appropriate person/s.',
    },
    {
      front: 'What must you be able to evaluate about users?',
      back: 'Their instructional needs and their ability to use the apparatus.',
    },
    {
      front: 'Risk mitigation process named in the knowledge evidence',
      back: 'Safe work method statements.',
    },
    {
      front: 'Something unplanned happens during instruction',
      back: 'Refer it to your supervisor for direction, following workplace procedures.',
    },
  ],
};

export const ELECTIVE_STUDY_SETS: ElectiveStudySet[] = [
  UEECD0008_STUDY,
  UEECD0019_STUDY,
  UEECD0035_STUDY,
];
