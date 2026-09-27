import { describe, expect, it } from 'vitest';
import { evaluateDrill } from './drill';

const items = (count: number) =>
  Array.from({ length: count }, () => ({ correctAnswer: 0 }));

describe('evaluateDrill', () => {
  it('fails a 90.4s average against a 90s target, and says so', () => {
    // 5 answered items: 90 + 90 + 90 + 90 + 92 = 452s, mean 90.4s.
    const result = evaluateDrill({
      answers: [0, 0, 0, 0, 0],
      times: [90, 90, 90, 90, 92],
      items: items(5),
      passPercent: 70,
      passAnswered: 5,
      perQuestionSeconds: 90,
    });
    expect(result.averageSeconds).toBe(90.4);
    expect(result.speedOk).toBe(false);
    expect(result.passed).toBe(false);
  });

  it('passes exactly on the target average', () => {
    const result = evaluateDrill({
      answers: [0, 0, 0, 0],
      times: [89, 91, 90, 90],
      items: items(4),
      passPercent: 70,
      passAnswered: 4,
      perQuestionSeconds: 90,
    });
    expect(result.averageSeconds).toBe(90);
    expect(result.speedOk).toBe(true);
    expect(result.passed).toBe(true);
  });

  it('excludes skipped and timed-out items from the average', () => {
    // Items 3 and 4 were skipped / timed out. Even if a stale time is
    // present for them, only answered items count.
    const result = evaluateDrill({
      answers: [0, 0, null, null],
      times: [10, 20, 120, null],
      items: items(4),
      passPercent: 70,
      passAnswered: 2,
      perQuestionSeconds: 30,
    });
    expect(result.answered).toBe(2);
    expect(result.averageSeconds).toBe(15);
    expect(result.speedOk).toBe(true);
    expect(result.passed).toBe(true);
  });

  it('has no average and fails the speed check when nothing was answered', () => {
    const result = evaluateDrill({
      answers: [null, null],
      times: [null, null],
      items: items(2),
      passPercent: 0,
      passAnswered: 0,
      perQuestionSeconds: 30,
    });
    expect(result.averageSeconds).toBeNull();
    expect(result.speedOk).toBe(false);
    expect(result.passed).toBe(false);
  });

  it('ignores speed when the module has no per-question target', () => {
    const result = evaluateDrill({
      answers: [0, 1, 0],
      times: [500, 500, 500],
      items: items(3),
      passPercent: 60,
      passAnswered: 3,
    });
    expect(result.percent).toBe(67);
    expect(result.speedOk).toBe(true);
    expect(result.passed).toBe(true);
  });

  it('enforces the minimum answered count and pass percent', () => {
    const base = {
      times: [5, 5, 5, 5],
      items: items(4),
      perQuestionSeconds: 30,
    };
    expect(
      evaluateDrill({ ...base, answers: [0, 0, null, null], passPercent: 70, passAnswered: 3 })
        .passed,
    ).toBe(false);
    expect(
      evaluateDrill({ ...base, answers: [0, 1, 1, 0], passPercent: 70, passAnswered: 3 })
        .passed,
    ).toBe(false);
  });
});
