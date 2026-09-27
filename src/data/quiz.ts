import { QuizQuestion } from '../types';

/** A quiz round: the full quiz, or a review of the questions missed last time. */
export type QuizMode = 'full' | 'review';

export interface QuizRound {
  mode: QuizMode;
  /** Indexes into the topic's question list, in the order they are asked. */
  order: number[];
}

export function fullRound(questions: QuizQuestion[]): QuizRound {
  return { mode: 'full', order: questions.map((_, index) => index) };
}

/** Question indexes (from a round) that were answered wrongly or not at all. */
export function missedQuestions(
  questions: QuizQuestion[],
  round: QuizRound,
  answers: Record<number, number>,
): number[] {
  return round.order.filter((index) => answers[index] !== questions[index]?.correctAnswer);
}

export function reviewRound(missed: number[]): QuizRound {
  return { mode: 'review', order: [...missed] };
}

/** Number of correct answers in a round. */
export function roundScore(
  questions: QuizQuestion[],
  round: QuizRound,
  answers: Record<number, number>,
): number {
  return round.order.length - missedQuestions(questions, round, answers).length;
}

/**
 * Only full rounds are saved to quiz history and can mark a topic complete.
 * A review round re-asks just the missed questions, so its score would
 * inflate the average and does not show the whole topic is known.
 */
export function shouldRecordRound(round: QuizRound): boolean {
  return round.mode === 'full';
}

export function explanationFor(question: QuizQuestion): string | null {
  const text = question.explanation?.trim();
  return text ? text : null;
}

export const optionLetter = (index: number) => String.fromCharCode(65 + index);
