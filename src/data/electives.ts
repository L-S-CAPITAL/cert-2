import { Unit } from '../types';
import { ElectiveStudySet, UEECD0008_STUDY, UEECD0019_STUDY, UEECD0035_STUDY } from './electiveStudy';

/**
 * Elective units in this enrolment of UEE22020 (140 elective weighting
 * points in total):
 *
 *   UEECD0008  Group B  60  https://training.gov.au/Training/Details/UEECD0008
 *   UEECD0019  Group B  40  https://training.gov.au/Training/Details/UEECD0019
 *   UEECD0020  Group B  20  https://training.gov.au/Training/Details/UEECD0020
 *   UEECD0035  Group A  20  https://training.gov.au/Training/Details/UEECD0035
 *
 * Groups and points are from the UEE22020 packaging rules (see
 * qualification.ts). For UEECD0008, UEECD0019 and UEECD0035 each topic is
 * one of the unit's official elements, with key points taken from its
 * performance criteria (checked 28 Sep 2026). Their quizzes and flashcards
 * are in electiveStudy.ts, written from the official unit text only; longer
 * study notes are still to be written.
 *
 * Former electives (UEECD0044, UEECD0051, UEECO0002) live in
 * archivedElectives.ts. Unit ids are never reused, so saved progress for an
 * old id can never land on a different unit.
 */
const ELECTIVE_OUTLINES: Unit[] = [
  {
    id: 'e5',
    code: 'UEECD0008',
    name: 'Carry out preparatory energy sector work activities',
    description:
      'Official application (training.gov.au): the skills and knowledge required to carry out preparatory energy sector work activities, including planning and carrying out energy sector work support activities. Pre-requisite: UEECD0007. Quizzes and flashcards are written from the official unit text; longer study notes are still to be written.',
    prerequisites: ['UEECD0007'],
    points: 60,
    kind: 'elective',
    // Group B, 60 weighting points (UEE22020 packaging rules).
    // Topics = the unit's official elements.
    topics: [
      {
        id: 'e5-t1',
        title: 'Plan energy sector support activity',
        content:
          'Element 1. Before the work: obtain and apply WHS/OHS requirements and workplace procedures, identify hazards and put risk controls in place, get work instructions and the scope and location of the work from the supervisor, coordinate with others, and work out the materials, tools, equipment and testing devices needed.',
        keyPoints: [
          'WHS/OHS requirements and workplace procedures for the work area are obtained and applied',
          'Hazards are identified, risks assessed and control measures implemented for energy sector work preparation',
          'Hazards not previously identified are noted on job safety assessments and advice is sought from the work supervisor',
          'Work instructions are obtained and the nature, scope and location of work is determined',
          'Advice is sought so work is coordinated effectively with others',
          'Materials required for work are determined in accordance with workplace procedures',
          'Tools, equipment and testing devices are obtained and checked for correct operation and safety',
        ],
      },
      {
        id: 'e5-t2',
        title: 'Undertake energy sector support activity',
        content:
          'Element 2. Doing the work: follow risk control measures and workplace procedures, check plant and equipment, install mechanical equipment straight and square within tolerances, use hand and power tools safely, carry out work instructions under supervision, and refer unplanned events to the supervisor.',
        keyPoints: [
          'WHS/OHS risk control measures and workplace procedures for carrying out work are followed',
          'Plant and equipment are checked in accordance with manufacturer guidelines, WHS/OHS requirements and workplace procedures',
          'Mechanical equipment is installed straight and square in the required locations and within acceptable tolerances',
          'Hand and power tools are used in accordance with safe working practices',
          'Work instructions are carried out under supervision',
          'Unplanned events are referred to the supervisor and directions are followed',
        ],
      },
      {
        id: 'e5-t3',
        title: 'Complete energy sector work activity',
        content:
          'Element 3. Finishing the work: follow work completion risk controls and procedures, clean the work site and make it safe, and notify the supervisor that the work is complete.',
        keyPoints: [
          'WHS/OHS work completion risk control measures and workplace procedures are followed',
          'Work site is cleaned and made safe in accordance with workplace procedures',
          'Supervisor is notified of work completion in accordance with workplace procedures',
        ],
      },
    ],
  },
  {
    id: 'e6',
    code: 'UEECD0019',
    name: 'Fabricate, assemble and dismantle utilities industry components',
    description:
      'Official application (training.gov.au): the skills and knowledge required to fabricate, assemble and dismantle utilities industry components using fitting and metal fabrication techniques, including hand and power tools, cutting, shaping, joining and fixing, measuring and marking out, and reading drawings. Pre-requisite: UEECD0007. Quizzes and flashcards are written from the official unit text; longer study notes are still to be written.',
    prerequisites: ['UEECD0007'],
    points: 40,
    kind: 'elective',
    // Group B, 40 weighting points (UEE22020 packaging rules).
    // Topics = the unit's official elements.
    topics: [
      {
        id: 'e6-t1',
        title: 'Prepare for dismantling, assembling and fabrication work',
        content:
          'Element 1. Before the work: identify and apply WHS/OHS procedures and risk controls, identify the work instructions, procedures, standards, codes and regulations that apply, get the scope of work, coordinate with others, and obtain and check materials, tools and measuring devices.',
        keyPoints: [
          'WHS/OHS procedures for the work area are identified and applied',
          'WHS/OHS risk control measures and workplace procedures are followed in preparation for the work',
          'Work instructions, workplace procedures, industry standards, codes of practice and regulations are identified and applied',
          'Scope of work is obtained from relevant documentation and from the work supervisor',
          'Advice is sought so work is coordinated effectively with other persons',
          'Materials required for work are identified and obtained',
          'Tools, equipment and measuring devices are obtained and checked for correct operation and safety',
        ],
      },
      {
        id: 'e6-t2',
        title: 'Dismantle and assemble utilities industry apparatus',
        content:
          'Element 2. Confirm isolation, select and use tools safely, follow manufacturer guides, mark or tag components during dismantling so they go back correctly, store parts against loss or damage, avoid waste and damage, refer unplanned events, carry out quality checks, tidy up and notify the supervisor.',
        keyPoints: [
          'Circuits/apparatus/plant are checked and isolation confirmed',
          'Relevant tools are selected and used correctly and safely',
          'Manufacturer guides and instructions are followed when dismantling and assembling apparatus',
          'Components are marked or tagged during dismantling for correct and efficient reassembly',
          'Dismantled components and parts are stored to protect them against loss or damage',
          'Apparatus is dismantled and assembled without waste or damage to apparatus, surroundings or services',
          'Unplanned events are referred to the supervisor; quality checks are carried out',
          'Worksite is tidied, tools cleaned and stored, and the supervisor is notified of completion',
        ],
      },
      {
        id: 'e6-t3',
        title: 'Fabricate utilities industry components',
        content:
          'Element 3. Check and isolate circuits/apparatus/plant, follow drawings, diagrams and instructions, find component dimensions by measuring or calculating from job drawings, fabricate by measuring, marking out, cutting, joining and fixing accurately, carry out quality checks, tidy up and notify the supervisor.',
        keyPoints: [
          'WHS/OHS risk control measures and workplace procedures for fabricating components are followed',
          'Circuits/apparatus/plant are checked and isolated',
          'Relevant tools and equipment are selected and used correctly and safely',
          'Drawings, diagrams and instructions for fabrication of mechanical components are followed',
          'Component dimensions are determined by measuring, or by calculation from job drawings and instructions',
          'Components are fabricated by measuring, marking out, cutting, joining and fixing accurately, minimising waste',
          'Unplanned events are referred to the supervisor; quality checks are carried out',
          'Worksite is tidied, tools cleaned and stored, and the supervisor is notified of completion',
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
    id: 'e7',
    code: 'UEECD0035',
    name: 'Provide basic instruction in the use of electrotechnology apparatus',
    description:
      'Official application (training.gov.au): the skills and knowledge required to instruct customers/users in the use of electrotechnology apparatus, including customer relations, using manufacturer instruction material, instructing methods and completing instruction documentation. No pre-requisite. Quizzes and flashcards are written from the official unit text; longer study notes are still to be written.',
    prerequisites: [],
    points: 20,
    kind: 'elective',
    // Group A, 20 weighting points (UEE22020 packaging rules).
    // Topics = the unit's official elements.
    topics: [
      {
        id: 'e7-t1',
        title: 'Prepare to instruct in the use of electrotechnology apparatus',
        content:
          'Element 1. Identify and apply WHS/OHS requirements and risk controls, confirm with the supervisor which apparatus the user is to be instructed on, review its safety features and safe use in the manufacturer instructions, do a practice run-through, and obtain the materials needed for the instruction.',
        keyPoints: [
          'WHS/OHS requirements and workplace procedures for the work area are identified and applied',
          'Hazards are identified, risks are assessed and control measures are implemented',
          'The apparatus the user is to be instructed on is confirmed with the work supervisor',
          'Safety features and safe use of the apparatus are reviewed in accordance with manufacturer instructions',
          'Familiarity with the apparatus is gained from the manufacturer user instructions and a preliminary practice run-through',
          'Materials required to instruct users are obtained in accordance with workplace procedures',
        ],
      },
      {
        id: 'e7-t2',
        title: 'Instruct user in the use of electrotechnology apparatus',
        content:
          'Element 2. Tell users about the safety features and safe use of the apparatus, instruct them in its set-up and use per the manufacturer instructions, let them ask questions and show they understand, hand over the manufacturer instructions and documentation, refer unplanned events, and give the instruction efficiently without damage.',
        keyPoints: [
          'Users are informed of safety features and safe use of the apparatus',
          'Users are instructed in the set-up and use of the apparatus in accordance with manufacturer instructions',
          'Users can ask questions and demonstrate they understand the safety aspects, set-up and operation',
          'Manufacturer user instructions and related documentation are given to the appropriate person/s',
          'Unplanned events are referred to the supervisor for direction',
          'Instructions are given efficiently, without damage to apparatus, surroundings or services, using sustainable energy practices',
        ],
      },
    ],
  },
];

const STUDY_BY_UNIT: Record<string, ElectiveStudySet> = {
  [UEECD0008_STUDY.unitId]: UEECD0008_STUDY,
  [UEECD0019_STUDY.unitId]: UEECD0019_STUDY,
  [UEECD0035_STUDY.unitId]: UEECD0035_STUDY,
};

/** Add the source URL, flashcards and per-topic quizzes from electiveStudy.ts. */
function attachStudy(unit: Unit): Unit {
  const study = STUDY_BY_UNIT[unit.id];
  if (!study) return unit;
  return {
    ...unit,
    sourceUrl: study.sourceUrl,
    flashcards: study.flashcards,
    topics: unit.topics.map((topic) => ({
      ...topic,
      quizQuestions: study.quizzes[topic.id] ?? topic.quizQuestions,
    })),
  };
}

export const ELECTIVE_UNITS: Unit[] = ELECTIVE_OUTLINES.map(attachStudy);
