import { describe, expect, it } from 'vitest';
import {
  BLUEPRINT_MODULES,
  BLUEPRINT_UNIT,
  SAMPLE_SCHEDULES,
  buildBlueprintPaper,
  isBlueprintModuleUnlocked,
} from './blueprints';

describe('Technical Documents & Blueprints', () => {
  it('lists eight modules in the specified order', () => {
    expect(BLUEPRINT_MODULES.map((module) => module.title)).toEqual([
      'Circuit Schematics (Series vs. Parallel)',
      'Residential Blueprints',
      'Commercial Single Line Diagrams (SLDs)',
      'Multi-Page Off-Sheet Connectors',
      'Decoding Circuit Schedules',
      'Blueprint Symbols & Schedules',
      'Domestic Layout Reflection',
      'Study Guide & Key Focus',
    ]);
    expect(BLUEPRINT_MODULES.every((module, i) => module.order === i + 1)).toBe(
      true,
    );
  });

  it('includes the example schedule string and five decode lines', () => {
    expect(SAMPLE_SCHEDULES).toHaveLength(5);
    expect(SAMPLE_SCHEDULES[0].code).toContain('DB-1A');
    expect(SAMPLE_SCHEDULES[0].code).toContain('16A RCBO');
  });

  it('maps every module onto the DWG timer unit with a quiz', () => {
    expect(BLUEPRINT_UNIT.id).toBe('blueprints');
    expect(BLUEPRINT_UNIT.topics).toHaveLength(8);
    for (const module of BLUEPRINT_MODULES) {
      expect(module.quizQuestions.length, module.id).toBeGreaterThan(0);
    }
  });

  it('builds a drill paper and unlocks in sequence', () => {
    expect(buildBlueprintPaper(8, () => 0.5).length).toBeGreaterThan(0);
    expect(isBlueprintModuleUnlocked(BLUEPRINT_MODULES[0], {})).toBe(true);
    expect(isBlueprintModuleUnlocked(BLUEPRINT_MODULES[1], {})).toBe(false);
    expect(
      isBlueprintModuleUnlocked(BLUEPRINT_MODULES[1], { b1: true }),
    ).toBe(true);
  });
});
