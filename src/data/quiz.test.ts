import { describe, expect, it } from 'vitest';
import { QuizQuestion } from '../types';
import { ALL_UNITS } from './course';
import { ELECTIVE_STUDY_SETS } from './electiveStudy';
import {
  explanationFor,
  fullRound,
  missedQuestions,
  reviewRound,
  roundScore,
  shouldRecordRound,
} from './quiz';

const qs: QuizQuestion[] = [
  { question: 'A', options: ['x', 'y'], correctAnswer: 0 },
  { question: 'B', options: ['x', 'y'], correctAnswer: 1 },
  { question: 'C', options: ['x', 'y'], correctAnswer: 1, explanation: '  Because.  ' },
];

describe('quiz rounds', () => {
  it('a full round asks every question in order and is recorded', () => {
    const round = fullRound(qs);
    expect(round).toEqual({ mode: 'full', order: [0, 1, 2] });
    expect(shouldRecordRound(round)).toBe(true);
  });

  it('finds missed (wrong or unanswered) questions and scores the round', () => {
    const round = fullRound(qs);
    const answers = { 0: 0, 1: 0 }; // B wrong, C unanswered
    expect(missedQuestions(qs, round, answers)).toEqual([1, 2]);
    expect(roundScore(qs, round, answers)).toBe(1);
  });

  it('a review round re-asks only the missed questions and is not recorded', () => {
    const review = reviewRound([1, 2]);
    expect(review).toEqual({ mode: 'review', order: [1, 2] });
    expect(shouldRecordRound(review)).toBe(false);
    expect(roundScore(qs, review, { 1: 1, 2: 0 })).toBe(1);
    expect(missedQuestions(qs, review, { 1: 1, 2: 0 })).toEqual([2]);
  });

  it('returns a trimmed explanation, or null when there is none', () => {
    expect(explanationFor(qs[2])).toBe('Because.');
    expect(explanationFor(qs[0])).toBeNull();
    expect(explanationFor({ ...qs[0], explanation: '   ' })).toBeNull();
  });
});

describe('explanations in the course data', () => {
  const unitQuestions = ALL_UNITS.flatMap((unit) =>
    unit.topics.flatMap((topic) =>
      (topic.quizQuestions ?? []).map((q) => ({ unit: unit.code, topic: topic.id, q })),
    ),
  );

  // Left without an explanation on purpose: the figures or wording could not
  // be backed up from the question itself, so the quiz shows the answer only.
  const NOT_EXPLAINED = [
    'Which international standard provides cable sizing and selection guidelines for Australia?',
    'Approximately what percentage of residential energy use is attributed to heating and cooling?',
    'What is the recommended hot water heater temperature for energy efficiency?',
  ];

  it('explains every unit quiz question except the listed ones', () => {
    const missing = unitQuestions.filter(({ q }) => !explanationFor(q)).map(({ q }) => q.question);
    expect(missing.sort()).toEqual([...NOT_EXPLAINED].sort());
  });

  it('keeps explanations to one short line', () => {
    for (const { topic, q } of unitQuestions) {
      const text = explanationFor(q);
      if (!text) continue;
      expect(text.length, `${topic}: ${q.question}`).toBeLessThanOrEqual(200);
      expect(text, topic).not.toMatch(/\n/);
    }
  });

  it('grounds every elective explanation in the official unit text it cites', () => {
    for (const set of ELECTIVE_STUDY_SETS) {
      for (const [topicId, questions] of Object.entries(set.quizzes)) {
        for (const q of questions) {
          expect(explanationFor(q), `${topicId}: ${q.question}`).toMatch(
            /^(PCs? \d|The (knowledge|performance) evidence|The knowledge and performance evidence)/,
          );
        }
      }
    }
  });
});
