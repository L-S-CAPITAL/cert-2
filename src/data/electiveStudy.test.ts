import { describe, expect, it } from 'vitest';
import { ALL_UNITS } from './course';
import { ELECTIVE_STUDY_SETS } from './electiveStudy';

// Text written from the official unit pages must not invent numbers or cite
// standards the units do not name. Unit codes are the only digits allowed.
const stripCodes = (text: string) => text.replace(/\bUE[A-Z]{2,3}\d{4}\b/g, '');

describe('elective quizzes and flashcards (UEECD0008, UEECD0019, UEECD0035)', () => {
  it('covers exactly the three new electives, each with its official source URL', () => {
    expect(ELECTIVE_STUDY_SETS.map((set) => set.code)).toEqual(['UEECD0008', 'UEECD0019', 'UEECD0035']);
    for (const set of ELECTIVE_STUDY_SETS) {
      const unit = ALL_UNITS.find((u) => u.id === set.unitId)!;
      expect(unit.code).toBe(set.code);
      expect(set.sourceUrl).toBe(`https://training.gov.au/Training/Details/${set.code}`);
      expect(unit.sourceUrl).toBe(set.sourceUrl);
      expect(set.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  for (const set of ELECTIVE_STUDY_SETS) {
    describe(set.code, () => {
      const unit = ALL_UNITS.find((u) => u.id === set.unitId)!;

      it('has a quiz for every topic, and no quizzes for topics that do not exist', () => {
        const topicIds = unit.topics.map((t) => t.id);
        expect(Object.keys(set.quizzes).sort()).toEqual([...topicIds].sort());
        for (const topic of unit.topics) {
          expect(topic.quizQuestions, topic.id).toBe(set.quizzes[topic.id]);
          expect(topic.quizQuestions!.length, topic.id).toBeGreaterThanOrEqual(4);
        }
      });

      it('has unique topic ids and unique questions', () => {
        const topicIds = unit.topics.map((t) => t.id);
        expect(new Set(topicIds).size).toBe(topicIds.length);
        const questions = Object.values(set.quizzes).flat().map((q) => q.question);
        expect(new Set(questions).size).toBe(questions.length);
      });

      it('has four distinct, non-empty options and a valid answer index per question', () => {
        for (const [topicId, questions] of Object.entries(set.quizzes)) {
          for (const q of questions) {
            const where = `${topicId}: ${q.question}`;
            expect(q.question.trim().length, where).toBeGreaterThan(0);
            expect(q.options, where).toHaveLength(4);
            expect(new Set(q.options).size, where).toBe(4);
            for (const option of q.options) expect(option.trim().length, where).toBeGreaterThan(0);
            expect(Number.isInteger(q.correctAnswer), where).toBe(true);
            expect(q.correctAnswer, where).toBeGreaterThanOrEqual(0);
            expect(q.correctAnswer, where).toBeLessThan(q.options.length);
          }
        }
      });

      it('does not always put the right answer in the same position', () => {
        const positions = new Set(Object.values(set.quizzes).flat().map((q) => q.correctAnswer));
        expect(positions.size).toBeGreaterThan(2);
      });

      it('has flashcards with a unique, non-empty front and back', () => {
        expect(set.flashcards.length).toBeGreaterThanOrEqual(8);
        const fronts = set.flashcards.map((card) => card.front);
        expect(new Set(fronts).size).toBe(fronts.length);
        for (const card of set.flashcards) {
          expect(card.front.trim().length).toBeGreaterThan(0);
          expect(card.back.trim().length).toBeGreaterThan(0);
        }
        expect(unit.flashcards).toBe(set.flashcards);
      });

      it('invents no numeric values or standards references', () => {
        const text = [
          ...Object.values(set.quizzes).flat().flatMap((q) => [q.question, ...q.options]),
          ...set.flashcards.flatMap((card) => [card.front, card.back]),
        ];
        for (const line of text) {
          expect(stripCodes(line), line).not.toMatch(/\d/);
          expect(line, line).not.toMatch(/AS\/NZS|clause/i);
        }
      });
    });
  }
});
