import { DrillItem } from '../types';

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = copy[i];
    copy[i] = copy[j];
    copy[j] = current;
  }
  return copy;
}

export function makeDrillPaper(
  bank: DrillItem[],
  count: number,
  rng: () => number = Math.random,
): DrillItem[] {
  const size = Math.min(count, bank.length);
  return shuffle(bank, rng).slice(0, size);
}

export function scoreDrill(
  answers: Array<number | null>,
  items: Array<{ correctAnswer: number }>,
): { answered: number; correct: number; percent: number } {
  let answered = 0;
  let correct = 0;
  items.forEach((item, index) => {
    const given = answers[index];
    if (given === null || given === undefined) return;
    answered += 1;
    if (given === item.correctAnswer) correct += 1;
  });
  const percent = answered === 0 ? 0 : Math.round((correct / answered) * 100);
  return { answered, correct, percent };
}

/**
 * Whole seconds left before `deadline` (a ms timestamp), rounded up so the
 * display reads e.g. 10:00 for the first second and 00:00 only at expiry.
 */
export function secondsUntil(deadline: number, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export interface DrillEvaluation {
  answered: number;
  correct: number;
  percent: number;
  /**
   * Mean seconds per answered item, rounded to one decimal place. Skipped
   * and timed-out items are excluded. null when nothing was answered.
   */
  averageSeconds: number | null;
  speedOk: boolean;
  passed: boolean;
}

/**
 * Single source of truth for a finished drill: the same result drives both
 * "mark module complete" and the result screen, so they can never disagree.
 * The speed check uses the rounded average that is shown to the learner.
 */
export function evaluateDrill(options: {
  answers: Array<number | null>;
  times: Array<number | null>;
  items: Array<{ correctAnswer: number }>;
  passPercent: number;
  passAnswered: number;
  perQuestionSeconds?: number;
}): DrillEvaluation {
  const { answers, times, items, passPercent, passAnswered, perQuestionSeconds } =
    options;
  const { answered, correct, percent } = scoreDrill(answers, items);

  const answeredTimes: number[] = [];
  items.forEach((_item, index) => {
    const given = answers[index];
    const time = times[index];
    if (given === null || given === undefined) return;
    if (time === null || time === undefined) return;
    answeredTimes.push(time);
  });
  const averageSeconds =
    answeredTimes.length === 0
      ? null
      : Math.round(
          (answeredTimes.reduce((sum, item) => sum + item, 0) /
            answeredTimes.length) *
            10,
        ) / 10;

  const speedOk = perQuestionSeconds
    ? averageSeconds !== null && averageSeconds <= perQuestionSeconds
    : true;
  const passed =
    percent >= passPercent && answered >= passAnswered && speedOk;

  return { answered, correct, percent, averageSeconds, speedOk, passed };
}

export function isModuleUnlocked(
  modules: Array<{ id: string; order: number }>,
  module: { id: string; order: number },
  completions?: Record<string, boolean>,
): boolean {
  if (module.order === 1) return true;
  const previous = modules.find((item) => item.order === module.order - 1);
  if (!previous) return true;
  return completions?.[previous.id] === true;
}
