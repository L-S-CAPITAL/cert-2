import React from 'react';

interface TerminalHeaderProps {
  title: string;
  code: string;
  provider: string;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  code,
  provider,
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
        <span className="logo">{'</>'}</span>
        <span className="symbol">{code}</span>
        <span className="terminal-title-text" title={`${title} | ${provider}`}>
          {title}
        </span>
        <span className="terminal-provider" style={{ color: '#7acc7a', fontSize: 10 }}>|</span>
        <span className="terminal-provider" style={{ fontSize: 10, color: 'var(--text-dim)' }}>
          {provider}
        </span>
      </div>
      <div className="terminal-controls">
        <div className="status-indicator">
          <span className="status-dot local"></span>
          <span style={{ fontSize: 10 }}>
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
