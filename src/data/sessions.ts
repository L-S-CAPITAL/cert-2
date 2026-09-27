import { SessionLog } from '../types';
import { findTopic, findUnit } from './course';

export interface SessionDescription {
  /** Unit or strand code; falls back to the stored id if it is unknown. */
  unitLabel: string;
  topicTitle: string | null;
}

/**
 * Shared by SessionLog and Dashboard (sessions and quiz results) so they
 * resolve course units and study strands the same way and show the topic
 * when there is one.
 */
export function describeSession(
  log: Pick<SessionLog, 'unitId' | 'topicId'>,
): SessionDescription {
  const unit = findUnit(log.unitId);
  const topic = log.topicId ? findTopic(log.unitId, log.topicId) : undefined;
  return {
    unitLabel: unit?.code ?? log.unitId,
    topicTitle: topic?.title ?? null,
  };
}

export function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
