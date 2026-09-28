import React from 'react';
import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CourseOverview from './CourseOverview';

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

let container: HTMLDivElement;
let root: Root;
const originalCreate = URL.createObjectURL;
const originalRevoke = URL.revokeObjectURL;

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  vi.useRealTimers();
  vi.restoreAllMocks();
  URL.createObjectURL = originalCreate;
  URL.revokeObjectURL = originalRevoke;
  document.body.innerHTML = '';
});

describe('CourseOverview pathways', () => {
  it('lists pathways and the core skillset in place of career outcomes', () => {
    act(() => root.render(<CourseOverview />));
    const text = container.textContent ?? '';
    expect(text).toContain('Pathways & skills');
    expect(text).toContain('Electrical - residential / commercial / industrial');
    expect(text).toContain('Apprentice electrician, trade assistant: basic circuits, wiring, cabling, test equipment, drawings, WHS.');
    expect(text).toContain('Electronics and assembly');
    expect(text).toContain('Telecommunications, data and AV');
    expect(text).toContain('Security and alarms');
    expect(text).toContain('Renewable energy');
    expect(text).toContain('Refrigeration / HVAC - assistant level');
    expect(text).toContain('Instrumentation, control and automation - entry');
    expect(text).toContain('Electrical wholesaling / supply');
    expect(text).toContain('Core skillset you get:');
    expect(text).toContain("Basic DC/AC circuits, Ohm's law");
    expect(text).toContain('Workplace communication and problem-solving');
    expect(text).not.toContain('Career outcomes');
    expect(text).not.toContain('Trades Assistant');
    expect(text).not.toContain('Electrotechnology Apprentice');
  });

  it('places the demand brief directly under pathways', () => {
    act(() => root.render(<CourseOverview />));
    const text = container.textContent ?? '';
    const pathways = text.indexOf('Pathways & skills');
    const demand = text.indexOf(
      'Wired for Demand: Industries, Hotspots and Progression Routes After Cert II',
    );
    const industry = text.indexOf('Industry demand');
    expect(pathways).toBeGreaterThanOrEqual(0);
    expect(demand).toBeGreaterThan(pathways);
    expect(industry).toBeGreaterThan(demand);

    expect(text).toContain('1. Where demand is strongest');
    expect(text).toContain('197,300 employed, 94% full-time, median $2,191/week.');
    expect(text).toContain('+32,000 electricians needed by 2030, +85,000 by 2050 just for net-zero');
    expect(text).toContain('General electrician -> renewables / storage / electrification');
    expect(text).toContain('HIGHEST');
    expect(text).toContain('VERY HIGH');
    expect(text).toContain('Refrigeration / HVAC electrical');
    expect(text).toContain('Data / security / AV / controls');
    expect(text).toContain('STEADY');
    expect(text).toContain('2. Geographically, 5-10-20 years');
    expect(text).toContain('NSW - Sydney/Wollongong/Newcastle/Hunter');
    expect(text).toContain('VIC - Melbourne/Geelong/Gippsland');
    expect(text).toContain('QLD - Brisbane/SE + REZs');
    expect(text).toContain('WA - Perth/Pilbara');
    expect(text).toContain("can't hire our way out");
    expect(text).toContain('SA - Adelaide/Whyalla/Port Augusta');
    expect(text).toContain('10 years to ~2036 - shift to fit-out + O&M');
    expect(text).toContain('20 years to ~2046 - maintenance + repowering');
    expect(text).toContain('3. Progressions for ambitious people');
    expect(text).toContain('Cert II > Cert III Apprenticeship is mandatory for licensed work.');
    expect(text).toContain('UEE30820 Cert III Electrotechnology Electrician -> A-Grade licence');
    expect(text).toContain('UEE40420');
    expect(text).toContain('UEE50220');
    expect(text).toContain('UEE33020');
    expect(text).toContain('UEE60220');
  });
});

describe('CourseOverview export', () => {
  it('revokes the blob URL only after the download click', () => {
    vi.useFakeTimers();
    const calls: string[] = [];
    URL.createObjectURL = vi.fn(() => {
      calls.push('create');
      return 'blob:test';
    });
    URL.revokeObjectURL = vi.fn(() => {
      calls.push('revoke');
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      calls.push('click');
    });

    act(() => root.render(<CourseOverview />));
    const exportButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Export',
    )!;
    act(() => exportButton.click());
    expect(calls).toEqual(['create', 'click']);

    act(() => vi.runAllTimers());
    expect(calls).toEqual(['create', 'click', 'revoke']);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
  });
});
