import { describe, expect, it } from 'vitest';
import { Unit } from '../types';
import { isUnitComplete, isUnitUnlocked } from './prerequisites';

const topic = (id: string) => ({
  id,
  title: id,
  content: '',
  keyPoints: [],
});

const unit = (partial: Partial<Unit> & Pick<Unit, 'id' | 'code'>): Unit => ({
  name: partial.code,
  description: '',
  prerequisites: [],
  points: 10,
  topics: [topic(`${partial.id}-t1`)],
  kind: 'core',
  ...partial,
});

describe('isUnitComplete', () => {
  it('is false when any topic is incomplete', () => {
    const u = unit({ id: 'c1', code: 'UEECD0007', topics: [topic('a'), topic('b')] });
    expect(isUnitComplete(u, { c1: { a: true } })).toBe(false);
  });

  it('is true when every topic is marked complete', () => {
    const u = unit({ id: 'c1', code: 'UEECD0007', topics: [topic('a'), topic('b')] });
    expect(isUnitComplete(u, { c1: { a: true, b: true } })).toBe(true);
  });

  it('is false for a unit with no topics', () => {
    const u = unit({ id: 'c1', code: 'UEECD0007', topics: [] });
    expect(isUnitComplete(u, {})).toBe(false);
  });
});

describe('isUnitUnlocked', () => {
  const base = unit({ id: 'c2', code: 'UEECD0007' });
  const next = unit({
    id: 'c3',
    code: 'UEECD0009',
    prerequisites: ['UEECD0007'],
  });
  const units = [base, next];

  it('unlocks units with no prerequisites', () => {
    expect(isUnitUnlocked(base, units, {})).toBe(true);
  });

  it('locks a unit until every prerequisite unit is complete', () => {
    expect(isUnitUnlocked(next, units, {})).toBe(false);
    expect(isUnitUnlocked(next, units, { c2: { 'c2-t1': true } })).toBe(true);
  });

  it('locks when a prerequisite code is missing from the catalogue', () => {
    const orphan = unit({
      id: 'x',
      code: 'UEECD9999',
      prerequisites: ['DOES-NOT-EXIST'],
    });
    expect(isUnitUnlocked(orphan, units, {})).toBe(false);
  });
});
