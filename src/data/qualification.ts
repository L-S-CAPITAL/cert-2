import { Unit } from '../types';
import { isUnitComplete } from './prerequisites';

type Completions = Record<string, Record<string, boolean>>;

/**
 * Packaging rules for UEE22020 Certificate II in Electrotechnology (Career
 * Start), Release 2 (23 Mar 2022), copied from the official National
 * Training Register entry:
 *
 *   https://training.gov.au/Training/Details/UEE22020
 *   (checked 28 Sep 2026)
 *
 * "A total of 410 weighting points comprising: 270 core weighting points
 * [...] plus 140 general elective weighting points [...] of which between 0
 * and 60 weighting points can be taken from Group A; and between 80 and 140
 * weighting points must be taken from Group B; or all 140 weighting points
 * can be taken from Group B."
 *
 * Group A may also include up to 60 points of units imported from other
 * training packages "with appropriate contextualisation"; weighting points
 * for those are listed in the UEE Companion Volume Implementation Guide
 * (not reproduced here), so units outside the lists below are not counted.
 *
 * Note: training.gov.au marks UEE22020 as superseded (24 Nov 2025) by the
 * equivalent UEE22025 (https://training.gov.au/Training/Details/UEE22025).
 * This terminal tracks a UEE22020 enrolment: the 8 core units plus the
 * electives UEECD0008 (B, 60), UEECD0019 (B, 40), UEECD0020 (B, 20) and
 * UEECD0035 (A, 20) = 140 elective points. Unit.points in course.ts and
 * electives.ts use the same official weighting points (a test checks it).
 */
export const QUALIFICATION_RULES = {
  code: 'UEE22020',
  release: 2,
  sourceUrl: 'https://training.gov.au/Training/Details/UEE22020',
  checked: '2026-09-28',
  supersededBy: { code: 'UEE22025', date: '2025-11-24' },
  totalPoints: 410,
  corePoints: 270,
  electivePoints: 140,
  groupAMaxPoints: 60,
  groupBMinPoints: 80,
  /** Core units and their weighting points (all eight are required). */
  core: {
    CPCCWHS1001: 10,
    UEECD0007: 20,
    UEECD0009: 40,
    UEECD0021: 20,
    UEECD0038: 60,
    UEECD0046: 40,
    UEECD0052: 40,
    UEERE0021: 40,
  } as Record<string, number>,
  /** Group A: imported and common elective units. */
  groupA: {
    BSBOPS203: 20,
    HLTAID009: 10,
    UEECD0035: 20,
    UEECO0002: 20,
  } as Record<string, number>,
  /** Group B: general elective units. */
  groupB: {
    ICTICT214: 20,
    UEEAS0001: 40,
    UEEAS0004: 20,
    UEECD0008: 60,
    UEECD0019: 40,
    UEECD0020: 20,
    UEECD0033: 40,
    UEECD0034: 40,
    UEEEC0060: 40,
    UEERA0036: 60,
    UEERE0001: 20,
    UEERL0001: 20,
  } as Record<string, number>,
} as const;

export type ElectiveGroup = 'A' | 'B';

export interface ElectiveUnitStatus {
  unit: Unit;
  /** Official group and weighting points, or null if not on the UEE22020 lists. */
  group: ElectiveGroup | null;
  points: number | null;
  complete: boolean;
}

export interface QualificationProgress {
  core: {
    unitsDone: number;
    unitsRequired: number;
    pointsDone: number;
    pointsRequired: number;
    /** Official core units that this app does not cover (codes). */
    missingFromApp: string[];
    /** Official core units not yet complete here (includes missingFromApp). */
    remaining: string[];
    remainingPoints: number;
  };
  electives: {
    /** Points that count toward the 140 (Group A capped at 60). */
    pointsCounted: number;
    pointsRequired: number;
    groupAPoints: number;
    groupACounted: number;
    groupAMax: number;
    groupBPoints: number;
    groupBMin: number;
    /** Elective points still needed, and how many of them must be Group B. */
    pointsNeeded: number;
    groupBNeeded: number;
    /** Most elective points the units in this app could ever count for. */
    pointsAvailableInApp: number;
    /** True when finishing every listed elective here would meet the rules. */
    coversRules: boolean;
    /** Listed electives here that are not complete yet. */
    remainingUnits: ElectiveUnitStatus[];
    units: ElectiveUnitStatus[];
    /** App electives that are not on the UEE22020 elective lists. */
    notListed: Unit[];
  };
  complete: boolean;
}

export function electiveGroup(code: string): { group: ElectiveGroup; points: number } | null {
  if (code in QUALIFICATION_RULES.groupA) return { group: 'A', points: QUALIFICATION_RULES.groupA[code] };
  if (code in QUALIFICATION_RULES.groupB) return { group: 'B', points: QUALIFICATION_RULES.groupB[code] };
  return null;
}

/** Group A counts up to its cap; everything counts toward at most 140. */
function countElectivePoints(groupA: number, groupB: number) {
  const rules = QUALIFICATION_RULES;
  const groupACounted = Math.min(groupA, rules.groupAMaxPoints);
  const pointsCounted = Math.min(groupACounted + groupB, rules.electivePoints);
  return { groupACounted, pointsCounted };
}

/**
 * Progress toward UEE22020 under the official packaging rules, from the
 * units in this app. A unit counts once every one of its topics is complete.
 * Units are matched to the rules by code, using the official weighting
 * points (not Unit.points).
 */
export function qualificationProgress(
  units: Unit[],
  completions: Completions,
): QualificationProgress {
  const rules = QUALIFICATION_RULES;
  const byCode = new Map(units.map((unit) => [unit.code, unit]));

  const coreCodes = Object.keys(rules.core);
  const missingFromApp = coreCodes.filter((code) => !byCode.has(code));
  const coreDone = coreCodes.filter((code) => {
    const unit = byCode.get(code);
    return unit ? isUnitComplete(unit, completions) : false;
  });
  const remaining = coreCodes.filter((code) => !coreDone.includes(code));
  const corePointsDone = coreDone.reduce((sum, code) => sum + rules.core[code], 0);

  const electiveUnits = units.filter(
    (unit) => unit.kind === 'elective' && !(unit.code in rules.core),
  );
  const statuses: ElectiveUnitStatus[] = electiveUnits.map((unit) => {
    const listed = electiveGroup(unit.code);
    return {
      unit,
      group: listed?.group ?? null,
      points: listed?.points ?? null,
      complete: isUnitComplete(unit, completions),
    };
  });

  const sumPoints = (group: ElectiveGroup, onlyComplete: boolean) =>
    statuses
      .filter((status) => status.group === group && (!onlyComplete || status.complete))
      .reduce((sum, status) => sum + (status.points ?? 0), 0);

  const groupAPoints = sumPoints('A', true);
  const groupBPoints = sumPoints('B', true);
  const { groupACounted, pointsCounted } = countElectivePoints(groupAPoints, groupBPoints);
  const available = countElectivePoints(sumPoints('A', false), sumPoints('B', false));

  const pointsNeeded = rules.electivePoints - pointsCounted;
  const groupBNeeded = Math.max(0, rules.groupBMinPoints - groupBPoints);

  return {
    core: {
      unitsDone: coreDone.length,
      unitsRequired: coreCodes.length,
      pointsDone: corePointsDone,
      pointsRequired: rules.corePoints,
      missingFromApp,
      remaining,
      remainingPoints: rules.corePoints - corePointsDone,
    },
    electives: {
      pointsCounted,
      pointsRequired: rules.electivePoints,
      groupAPoints,
      groupACounted,
      groupAMax: rules.groupAMaxPoints,
      groupBPoints,
      groupBMin: rules.groupBMinPoints,
      pointsNeeded,
      groupBNeeded,
      pointsAvailableInApp: available.pointsCounted,
      coversRules:
        available.pointsCounted >= rules.electivePoints &&
        sumPoints('B', false) >= rules.groupBMinPoints,
      remainingUnits: statuses.filter((status) => status.group !== null && !status.complete),
      units: statuses,
      notListed: statuses.filter((status) => status.group === null).map((status) => status.unit),
    },
    complete: remaining.length === 0 && pointsNeeded === 0 && groupBNeeded === 0,
  };
}

/** One plain sentence: what is still needed for the qualification. */
export function stillNeededSummary(progress: QualificationProgress): string {
  if (progress.complete) {
    return 'All UEE22020 packaging requirements are covered by your completed units.';
  }
  const parts: string[] = [];
  const { core, electives } = progress;
  if (core.remaining.length > 0) {
    parts.push(
      `${core.remaining.length} core ${core.remaining.length === 1 ? 'unit' : 'units'} (${
        core.remainingPoints
      } pts)`,
    );
  }
  const remainingElectivePoints = electives.remainingUnits.reduce(
    (sum, status) => sum + (status.points ?? 0),
    0,
  );
  if (
    electives.coversRules &&
    electives.pointsNeeded > 0 &&
    remainingElectivePoints === electives.pointsNeeded
  ) {
    // The usual case: the electives in this terminal are exactly the ones
    // needed, so just say how many are left.
    const count = electives.remainingUnits.length;
    parts.push(`${count} elective ${count === 1 ? 'unit' : 'units'} (${electives.pointsNeeded} pts)`);
  } else if (electives.pointsNeeded > 0 || electives.groupBNeeded > 0) {
    const need = Math.max(electives.pointsNeeded, electives.groupBNeeded);
    const groupB =
      electives.groupBNeeded > 0
        ? electives.groupBNeeded === need
          ? ', all from Group B'
          : `, at least ${electives.groupBNeeded} from Group B`
        : '';
    parts.push(`${need} elective pts${groupB}`);
  }
  return `Still needed: ${parts.join(' and ')}.`;
}
