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
    { question: 'Q1', options: ['right', 'wrong'], correctAnswer: 0 },
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
