import { describe, expect, it } from 'vitest';
import { Unit } from '../types';
import { ALL_UNITS } from './course';
import {
  QUALIFICATION_RULES,
  electiveGroup,
  qualificationProgress,
  stillNeededSummary,
} from './qualification';

type Completions = Record<string, Record<string, boolean>>;

const unit = (code: string, kind: 'core' | 'elective' = 'elective', topics = 1): Unit => ({
  id: code.toLowerCase(),
  code,
  name: code,
  description: '',
  prerequisites: [],
  points: 0,
  kind,
  topics: Array.from({ length: topics }, (_, i) => ({
    id: `${code.toLowerCase()}-t${i + 1}`,
    title: `Topic ${i + 1}`,
    content: '',
    keyPoints: [],
  })),
});

const complete = (...units: Unit[]): Completions =>
  Object.fromEntries(
    units.map((u) => [u.id, Object.fromEntries(u.topics.map((t) => [t.id, true]))]),
  );

const coreUnits = Object.keys(QUALIFICATION_RULES.core).map((code) => unit(code, 'core'));

describe('UEE22020 packaging rules (training.gov.au, release 2)', () => {
  it('adds up as published: 270 core + 140 elective = 410', () => {
    const sum = (table: Record<string, number>) => Object.values(table).reduce((a, b) => a + b, 0);
    expect(Object.keys(QUALIFICATION_RULES.core)).toHaveLength(8);
    expect(sum(QUALIFICATION_RULES.core)).toBe(QUALIFICATION_RULES.corePoints);
    expect(QUALIFICATION_RULES.corePoints + QUALIFICATION_RULES.electivePoints).toBe(
      QUALIFICATION_RULES.totalPoints,
    );
    expect(Object.keys(QUALIFICATION_RULES.groupA)).toHaveLength(4);
    expect(Object.keys(QUALIFICATION_RULES.groupB)).toHaveLength(12);
  });

  it('matches the core units shipped in the app', () => {
    const appCore = ALL_UNITS.filter((u) => u.kind !== 'elective').map((u) => u.code).sort();
    expect(appCore).toEqual(Object.keys(QUALIFICATION_RULES.core).sort());
  });

  it('looks up elective groups and weighting points', () => {
    expect(electiveGroup('UEECO0002')).toEqual({ group: 'A', points: 20 });
    expect(electiveGroup('UEECD0020')).toEqual({ group: 'B', points: 20 });
    expect(electiveGroup('UEECD0044')).toBeNull();
    expect(electiveGroup('UEECD0051')).toBeNull();
  });
});

describe('qualificationProgress', () => {
  it('counts completed core units with official weighting points', () => {
    const [whs, , , , problems] = coreUnits; // CPCCWHS1001 (10), UEECD0038 (60)
    const progress = qualificationProgress(coreUnits, complete(whs, problems));
    expect(progress.core).toMatchObject({
      unitsDone: 2,
      unitsRequired: 8,
      pointsDone: 70,
      pointsRequired: 270,
      remainingPoints: 200,
      missingFromApp: [],
    });
    expect(progress.core.remaining).toHaveLength(6);
  });

  it('reports official core units the app does not include', () => {
    const progress = qualificationProgress(coreUnits.slice(1), {});
    expect(progress.core.missingFromApp).toEqual(['CPCCWHS1001']);
    expect(progress.core.remaining).toContain('CPCCWHS1001');
  });

  it('caps Group A at 60 points and requires 80 from Group B', () => {
    const groupA = ['BSBOPS203', 'HLTAID009', 'UEECD0035', 'UEECO0002'].map((c) => unit(c)); // 70 pts
    const progress = qualificationProgress(groupA, complete(...groupA));
    expect(progress.electives).toMatchObject({
      groupAPoints: 70,
      groupACounted: 60,
      groupBPoints: 0,
      pointsCounted: 60,
      pointsNeeded: 80,
      groupBNeeded: 80,
    });
  });

  it('is satisfied by 140 Group B points alone, and never counts more than 140', () => {
    const groupB = ['UEECD0008', 'UEERA0036', 'UEEAS0001', 'UEECD0019'].map((c) => unit(c)); // 200 pts
    const progress = qualificationProgress([...coreUnits, ...groupB], complete(...coreUnits, ...groupB));
    expect(progress.electives.pointsCounted).toBe(140);
    expect(progress.electives.pointsNeeded).toBe(0);
    expect(progress.electives.groupBNeeded).toBe(0);
    expect(progress.complete).toBe(true);
    expect(stillNeededSummary(progress)).toMatch(/All UEE22020 packaging requirements/);
  });

  it('ignores electives that are not on the UEE22020 lists and incomplete units', () => {
    const listed = unit('UEECD0020', 'elective', 2);
    const unlisted = unit('UEECD0044');
    const progress = qualificationProgress([listed, unlisted], {
      ...complete(unlisted),
      [listed.id]: { [listed.topics[0].id]: true },
    });
    expect(progress.electives.pointsCounted).toBe(0);
    expect(progress.electives.notListed.map((u) => u.code)).toEqual(['UEECD0044']);
    expect(progress.electives.pointsAvailableInApp).toBe(20);
  });

  it('works out what the real app units can cover', () => {
    const progress = qualificationProgress(ALL_UNITS, {});
    // UEECD0020 (Group B, 20) + UEECO0002 (Group A, 20); UEECD0044 and
    // UEECD0051 are not on the UEE22020 elective lists.
    expect(progress.electives.pointsAvailableInApp).toBe(40);
    expect(progress.electives.notListed.map((u) => u.code).sort()).toEqual(['UEECD0044', 'UEECD0051']);
    expect(progress.core.missingFromApp).toEqual([]);
  });
});

describe('stillNeededSummary', () => {
  it('names remaining core units/points and the Group B minimum', () => {
    const [whs] = coreUnits;
    const a = unit('UEECO0002');
    const progress = qualificationProgress([...coreUnits, a], complete(whs, a));
    expect(stillNeededSummary(progress)).toBe(
      'Still needed: 7 core units (260 pts) and 120 elective pts, at least 80 from Group B.',
    );
  });

  it('says "all from Group B" when the rest must come from Group B', () => {
    const groupA = ['BSBOPS203', 'UEECD0035', 'UEECO0002'].map((c) => unit(c)); // 60 pts
    const progress = qualificationProgress([...coreUnits, ...groupA], complete(...coreUnits, ...groupA));
    expect(stillNeededSummary(progress)).toBe('Still needed: 80 elective pts, all from Group B.');
  });

  it('handles one remaining core unit', () => {
    const progress = qualificationProgress(coreUnits, complete(...coreUnits.slice(1)));
    expect(stillNeededSummary(progress)).toBe(
      'Still needed: 1 core unit (10 pts) and 140 elective pts, at least 80 from Group B.',
    );
  });
});
