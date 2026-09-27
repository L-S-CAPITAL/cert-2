import React from 'react';
import type { Theme } from '../stores/settings';
import BrandMark from './BrandMark';

interface TerminalHeaderProps {
  title: string;
  code: string;
  provider: string;
  theme?: Theme;
  onToggleTheme?: () => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  code,
  provider,
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
      <div className="terminal-title">
        <span className="logo" aria-hidden="true">
          <BrandMark size={20} />
        </span>
        <span className="symbol">{code}</span>
        <span className="terminal-title-text" title={`${title} | ${provider}`}>
          {title}
        </span>
        <span className="terminal-provider" style={{ color: 'var(--text-dim)', fontSize: 11 }}>|</span>
        <span className="terminal-provider" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          {provider}
        </span>
      </div>
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
