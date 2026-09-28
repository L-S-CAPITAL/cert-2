import React from 'react';
import type { Theme } from '../stores/settings';
import BrandMark from './BrandMark';

/**
 * The app's main heading. The app is an independent study aid: it names the
 * qualification it prepares for, not any training provider.
 */
export const APP_HEADING = 'Certificate II in Electrotechnology Prep Terminal for you, by CRUCIBLE';

interface TerminalHeaderProps {
  theme?: Theme;
  onToggleTheme?: () => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  theme = 'dark',
  onToggleTheme,
}) => {
  // The live clock lives in the StatusBar; the header only shows the date,
  // so a once-a-minute refresh is enough to roll over at midnight.
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const dateStr = now.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const electronVersion = window.electrotech?.versions.electron;

  return (
    <header className="terminal-header">
      {/* The brand hexagon bookends the heading on both sides; both marks are
          aria-hidden, so screen readers read just the heading text. */}
      <h1 className="terminal-title">
        <BrandMark className="brand-mark-start" />
        <span className="terminal-title-text">{APP_HEADING}</span>
        <BrandMark className="brand-mark-end" />
      </h1>
      <div className="terminal-controls">
        {onToggleTheme && (
          <button
            type="button"
            className="terminal-btn theme-toggle"
            aria-pressed={theme === 'light'}
            aria-keyshortcuts="t"
            title="Light (paper) theme (t)"
            onClick={onToggleTheme}
          >
            <span aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>{' '}
            <span className="theme-toggle-text">Light theme</span>
          </button>
        )}
        <div className="status-indicator">
          <span className="status-dot local"></span>
          <span style={{ fontSize: 11 }}>
            {electronVersion ? `ELECTRON ${electronVersion}` : 'LOCAL'}
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {dateStr}
        </span>
      </div>
    </header>
  );
};

export default TerminalHeader;
