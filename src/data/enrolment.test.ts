import { describe, expect, it } from 'vitest';
import { ALL_UNITS, CORE_UNITS, COURSE_INFO, ELECTIVE_UNITS, findTopic, findUnit } from './course';
import { ARCHIVED_ELECTIVE_UNITS } from './archivedElectives';
import { summarizeCompletion } from './completion';
import { QUALIFICATION_RULES, electiveGroup, qualificationProgress, stillNeededSummary } from './qualification';

const sum = (units: { points: number }[]) => units.reduce((total, unit) => total + unit.points, 0);

describe("Toby's UEE22020 enrolment", () => {
  it('lists exactly the enrolled core and elective units', () => {
    expect(CORE_UNITS.map((u) => u.code)).toEqual([
      'CPCCWHS1001',
      'UEECD0007',
      'UEECD0009',
      'UEECD0021',
      'UEECD0038',
      'UEECD0046',
      'UEECD0052',
      'UEERE0021',
    ]);
    expect(ELECTIVE_UNITS.map((u) => u.code)).toEqual([
      'UEECD0008',
      'UEECD0019',
      'UEECD0020',
      'UEECD0035',
    ]);
    expect(ALL_UNITS).toHaveLength(12);
  });

  it('uses the official weighting points on every unit', () => {
    for (const unit of CORE_UNITS) {
      expect(unit.points, unit.code).toBe(QUALIFICATION_RULES.core[unit.code]);
    }
    for (const unit of ELECTIVE_UNITS) {
      expect(unit.points, unit.code).toBe(electiveGroup(unit.code)?.points);
    }
  });

  it('adds up to 270 core + 140 elective = 410, with Group A 20 and Group B 120', () => {
    expect(sum(CORE_UNITS)).toBe(270);
    expect(sum(ELECTIVE_UNITS)).toBe(140);
    const group = (g: 'A' | 'B') => sum(ELECTIVE_UNITS.filter((u) => electiveGroup(u.code)?.group === g));
    expect(group('A')).toBe(20);
    expect(group('B')).toBe(120);
    expect(COURSE_INFO).toMatchObject({
      totalPoints: 410,
      corePointsRequired: 270,
      electivePointsRequired: 140,
      unitsCount: 8,
    });
  });

  it('can meet the packaging rules with the electives in the app', () => {
    const progress = qualificationProgress(ALL_UNITS, {});
    expect(progress.electives.pointsAvailableInApp).toBe(140);
    expect(progress.electives.coversRules).toBe(true);
    expect(progress.electives.notListed).toEqual([]);
    expect(stillNeededSummary(progress)).toBe(
      'Still needed: 8 core units (270 pts) and 4 elective units (140 pts).',
    );
  });
});

describe('new elective units (topic outlines from training.gov.au elements)', () => {
  const outline = (code: string) => {
    const unit = ALL_UNITS.find((u) => u.code === code)!;
    return { id: unit.id, prerequisites: unit.prerequisites, topics: unit.topics.map((t) => [t.id, t.title]) };
  };

  it('UEECD0008 has one topic per element', () => {
    expect(outline('UEECD0008')).toEqual({
      id: 'e5',
      prerequisites: ['UEECD0007'],
      topics: [
        ['e5-t1', 'Plan energy sector support activity'],
        ['e5-t2', 'Undertake energy sector support activity'],
        ['e5-t3', 'Complete energy sector work activity'],
      ],
    });
  });

  it('UEECD0019 has one topic per element', () => {
    expect(outline('UEECD0019')).toEqual({
      id: 'e6',
      prerequisites: ['UEECD0007'],
      topics: [
        ['e6-t1', 'Prepare for dismantling, assembling and fabrication work'],
        ['e6-t2', 'Dismantle and assemble utilities industry apparatus'],
        ['e6-t3', 'Fabricate utilities industry components'],
      ],
    });
  });

  it('UEECD0035 has one topic per element', () => {
    expect(outline('UEECD0035')).toEqual({
      id: 'e7',
      prerequisites: [],
      topics: [
        ['e7-t1', 'Prepare to instruct in the use of electrotechnology apparatus'],
        ['e7-t2', 'Instruct user in the use of electrotechnology apparatus'],
      ],
    });
  });

  it('are outlines only: no quiz questions yet', () => {
    for (const id of ['e5', 'e6', 'e7']) {
      const unit = ALL_UNITS.find((u) => u.id === id)!;
      for (const topic of unit.topics) {
        expect(topic.quizQuestions ?? [], topic.id).toEqual([]);
        expect(topic.content.length, topic.id).toBeGreaterThan(0);
      }
    }
  });
});

describe('removed electives (UEECD0044, UEECD0051, UEECO0002)', () => {
  const removed = ['UEECD0044', 'UEECD0051', 'UEECO0002'];

  it('are not in the unit list', () => {
    for (const code of removed) {
      expect(ALL_UNITS.some((u) => u.code === code), code).toBe(false);
    }
  });

  it('keep their content and quizzes in the archive, with ids that are not reused', () => {
    expect(ARCHIVED_ELECTIVE_UNITS.map((u) => [u.id, u.code])).toEqual([
      ['e1', 'UEECD0044'],
      ['e2', 'UEECD0051'],
      ['e4', 'UEECO0002'],
    ]);
    const liveIds = new Set(ALL_UNITS.map((u) => u.id));
    for (const unit of ARCHIVED_ELECTIVE_UNITS) expect(liveIds.has(unit.id)).toBe(false);
  });

  it('still resolve by id so old session logs and quiz results show a name', () => {
    expect(findUnit('e1')?.code).toBe('UEECD0044');
    expect(findUnit('e2')?.code).toBe('UEECD0051');
    expect(findUnit('e4')?.code).toBe('UEECO0002');
    expect(findTopic('e1', 'e1-t1')?.quizQuestions?.length ?? 0).toBeGreaterThan(0);
  });

  it('saved completions for them are ignored by every figure', () => {
    const oldSave = {
      e1: { 'e1-t1': true, 'e1-t2': true },
      e2: { 'e2-t1': true, 'e2-t2': true },
      e4: { 'e4-t1': true },
    };
    const summary = summarizeCompletion(ALL_UNITS, oldSave);
    expect(summary.electives.unitsDone).toBe(0);
    expect(summary.electives.topicsDone).toBe(0);
    const progress = qualificationProgress(ALL_UNITS, oldSave);
    expect(progress.electives.pointsCounted).toBe(0);
    expect(progress.core.pointsDone).toBe(0);
  });
});
