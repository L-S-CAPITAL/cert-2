import { describe, expect, it } from 'vitest';
import css from './terminal.css?raw';
import { contrastRatio, cssVariables } from './contrast';

const TEXT = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-dim',
  'text-heading',
  'text-amber',
  'status-ok',
  'status-bad',
];
const BACKGROUNDS = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-panel', 'bg-panel-alt', 'bg-active'];

describe('contrast helpers', () => {
  it('matches known WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
    expect(contrastRatio('#fff', '#fff')).toBe(1);
  });
});

describe('dark theme text contrast (WCAG AA, 4.5:1 for normal text)', () => {
  const vars = cssVariables(css, ':root');
  for (const text of TEXT) {
    for (const bg of BACKGROUNDS) {
      it(`--${text} on --${bg}`, () => {
        expect(vars[text], text).toBeDefined();
        expect(vars[bg], bg).toBeDefined();
        expect(contrastRatio(vars[text], vars[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('body text is off-white rather than terminal green', () => {
    expect(vars['text-primary'].toLowerCase()).not.toBe('#00ff40');
    expect(contrastRatio(vars['text-primary'], vars['bg-primary'])).toBeGreaterThanOrEqual(12);
  });
});
