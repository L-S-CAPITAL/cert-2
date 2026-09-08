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
}

export interface SessionLog {
  id: string;
  unitId: string;
  topicId: string | null;
  durationSeconds: number;
  timestamp: string;
}

export interface ProgressData {
  unitCompletions: Record<string, Record<string, boolean>>;
  sessionLogs: SessionLog[];
  totalTimeSeconds: number;
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
