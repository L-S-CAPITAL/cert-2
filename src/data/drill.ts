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
