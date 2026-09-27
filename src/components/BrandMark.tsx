import React from 'react';

/**
 * The hexagon from the LS CAPITAL / Crucible brand artwork (same shape as the
 * app icon in build/icon.svg), drawn in the brand orange. Decorative only.
 */
const BrandMark: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    className="brand-mark"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 2.6 L20.1 7.3 L20.1 16.7 L12 21.4 L3.9 16.7 L3.9 7.3 Z"
      fill="none"
      stroke="var(--brand-orange)"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

export default BrandMark;
