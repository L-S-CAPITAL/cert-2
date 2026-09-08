import { describe, expect, it } from 'vitest';
import {
  GEOMETRY_MODULES,
  GEOMETRY_UNIT,
  TRIANGLE_345,
  buildGeometryPaper,
  isGeometryModuleUnlocked,
} from './geometry';

describe('Geometry, Physics & Hand Tools', () => {
  it('lists eight modules in the specified order', () => {
    expect(GEOMETRY_MODULES.map((module) => module.title)).toEqual([
      "Pythagoras' Theorem",
      'Basic Trigonometry (SOH CAH TOA)',
      'Electrical Physics (The Water Analogy)',
      'Hand Tools Overview',
      'Workshop Tools & Multimeter Basics',
      'Trig, Pythagoras, & Tool Safety',
      'Decompress & Recharge',
      'Study Guide & Key Focus',
    ]);
    expect(GEOMETRY_MODULES.every((module, i) => module.order === i + 1)).toBe(
      true,
    );
  });

  it('uses the 3-4-5 triangle for Pythagoras and SOH CAH TOA checks', () => {
    expect(TRIANGLE_345.a ** 2 + TRIANGLE_345.b ** 2).toBe(TRIANGLE_345.c ** 2);
    expect(TRIANGLE_345.sin).toBeCloseTo(3 / 5);
    expect(TRIANGLE_345.cos).toBeCloseTo(4 / 5);
    expect(TRIANGLE_345.tan).toBeCloseTo(3 / 4);
  });

  it('maps every module onto the GEO timer unit with a quiz', () => {
    expect(GEOMETRY_UNIT.id).toBe('geometry');
    expect(GEOMETRY_UNIT.topics).toHaveLength(8);
    for (const module of GEOMETRY_MODULES) {
      expect(module.quizQuestions.length, module.id).toBeGreaterThan(0);
    }
  });

  it('builds a mixed drill paper and unlocks in sequence', () => {
    expect(buildGeometryPaper(10, () => 0.5).length).toBeGreaterThan(0);
    expect(isGeometryModuleUnlocked(GEOMETRY_MODULES[0], {})).toBe(true);
    expect(isGeometryModuleUnlocked(GEOMETRY_MODULES[1], {})).toBe(false);
    expect(isGeometryModuleUnlocked(GEOMETRY_MODULES[1], { g1: true })).toBe(
      true,
    );
  });
});
