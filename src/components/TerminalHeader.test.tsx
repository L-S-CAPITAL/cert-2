import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import TerminalHeader, { APP_HEADING } from './TerminalHeader';
import { COURSE_INFO } from '../data/course';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<TerminalHeader theme="dark" onToggleTheme={() => {}} />));
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
});

describe('TerminalHeader heading', () => {
  it('reads exactly the new heading', () => {
    expect(APP_HEADING).toBe('Certificate II in Electrotechnology Prep Terminal for you, by CRUCIBLE');
    const heading = container.querySelector('h1')!;
    expect(heading.textContent).toBe(APP_HEADING);
  });

  it('bookends the heading with the same decorative brand hexagon on both sides', () => {
    const heading = container.querySelector('h1')!;
    const children = Array.from(heading.children);
    expect(children).toHaveLength(3);
    const [start, text, end] = children;
    for (const mark of [start, end]) {
      expect(mark.tagName.toLowerCase()).toBe('svg');
      expect(mark.getAttribute('aria-hidden')).toBe('true');
      expect(mark.getAttribute('focusable')).toBe('false');
      const hexagon = mark.querySelector('polygon')!;
      expect(hexagon.getAttribute('points')).toBe('498,247 569,288 569,365 498,406 427,365 427,288');
      expect(hexagon.getAttribute('stroke')).toBe('#C45E1C');
      expect(hexagon.getAttribute('stroke-width')).toBe('12');
      expect(hexagon.getAttribute('stroke-linejoin')).toBe('round');
    }
    expect(text.textContent).toBe(APP_HEADING);
    // Each mark has its own glow gradient id, so both render.
    const ids = [start, end].map((mark) => mark.querySelector('radialGradient')!.id);
    expect(new Set(ids).size).toBe(2);
    expect(start.querySelector('circle')!.getAttribute('fill')).toBe(`url(#${ids[0]})`);
  });

  it('no longer names TAFE Queensland (or any provider) anywhere in the header', () => {
    const header = container.querySelector('header')!;
    expect(header.textContent).not.toMatch(/TAFE/i);
    expect(header.textContent).not.toMatch(/Queensland/i);
    expect(header.innerHTML).not.toMatch(/TAFE/i);
    expect(COURSE_INFO).not.toHaveProperty('provider');
  });
});
