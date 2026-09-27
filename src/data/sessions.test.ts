import { describe, expect, it } from 'vitest';
import { describeSession, formatSessionDate } from './sessions';
import { ALL_UNITS } from './course';
import { MATH_UNIT } from './math';
import { BLUEPRINT_UNIT } from './blueprints';

const log = (unitId: string, topicId: string | null) => ({
  id: '1',
  unitId,
  topicId,
  durationSeconds: 60,
  timestamp: '2026-09-28T01:30:00.000Z',
});

describe('describeSession', () => {
  it('resolves core units and their topics', () => {
    const unit = ALL_UNITS[0];
    expect(describeSession(log(unit.id, unit.topics[0].id))).toEqual({
      unitLabel: unit.code,
      topicTitle: unit.topics[0].title,
    });
  });

  it('resolves study strands instead of showing Unknown', () => {
    expect(describeSession(log(MATH_UNIT.id, MATH_UNIT.topics[1].id))).toEqual({
      unitLabel: 'MATH',
      topicTitle: MATH_UNIT.topics[1].title,
    });
    expect(describeSession(log(BLUEPRINT_UNIT.id, null))).toEqual({
      unitLabel: BLUEPRINT_UNIT.code,
      topicTitle: null,
    });
  });

  it('falls back to the stored id for unknown units', () => {
    expect(describeSession(log('retired-unit', 'x'))).toEqual({
      unitLabel: 'retired-unit',
      topicTitle: null,
    });
  });
});

describe('formatSessionDate', () => {
  it('uses en-AU day-month-year ordering', () => {
    const formatted = formatSessionDate('2026-09-28T01:30:00.000Z');
    expect(formatted).toMatch(/28 Sept? 2026/);
  });
});
