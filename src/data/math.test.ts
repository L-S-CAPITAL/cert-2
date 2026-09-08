import { describe, expect, it } from 'vitest';
import {
  DRILL_SECONDS,
  EIGHTHS,
  MATH_MODULES,
  MATH_UNIT,
  buildDrillPaper,
  isMathModuleUnlocked,
  scoreDrill,
} from './math';

describe('Foundational Trade Mathematics', () => {
  it('lists seven modules in the specified order', () => {
    expect(MATH_MODULES.map((module) => module.title)).toEqual([
      'Basic Fractions & Decimals',
      'Advanced Fractional Addition & Subtraction',
      'Order of Operations (BODMAS/BIDMAS)',
      'Trade Percentages',
      'Math Review & Speed Drill',
      'Mental Recovery & Flashcards',
      'Study Guide & Key Focus',
    ]);
    expect(MATH_MODULES.every((module, i) => module.order === i + 1)).toBe(
      true,
    );
  });

  it('covers eighths from 1/8 through 7/8', () => {
    expect(EIGHTHS.map((row) => row.fraction)).toEqual([
      '1/8',
      '1/4',
      '3/8',
      '1/2',
      '5/8',
      '3/4',
      '7/8',
    ]);
    expect(EIGHTHS.map((row) => row.decimal)).toEqual([
      0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875,
    ]);
  });

  it('gives every module a quiz and maps them onto a timer unit', () => {
    for (const module of MATH_MODULES) {
      expect(module.quizQuestions.length, module.id).toBeGreaterThan(0);
    }
    expect(MATH_UNIT.id).toBe('math');
    expect(MATH_UNIT.topics).toHaveLength(MATH_MODULES.length);
  });

  it('builds a 10-minute drill paper with valid answers', () => {
    expect(DRILL_SECONDS).toBe(600);
    const paper = buildDrillPaper(12, () => 0.5);
    expect(paper).toHaveLength(12);
    for (const item of paper) {
      expect(item.options).toHaveLength(4);
      expect(item.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(item.correctAnswer).toBeLessThan(4);
      expect(item.options[item.correctAnswer]).toBeTruthy();
    }
  });

  it('scores a drill as percent of answered questions', () => {
    expect(scoreDrill([0, 1, null], [
      { correctAnswer: 0 },
      { correctAnswer: 0 },
      { correctAnswer: 2 },
    ])).toEqual({ answered: 2, correct: 1, percent: 50 });
  });

  it('unlocks modules in sequence', () => {
    expect(isMathModuleUnlocked(MATH_MODULES[0], {})).toBe(true);
    expect(isMathModuleUnlocked(MATH_MODULES[1], {})).toBe(false);
    expect(isMathModuleUnlocked(MATH_MODULES[1], { m1: true })).toBe(true);
  });
});
