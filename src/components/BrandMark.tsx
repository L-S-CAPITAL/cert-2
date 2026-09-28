import React from 'react';

/**
 * The hexagon from the LS CAPITAL / Crucible brand artwork: the same outline
 * (points, 12-unit stroke, round joins, brand orange #C45E1C) and soft radial
 * glow as the source artwork, which build/icon.svg also recreates. The
 * viewBox is a square crop around the artwork's hexagon, so the geometry is
 * used as-is. Decorative only: hidden from screen readers.
 *
 * Sized in em by default so it matches the height of the text next to it.
 */
const HEXAGON_POINTS = '498,247 569,288 569,365 498,406 427,365 427,288';

const BrandMark: React.FC<{ size?: number | string; className?: string }> = ({
  size = '1.45em',
  className,
}) => {
  // Two marks can be on screen at once, so each needs its own gradient id.
  const glowId = `brand-glow-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      className={`brand-mark${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="408 236.5 180 180"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={glowId} cx="498" cy="326.5" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: '#C45E1C', stopOpacity: 'var(--brand-glow-opacity)' }} />
          <stop offset="0.5" style={{ stopColor: '#C45E1C', stopOpacity: 'calc(var(--brand-glow-opacity) * 0.35)' }} />
          <stop offset="1" style={{ stopColor: '#C45E1C', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="498" cy="326.5" r="90" fill={`url(#${glowId})`} />
      <polygon
        points={HEXAGON_POINTS}
        fill="none"
        stroke="#C45E1C"
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrandMark;
