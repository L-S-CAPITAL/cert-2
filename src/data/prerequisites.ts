import { Unit } from '../types';

export function isUnitComplete(
  unit: Unit,
  completions: Record<string, Record<string, boolean>>,
): boolean {
  if (unit.topics.length === 0) return false;
  return unit.topics.every((topic) => completions[unit.id]?.[topic.id] === true);
}

export function isUnitUnlocked(
  unit: Unit,
  allUnits: Unit[],
  completions: Record<string, Record<string, boolean>>,
): boolean {
  if (unit.prerequisites.length === 0) return true;
  return unit.prerequisites.every((code) => {
    const prerequisite = allUnits.find((candidate) => candidate.code === code);
    if (!prerequisite) return false;
    return isUnitComplete(prerequisite, completions);
  });
}
