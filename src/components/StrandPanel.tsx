import React from 'react';
import { MathModule, Unit } from '../types';
import { isModuleUnlocked } from '../data/drill';
import { useProgress } from '../stores/progress';
import MathLesson from './MathLesson';
import MathDrill from './MathDrill';
import MathFlashcards from './MathFlashcards';

interface StrandPanelProps {
  title: string;
  icon: string;
  intro: string;
  modules: MathModule[];
  unit: Unit;
}

const StrandPanel: React.FC<StrandPanelProps> = ({
  title,
  icon,
  intro,
  modules,
  unit,
}) => {
  const progress = useProgress();
  const completions = progress.unitCompletions[unit.id] || {};
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const doneCount = modules.filter((module) => completions[module.id]).length;
  const active = modules.find((module) => module.id === activeId) ?? null;

  const open = (module: MathModule) => {
    if (!isModuleUnlocked(modules, module, completions)) return;
    setActiveId(module.id);
  };

  const back = () => setActiveId(null);

  if (active?.kind === 'drill') {
    return <MathDrill module={active} unit={unit} onBack={back} />;
  }
  if (active?.kind === 'flashcards') {
    return <MathFlashcards module={active} unit={unit} onBack={back} />;
  }
  if (active) {
    return <MathLesson module={active} unit={unit} onBack={back} />;
  }

  return (
    <div className="math-panel">
      <div className="terminal-section-title">
        <span className="icon">{icon}</span>
        <span>{title}</span>
        <span className="section-count">
          {doneCount} / {modules.length} complete
        </span>
      </div>
      <p className="math-lede">{intro}</p>

      <div className="terminal-list">
        {modules.map((module) => {
          const unlocked = isModuleUnlocked(modules, module, completions);
          const complete = completions[module.id] === true;
          return (
            <div
              key={module.id}
              className={`unit-item ${unlocked ? '' : 'locked'}`}
            >
              <button
                type="button"
                className="unit-header"
                onClick={() => open(module)}
                aria-disabled={!unlocked}
              >
                <div className="unit-code">
                  M{module.order} · {module.kind.toUpperCase()}
                </div>
                <div className="unit-name">{module.title}</div>
                <div className="unit-progress">
                  <span style={{ color: 'var(--text-amber)' }}>
                    {complete ? 'DONE' : unlocked ? 'OPEN' : 'LOCKED'}
                  </span>
                </div>
              </button>
              <div className="unit-detail" style={{ display: 'block' }}>
                <div className="detail-row">
                  <span className="detail-label">Focus</span>
                  <span className="detail-value">{module.summary}</span>
                </div>
                {!unlocked && (
                  <div className="detail-row">
                    <span className="detail-label">Locked</span>
                    <span className="detail-value">
                      Complete module {module.order - 1} first
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StrandPanel;
