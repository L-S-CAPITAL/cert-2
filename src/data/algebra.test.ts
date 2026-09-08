import { describe, expect, it } from 'vitest';
import { scoreDrill } from './drill';
import {
  ALGEBRA_MODULES,
  ALGEBRA_UNIT,
  PREFIX_SCALE,
  PREFIX_TARGET_SECONDS,
  buildAlgebraPaper,
  buildTransposePaper,
  isAlgebraModuleUnlocked,
} from './algebra';

describe('Scientific Notation, Prefixes & Algebra', () => {
  it('lists eight modules in the specified order', () => {
    expect(ALGEBRA_MODULES.map((module) => module.title)).toEqual([
      'Powers of 10 & Exponents',
      'Metric Prefix Conversions',
      "Introduction to Ohm's Law Transposition",
      "Solving Linear Equations for 'x'",
      'Math & Formula Review',
      'Algebraic & Metric Prefix Drills',
      'Reflect',
      'Study Guide & Key Focus',
    ]);
    expect(ALGEBRA_MODULES.every((module, i) => module.order === i + 1)).toBe(
      true,
    );
  });

  it('teaches M, k, milli and micro on the prefix scale', () => {
    const prefixes = PREFIX_SCALE.map((row) => row.prefix);
    expect(prefixes).toEqual(expect.arrayContaining(['M', 'k', 'm', 'µ']));
    expect(PREFIX_SCALE.find((row) => row.prefix === 'm')?.exp).toBe(-3);
    expect(PREFIX_SCALE.find((row) => row.prefix === 'µ')?.exp).toBe(-6);
  });

  it('maps every module onto the ALG timer unit with a quiz', () => {
    expect(ALGEBRA_UNIT.id).toBe('algebra');
    expect(ALGEBRA_UNIT.topics).toHaveLength(8);
    for (const module of ALGEBRA_MODULES) {
      expect(module.quizQuestions.length, module.id).toBeGreaterThan(0);
    }
  });

  it('builds mixed and per-equation drill papers', () => {
    const mixed = buildAlgebraPaper(10, () => 0.5);
    const timed = buildTransposePaper(8, () => 0.5);
    expect(mixed.length).toBeGreaterThan(0);
    expect(timed).toHaveLength(8);
    expect(PREFIX_TARGET_SECONDS).toBe(90);
    expect(scoreDrill([1, null], [{ correctAnswer: 1 }, { correctAnswer: 0 }])).toEqual(
      { answered: 1, correct: 1, percent: 100 },
    );
  });

  it('unlocks algebra modules in sequence', () => {
    expect(isAlgebraModuleUnlocked(ALGEBRA_MODULES[0], {})).toBe(true);
    expect(isAlgebraModuleUnlocked(ALGEBRA_MODULES[1], {})).toBe(false);
    expect(isAlgebraModuleUnlocked(ALGEBRA_MODULES[1], { a1: true })).toBe(true);
  });
});
