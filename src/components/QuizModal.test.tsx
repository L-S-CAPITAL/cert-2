import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import QuizModal from './QuizModal';
import { progressStore } from '../stores/progress';
import { Topic, Unit } from '../types';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

const topic: Topic = {
  id: 'u1-t1',
  title: 'Ohm basics',
  content: '',
  keyPoints: [],
  quizQuestions: [
    {
      question: 'Q1',
      options: ['right', 'wrong'],
      correctAnswer: 0,
      explanation: 'Ohm says so.',
    },
    { question: 'Q2', options: ['wrong', 'right'], correctAnswer: 1 },
  ],
};
const unit: Unit = {
  id: 'u1',
  code: 'TEST0001',
  name: 'Test unit',
  description: '',
  prerequisites: [],
  points: 0,
  topics: [topic],
};

let container: HTMLDivElement;
let root: Root;

const button = (text: string) =>
  Array.from(container.querySelectorAll('button')).find((b) => b.textContent?.includes(text))!;

/** Answer each question with the option whose text is given, then Finish. */
const sit = (answers: string[]) => {
  answers.forEach((answer, index) => {
    act(() => button(answer).click());
    act(() => button(index === answers.length - 1 ? 'Finish' : 'Next').click());
  });
};

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  progressStore.reset();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<QuizModal unit={unit} topic={topic} onClose={() => {}} />));
});

afterEach(() => {
  act(() => root.unmount());
  progressStore.reset();
  document.body.innerHTML = '';
});

describe('QuizModal attempt history', () => {
  it('saves every finished attempt, perfect or not', () => {
    sit(['right', 'wrong']);
    expect(progressStore.getState().quizAttempts).toHaveLength(1);
    expect(progressStore.getState().quizAttempts[0]).toMatchObject({
      unitId: 'u1',
      topicId: 'u1-t1',
      score: 1,
      total: 2,
    });
    expect(progressStore.isTopicComplete('u1', 'u1-t1')).toBe(false);

    act(() => button('Retry').click());
    sit(['right', 'right']);
    const attempts = progressStore.getState().quizAttempts;
    expect(attempts.map((a) => a.score)).toEqual([2, 1]);
    expect(progressStore.isTopicComplete('u1', 'u1-t1')).toBe(true);
  });

  it('does not save a quiz that was cancelled part-way', () => {
    act(() => button('right').click());
    act(() => button('Cancel').click());
    expect(progressStore.getState().quizAttempts).toHaveLength(0);
  });
});

describe('QuizModal feedback', () => {
  const feedback = () => container.querySelector('[role="status"].quiz-feedback')!;

  it('shows correct with the explanation, marked by text and a tick, not colour alone', () => {
    expect(feedback().textContent).toBe('');
    act(() => button('right').click());
    expect(feedback().textContent).toContain('Correct.');
    expect(feedback().textContent).toContain('Ohm says so.');
    const chosen = container.querySelector('.quiz-option.is-correct')!;
    expect(chosen.textContent).toContain('✓');
    expect(chosen.textContent).toContain('(correct answer)');
    // Focus moves to Next so Enter continues.
    expect(document.activeElement?.textContent).toBe('Next');
  });

  it('shows incorrect with the right answer; with no explanation only the answer is shown', () => {
    act(() => button('right').click());
    act(() => button('Next').click());
    act(() => button('wrong').click());
    expect(feedback().textContent).toBe('✗ Incorrect. The answer is B: right');
    expect(container.querySelector('.quiz-explanation')).toBeNull();
    expect(container.querySelector('.quiz-option.is-wrong')?.textContent).toContain('(your answer)');
    expect(container.querySelector('.quiz-option.is-correct')?.textContent).toContain('right');
  });
});

describe('QuizModal review mode', () => {
  it('re-asks only missed questions and does not save the review round', () => {
    sit(['right', 'wrong']);
    expect(container.textContent).toContain('1 / 2');
    expect(progressStore.getState().quizAttempts).toHaveLength(1);

    act(() => button('Review mistakes (1)').click());
    expect(container.textContent).toContain('Review Q 1 / 1');
    expect(container.querySelector('.quiz-question')?.textContent).toBe('Q2');
    act(() => button('right').click());
    act(() => button('Finish').click());

    expect(container.textContent).toContain('All missed questions answered correctly');
    expect(container.textContent).toContain('not saved to your quiz history');
    // Still only the one full attempt; the review did not add a 1/1.
    expect(progressStore.getState().quizAttempts).toHaveLength(1);
    expect(progressStore.getState().quizAttempts[0]).toMatchObject({ score: 1, total: 2 });
    // A review alone does not mark the topic complete: that needs a full perfect run.
    expect(progressStore.isTopicComplete('u1', 'u1-t1')).toBe(false);
    expect(button('Review mistakes')).toBeUndefined();

    act(() => button('Retake full quiz').click());
    sit(['right', 'right']);
    expect(progressStore.getState().quizAttempts.map((a) => a.score)).toEqual([2, 1]);
    expect(progressStore.isTopicComplete('u1', 'u1-t1')).toBe(true);
  });

  it('offers no review after a perfect score', () => {
    sit(['right', 'right']);
    expect(container.textContent).toContain('Perfect score');
    expect(button('Review mistakes')).toBeUndefined();
  });
});

describe('QuizModal number keys', () => {
  const dialog = () => container.querySelector('[role="dialog"]')!;
  const keydown = (key: string) =>
    act(() => {
      dialog().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    });

  it('answers with 1-4 and ignores keys once answered or out of range', () => {
    keydown('3'); // only two options
    expect(container.querySelector('.quiz-feedback')?.textContent).toBe('');
    keydown('2');
    expect(container.querySelector('.quiz-feedback')?.textContent).toContain('Incorrect');
    keydown('1');
    expect(container.querySelector('.quiz-option.is-wrong')?.textContent).toContain('wrong');
    expect(container.querySelectorAll('.quiz-option')[0].getAttribute('aria-keyshortcuts')).toBe('1');
    expect(container.textContent).toContain('Keys 1–2 answer');
  });
});
