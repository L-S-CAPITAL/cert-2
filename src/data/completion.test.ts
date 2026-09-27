import { describe, expect, it } from 'vitest';
import { summarizeCompletion } from './completion';
import { ALL_UNITS, CORE_UNITS, ELECTIVE_UNITS } from './course';
import { Unit } from '../types';

const topic = (id: string) => ({ id, title: id, content: '', keyPoints: [] });
const unit = (id: string, kind: 'core' | 'elective', topics: string[]): Unit => ({
  id,
  code: id.toUpperCase(),
  name: id,
  description: '',
  prerequisites: [],
  points: 10,
  kind,
  topics: topics.map(topic),
});

describe('summarizeCompletion', () => {
  const units = [
    unit('c1', 'core', ['a', 'b']),
    unit('c2', 'core', ['c', 'd']),
    unit('e1', 'elective', ['x', 'y', 'z', 'w']),
  ];

  it('reports core topics as the headline percent and electives separately', () => {
    const result = summarizeCompletion(units, {
      c1: { a: true, b: true },
      c2: { c: true },
      e1: { x: true, y: true, z: true, w: true },
    });
    expect(result.core).toEqual({
      percent: 75,
      topicsDone: 3,
      topicsTotal: 4,
      unitsDone: 1,
      unitsTotal: 2,
    });
    expect(result.electives).toEqual({
      percent: 100,
      topicsDone: 4,
      topicsTotal: 4,
      unitsDone: 1,
      unitsTotal: 1,
    });
  });

  it('ignores false flags and returns 0% for empty groups', () => {
    const result = summarizeCompletion([units[0]], { c1: { a: false } });
    expect(result.core.percent).toBe(0);
    expect(result.core.unitsDone).toBe(0);
    expect(result.electives).toEqual({
      percent: 0,
      topicsDone: 0,
      topicsTotal: 0,
      unitsDone: 0,
      unitsTotal: 0,
    });
  });

  it('splits the shipped course into its core and elective units', () => {
    const result = summarizeCompletion(ALL_UNITS, {});
    expect(result.core.unitsTotal).toBe(CORE_UNITS.length);
    expect(result.electives.unitsTotal).toBe(ELECTIVE_UNITS.length);
    expect(result.core.percent).toBe(0);
  });
});
