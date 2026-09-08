import React from 'react';
import StrandPanel from './StrandPanel';
import { BLUEPRINT_MODULES, BLUEPRINT_UNIT } from '../data/blueprints';

const BlueprintsPanel: React.FC = () => (
  <StrandPanel
    title="Technical Documents & Blueprints"
    icon="DWG"
    intro="Eight modules in order: series vs parallel schematics, residential plans (SA, G2, S, lights, scale), commercial SLDs from the main board down, off-sheet connectors, circuit-schedule decoding, a symbols-and-codes drill, a walk-your-home reflection, then the study guide. Completing a module unlocks the next. This strand does not add UEE22020 points."
    modules={BLUEPRINT_MODULES}
    unit={BLUEPRINT_UNIT}
  />
);

export default BlueprintsPanel;
