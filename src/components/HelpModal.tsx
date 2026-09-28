import React from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';

interface HelpModalProps {
  onClose: () => void;
}

type HelpSection = { title: string; keys: Array<[string, string]>; columns?: boolean };

const SECTIONS: HelpSection[] = [
  {
    title: 'Go to a section',
    columns: true,
    keys: [
      ['1', 'Dashboard'],
      ['2', 'Units'],
      ['3', 'Session log'],
      ['4', 'Course overview'],
      ['9', 'PROGRESS'],
      ['5', 'Trade maths'],
      ['6', 'Notation & algebra'],
      ['7', 'Geometry & tools'],
      ['8', 'Drawings'],
    ],
  },
  {
    title: 'Anywhere',
    keys: [
      ['↑ / ↓', 'Previous / next section (when the sidebar has focus)'],
      ['s', 'Start or stop the study timer'],
      ['t', 'Switch between the dark and light (paper) theme'],
      ['?', 'Open this help panel'],
      ['Esc', 'Close dialogs'],
    ],
  },
  {
    title: 'In a quiz',
    keys: [
      ['1 – 4', 'Pick answer A – D'],
      ['Enter', 'Next question / finish (focus moves to Next after you answer)'],
    ],
  },
  {
    title: 'Flashcards',
    keys: [
      ['Space / Enter', 'Flip the card'],
      ['← / →', 'Previous / next card (when the deck has focus)'],
    ],
  },
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  // Focus the dialog itself so its title is announced, trap Tab inside it,
  // close on Escape and hand focus back to the opener on close.
  useDialogFocus(dialogRef, onClose, { initialFocus: 'dialog' });

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      tabIndex={-1}
      ref={dialogRef}
      onClick={onClose}
    >
      <div
        className="terminal-card"
        style={{ maxWidth: 520, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="terminal-section-title" id="help-title">
          <span className="icon">HELP</span>
          <span>Keyboard</span>
        </div>
        {SECTIONS.map((section) => (
          <section key={section.title} className="help-section">
            <h3 className="help-section-title">{section.title}</h3>
            <ul
              className={`terminal-list help-list${section.columns ? ' help-list-columns' : ''}`}
              style={{ marginLeft: 16 }}
            >
              {section.keys.map(([key, label]) => (
                <li key={key}>
                  <span className="detail-value">
                    <kbd className="help-key">{key}</kbd>
                    {' — '}
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
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
