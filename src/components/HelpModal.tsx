import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  ['1', 'Dashboard'],
  ['2', 'Core / elective units'],
  ['3', 'Session log'],
  ['4', 'Course overview'],
  ['5', 'Foundational Trade Mathematics'],
  ['6', 'Scientific Notation, Prefixes & Algebra'],
  ['7', 'Geometry, Physics & Hand Tools'],
  ['8', 'Technical Documents & Blueprints'],
  ['s', 'Start or stop the study timer'],
  ['?', 'Open this help panel'],
  ['Esc', 'Close dialogs'],
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={onClose}
    >
      <div
        className="terminal-card"
        style={{ maxWidth: 480, width: '90%' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="terminal-section-title" id="help-title">
          <span className="icon">HELP</span>
          <span>Keyboard</span>
        </div>
        <ul className="terminal-list" style={{ marginLeft: 16 }}>
          {SHORTCUTS.map(([key, label]) => (
            <li key={key}>
              <span className="detail-value">
                <strong style={{ color: 'var(--text-amber)' }}>{key}</strong>
                {' — '}
                {label}
              </span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" className="terminal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
