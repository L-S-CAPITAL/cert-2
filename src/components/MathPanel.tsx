import React from 'react';
import StrandPanel from './StrandPanel';
import { MATH_MODULES, MATH_UNIT } from '../data/math';

const MathPanel: React.FC = () => (
  <StrandPanel
    title="Foundational Trade Mathematics"
    icon="MATH"
    intro="Seven modules in order: fractions and decimals, mixed lengths, BODMAS, trade percentages, a 10-minute speed drill, recovery flashcards, then a study guide on eighths and order of operations. Completing a module unlocks the next. This strand does not add UEE22020 points."
    modules={MATH_MODULES}
    unit={MATH_UNIT}
  />
);

export default MathPanel;
