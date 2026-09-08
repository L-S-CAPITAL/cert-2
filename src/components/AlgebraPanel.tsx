import React from 'react';
import StrandPanel from './StrandPanel';
import { ALGEBRA_MODULES, ALGEBRA_UNIT } from '../data/algebra';

const AlgebraPanel: React.FC = () => (
  <StrandPanel
    title="Scientific Notation, Prefixes & Algebra"
    icon="ALG"
    intro="Eight modules in order: powers of ten, metric prefixes (M, k, m, µ), Ohm’s law transposition, solving for x, mixed formula review, timed Ohm/power sprints (under 1.5 minutes each), a physical-meaning reflection, then the Ohm’s law circle and prefix scale. Completing a module unlocks the next. This strand does not add UEE22020 points."
    modules={ALGEBRA_MODULES}
    unit={ALGEBRA_UNIT}
  />
);

export default AlgebraPanel;
