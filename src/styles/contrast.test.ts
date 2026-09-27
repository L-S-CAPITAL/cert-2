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

describe('light theme text contrast (WCAG AA, 4.5:1 for normal text)', () => {
  const dark = cssVariables(css, ':root');
  const light = cssVariables(css, '[data-theme="light"]');

  it('overrides every colour token the dark theme defines', () => {
    for (const name of [...TEXT, ...BACKGROUNDS]) expect(light[name], name).toBeDefined();
  });

  for (const text of TEXT) {
    for (const bg of BACKGROUNDS) {
      it(`--${text} on --${bg}`, () => {
        expect(contrastRatio(light[text], light[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('amber buttons invert readably on hover (background ink on amber)', () => {
    expect(contrastRatio(light['bg-primary'], light['text-amber'])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(dark['bg-primary'], dark['text-amber'])).toBeGreaterThanOrEqual(4.5);
  });

  it('brand orange (graphics only) keeps 3:1 against the page in both themes', () => {
    expect(contrastRatio(dark['brand-orange'], dark['bg-secondary'])).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(light['brand-orange'], light['bg-secondary'])).toBeGreaterThanOrEqual(3);
  });
});

describe('progress bar text (drawn on top of the fill and the empty track)', () => {
  for (const [theme, selector] of [
    ['dark', ':root'],
    ['light', '[data-theme="light"]'],
  ] as const) {
    const vars = cssVariables(css, selector);
    for (const bg of ['progress-fill', 'progress-fill-end', 'progress-bg']) {
      it(`${theme}: --progress-text on --${bg} is at least 4.5:1`, () => {
        expect(vars['progress-text'], 'progress-text').toBeDefined();
        expect(vars[bg], bg).toBeDefined();
        expect(contrastRatio(vars['progress-text'], vars[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('uses a valid gradient angle for the fill', () => {
    expect(css).not.toMatch(/linear-gradient\(\s*\d+\s*,/);
    expect(css).toMatch(/\.progress-bar-fill\s*\{[^}]*linear-gradient\(90deg,/);
  });
});
