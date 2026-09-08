import { Unit } from '../types';

export const ELECTIVE_UNITS: Unit[] = [
  {
    id: 'e1',
    code: 'UEECD0044',
    name: 'Solve problems in multiple path circuits',
    description:
      'This unit covers solving problems in multiple path (parallel and series-parallel) extra-low voltage circuits. Pre-requisite: UEECD0007.',
    prerequisites: ['UEECD0007'],
    points: 40,
    kind: 'elective',
    topics: [
      {
        id: 'e1-t1',
        title: 'Parallel circuit analysis',
        content:
          'In a parallel circuit there are multiple current paths. The voltage across each branch equals the supply voltage. Total current is the sum of branch currents. Total resistance is found from 1/R_total = 1/R1 + 1/R2 + 1/R3 + … For two resistors, R_total = (R1 × R2) / (R1 + R2). If one branch opens, other branches continue to operate. Adding branches decreases total resistance and increases total current.',
        keyPoints: [
          'Voltage is the same across all parallel branches',
          'Total current = sum of branch currents',
          'Total resistance is less than the smallest individual resistance',
          'Failure of one branch does not stop other branches',
          'Adding parallel branches reduces total resistance',
        ],
        quizQuestions: [
          {
            question: 'What happens to total resistance when a parallel branch is added?',
            options: [
              'It increases',
              'It stays the same',
              'It decreases',
              'It becomes infinite',
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        id: 'e1-t2',
        title: 'Series-parallel networks',
        content:
          'Many practical ELV circuits combine series and parallel groups. Reduce parallel groups to an equivalent resistance, then combine series equivalents until a single R_total remains. Use Ohm’s law for total current, then work back through the network to find branch currents and voltage drops. Check results with KCL at nodes and KVL around loops.',
        keyPoints: [
          'Reduce parallel groups before combining series resistances',
          'Work from equivalent R_total back to branch values',
          'KCL and KVL still apply in mixed networks',
          'Document assumed current directions',
        ],
        quizQuestions: [
          {
            question: 'A reliable way to analyse a series-parallel circuit is to:',
            options: [
              'Treat every component as series',
              'Reduce parallel groups to equivalents, then combine series',
              'Ignore the smallest resistor',
              'Short the supply',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'e2',
    code: 'UEECD0051',
    name: 'Use drawings, diagrams, schedules, standards, codes and specifications',
    description:
      'Read and apply electrotechnology drawings, diagrams, schedules, Australian Standards, codes and specifications to energy sector work.',
    prerequisites: ['UEECD0007'],
    points: 40,
    kind: 'elective',
    topics: [
      {
        id: 'e2-t1',
        title: 'Electrical drawings and symbols',
        content:
          'Wiring diagrams show physical connections. Schematics use AS/NZS symbols for function. Schedules list cables, circuits, and protection. Title blocks identify revision, drawing number, and author. Always work from the latest revision and note discrepancies before starting work.',
        keyPoints: [
          'Confirm you have the latest revision',
          'Schematics show function; wiring diagrams show connections',
          'Schedules list circuits, cables, and protection',
          'Report drawing errors rather than guessing',
        ],
        quizQuestions: [
          {
            question: 'What should you do if a drawing revision looks older than the site copy?',
            options: [
              'Use whichever is prettier',
              'Confirm the latest revision before working',
              'Ignore the title block',
              'Redraw it from memory',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'e2-t2',
        title: 'Standards and specifications',
        content:
          'AS/NZS 3000 (Wiring Rules) is the primary installation standard in Australia. Manufacturer specifications set torque, ratings, and installation conditions. Codes of practice give practical guidance for WHS duties. Specifications in a contract may be stricter than the minimum standard — the more onerous documented requirement applies.',
        keyPoints: [
          'AS/NZS 3000 is the core wiring standard',
          'Manufacturer ratings must not be exceeded',
          'Contract specifications can exceed the minimum standard',
          'Keep referenced standards available on the job',
        ],
        quizQuestions: [
          {
            question: 'Which standard is the primary wiring rules document in Australia?',
            options: ['AS/NZS 3000', 'AS/NZS 4360', 'ISO 9001', 'AS 1428'],
            correctAnswer: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'e3',
    code: 'UEECD0020',
    name: 'Fix and secure electrotechnology equipment',
    description:
      'Select fixings and methods to mount electrotechnology equipment so it remains mechanically secure and electrically safe.',
    prerequisites: ['UEECD0007'],
    points: 20,
    kind: 'elective',
    topics: [
      {
        id: 'e3-t1',
        title: 'Fixings and substrates',
        content:
          'Match the fixing to the substrate: masonry anchors for brick and concrete, timber screws for studs, and manufacturer kits for hollow walls. Check load ratings, corrosion class, and fire/acoustic constraints. Do not drill into unknown services — locate cables and pipes first. Equipment must remain accessible for isolation and maintenance.',
        keyPoints: [
          'Match fixing type to the substrate and load',
          'Locate services before drilling',
          'Keep isolation points accessible',
          'Use corrosion-appropriate hardware',
        ],
        quizQuestions: [
          {
            question: 'Before drilling to mount a board you should:',
            options: [
              'Drill a test hole anywhere',
              'Locate cables and pipes, then select a suitable fixing',
              'Use the longest screw available',
              'Skip fixings and rest it on the floor',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'e4',
    code: 'UEECO0002',
    name: 'Maintain documentation',
    description:
      'Create and maintain workplace documents used in electrotechnology work, including job sheets, test results, and handover records.',
    prerequisites: [],
    points: 20,
    kind: 'elective',
    topics: [
      {
        id: 'e4-t1',
        title: 'Workplace records',
        content:
          'Keep test results, isolation records, and variation notes with the job. Use clear dates, names, and circuit identifiers. Store records as required by the PCBU and the contract. Incomplete documentation is a compliance and safety failure, not just an admin issue.',
        keyPoints: [
          'Identify who, when, and which circuit',
          'File test results with the job',
          'Documentation is part of WHS compliance',
          'Handover records must match the as-built work',
        ],
        quizQuestions: [
          {
            question: 'Why do isolation and test records matter after the job is finished?',
            options: [
              'They do not matter',
              'They provide a compliance and safety trail',
              'Only for payroll',
              'To decorate the van',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
];
