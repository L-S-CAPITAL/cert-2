import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TopicCard from './TopicCard';
import { ALL_UNITS } from '../data/course';
import { progressStore } from '../stores/progress';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;
const unit = ALL_UNITS[0];
const topic = unit.topics[0];
const check = () => container.querySelector('.topic-check')!;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  progressStore.reset();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  progressStore.reset();
  document.body.innerHTML = '';
});

describe('TopicCard completion tick', () => {
  it('plays the tick animation only when the topic becomes complete', () => {
    act(() => root.render(<TopicCard unit={unit} topic={topic} onComplete={() => {}} onQuiz={() => {}} />));
    expect(check().textContent).toBe('[ ]');
    expect(check().classList.contains('just-completed')).toBe(false);

    act(() => progressStore.markTopicComplete(unit.id, topic.id));
    expect(check().textContent).toBe('[X]');
    expect(check().classList.contains('just-completed')).toBe(true);
  });

  it('does not animate topics that were already complete', () => {
    act(() => progressStore.markTopicComplete(unit.id, topic.id));
    act(() => root.render(<TopicCard unit={unit} topic={topic} onComplete={() => {}} onQuiz={() => {}} />));
    expect(check().classList.contains('just-completed')).toBe(false);
  });
});
