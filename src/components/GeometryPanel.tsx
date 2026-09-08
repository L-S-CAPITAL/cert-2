import React from 'react';
import StrandPanel from './StrandPanel';
import { GEOMETRY_MODULES, GEOMETRY_UNIT } from '../data/geometry';

const GeometryPanel: React.FC = () => (
  <StrandPanel
    title="Geometry, Physics & Hand Tools"
    icon="GEO"
    intro="Eight modules in order: Pythagoras for tray diagonals, SOH CAH TOA (including the AC phase-angle picture), the water analogy for V/I/R, insulated pliers and side cutters, strippers and DMM continuity, a mixed drill, a decompress visualisation, then the study guide. Completing a module unlocks the next. This strand does not add UEE22020 points."
    modules={GEOMETRY_MODULES}
    unit={GEOMETRY_UNIT}
  />
);

export default GeometryPanel;
