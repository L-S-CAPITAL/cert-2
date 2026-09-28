export interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  /**
   * One line shown after answering, saying why the answer is right. Only
   * written where it can be grounded in the question/answer itself or, for
   * the training.gov.au electives, the cited unit text. Without it the quiz
   * just shows the correct answer.
   */
  explanation?: string;
}

export type UnitKind = 'core' | 'elective';

export interface Unit {
  id: string;
  code: string;
  name: string;
  description: string;
  prerequisites: string[];
  points: number;
  topics: Topic[];
  kind?: UnitKind;
  /** Official unit page that the quizzes and flashcards are written from. */
  sourceUrl?: string;
  /** Unit-level flashcard deck (same card format as the study strands). */
  flashcards?: Flashcard[];
}

export interface SessionLog {
  id: string;
  unitId: string;
  topicId: string | null;
  durationSeconds: number;
  timestamp: string;
}

/** One finished quiz: how many questions were right out of how many. */
export interface QuizAttempt {
  id: string;
  /** Course unit id, or a study strand id (math, algebra, ...). */
  unitId: string;
  topicId: string;
  score: number;
  total: number;
  /** ISO time the quiz was finished. */
  timestamp: string;
}

export interface ProgressData {
  unitCompletions: Record<string, Record<string, boolean>>;
  sessionLogs: SessionLog[];
  totalTimeSeconds: number;
  /** Newest first, capped at MAX_QUIZ_ATTEMPTS. */
  quizAttempts: QuizAttempt[];
}

export interface ProgressState extends ProgressData {
  startTime: number | null;
  activeUnitId: string | null;
  activeTopicId: string | null;
}

export type TabType =
  | 'dashboard'
  | 'units'
  | 'sessions'
  | 'overview'
  | 'progress'
  | 'math'
  | 'algebra'
  | 'geometry'
  | 'blueprints';

export interface WorkedExample {
  title: string;
  problem: string;
  steps: string[];
  answer: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export type MathModuleKind = 'tutorial' | 'drill' | 'flashcards' | 'guide';

export interface ReferenceTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface DrillItem extends QuizQuestion {
  skill: string;
}

export interface MathModule {
  id: string;
  order: number;
  title: string;
  kind: MathModuleKind;
  summary: string;
  concept: string;
  whyItMatters: string;
  examples: WorkedExample[];
  keyPoints: string[];
  quizQuestions: QuizQuestion[];
  flashcards?: Flashcard[];
  tables?: ReferenceTable[];
  diagram?: string;
  drillBank?: DrillItem[];
  drillSeconds?: number;
  drillPaperSize?: number;
  drillPassPercent?: number;
  drillPassAnswered?: number;
  perQuestionSeconds?: number;
}
