import { describe, expect, it } from 'vitest';
import { ALL_UNITS, CORE_UNITS, COURSE_INFO, findTopic } from './course';
import { ELECTIVE_UNITS } from './electives';

describe('course catalogue', () => {
  it('keeps eight core units totalling 140 points', () => {
    expect(CORE_UNITS).toHaveLength(COURSE_INFO.unitsCount);
    expect(CORE_UNITS.reduce((sum, unit) => sum + unit.points, 0)).toBe(140);
  });

  it('includes elective units beyond the core', () => {
    expect(ELECTIVE_UNITS.length).toBeGreaterThan(0);
    expect(ALL_UNITS.length).toBe(CORE_UNITS.length + ELECTIVE_UNITS.length);
  });

  it('gives every topic at least one quiz question', () => {
    for (const unit of ALL_UNITS) {
      for (const topic of unit.topics) {
        expect(
          topic.quizQuestions?.length ?? 0,
          `${unit.code} ${topic.id}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('finds topics by unit and topic id', () => {
    expect(findTopic('c1', 'c1-t1')?.title).toMatch(/WHS/i);
    expect(findTopic('math', 'm1')?.title).toMatch(/Fractions/i);
    expect(findTopic('algebra', 'a1')?.title).toMatch(/Powers/i);
    expect(findTopic('geometry', 'g1')?.title).toMatch(/Pythagoras/i);
    expect(findTopic('blueprints', 'b1')?.title).toMatch(/Series/i);
    expect(findTopic('missing', 'nope')).toBeUndefined();
  });
});
