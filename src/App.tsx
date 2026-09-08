import React from 'react';
import { TabType } from './types';
import TerminalHeader from './components/TerminalHeader';
import StatusBar from './components/StatusBar';
import Dashboard from './components/Dashboard';
import UnitPanel from './components/UnitPanel';
import SessionLog from './components/SessionLog';
import CourseOverview from './components/CourseOverview';
import MathPanel from './components/MathPanel';
import AlgebraPanel from './components/AlgebraPanel';
import GeometryPanel from './components/GeometryPanel';
import BlueprintsPanel from './components/BlueprintsPanel';
import TimeTracker from './components/TimeTracker';
import HelpModal from './components/HelpModal';
import { ALL_UNITS, COURSE_INFO } from './data/course';
import { MATH_UNIT } from './data/math';
import { ALGEBRA_UNIT } from './data/algebra';
import { GEOMETRY_UNIT } from './data/geometry';
import { BLUEPRINT_UNIT } from './data/blueprints';
import { progressStore } from './stores/progress';

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'DASH' },
  { id: 'units', label: 'Units', icon: 'UNITS' },
  { id: 'sessions', label: 'Session Log', icon: 'LOG' },
  { id: 'overview', label: 'Course Overview', icon: 'INFO' },
  { id: 'math', label: 'Foundational Trade Mathematics', icon: 'MATH' },
  {
    id: 'algebra',
    label: 'Scientific Notation, Prefixes & Algebra',
    icon: 'ALG',
  },
  { id: 'geometry', label: 'Geometry, Physics & Hand Tools', icon: 'GEO' },
  { id: 'blueprints', label: 'Technical Documents & Blueprints', icon: 'DWG' },
];

const TIMER_UNITS = [
  ...ALL_UNITS,
  MATH_UNIT,
  ALGEBRA_UNIT,
  GEOMETRY_UNIT,
  BLUEPRINT_UNIT,
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('dashboard');
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = React.useState<Record<string, boolean>>({});
  const [helpOpen, setHelpOpen] = React.useState(false);

  React.useEffect(() => {
    const stop = () => progressStore.stopSession();
    window.addEventListener('beforeunload', stop);
    return () => window.removeEventListener('beforeunload', stop);
  }, []);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const inField =
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable;
      if (inField) return;

      if (event.key === '?') {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }
      if (event.key === 'Escape') {
        setHelpOpen(false);
        return;
      }
      if (event.key === '1') setActiveTab('dashboard');
      if (event.key === '2') setActiveTab('units');
      if (event.key === '3') setActiveTab('sessions');
      if (event.key === '4') setActiveTab('overview');
      if (event.key === '5') setActiveTab('math');
      if (event.key === '6') setActiveTab('algebra');
      if (event.key === '7') setActiveTab('geometry');
      if (event.key === '8') setActiveTab('blueprints');
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        const state = progressStore.getState();
        if (state.startTime !== null) {
          progressStore.stopSession();
        } else if (selectedUnitId) {
          progressStore.startSession(selectedUnitId);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedUnitId]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard units={ALL_UNITS} />;
      case 'units':
        return (
          <UnitPanel
            units={ALL_UNITS}
            expandedUnits={expandedUnits}
            onToggleUnit={toggleUnit}
            onUnitSelect={setSelectedUnitId}
            selectedUnitId={selectedUnitId}
          />
        );
      case 'sessions':
        return <SessionLog />;
      case 'overview':
        return <CourseOverview />;
      case 'math':
        return <MathPanel />;
      case 'algebra':
        return <AlgebraPanel />;
      case 'geometry':
        return <GeometryPanel />;
      case 'blueprints':
        return <BlueprintsPanel />;
      default:
        return <Dashboard units={ALL_UNITS} />;
    }
  };

  const activeUnit = selectedUnitId
    ? TIMER_UNITS.find((u) => u.id === selectedUnitId)
    : null;

  return (
    <div className="terminal-app">
      <TerminalHeader
        title={COURSE_INFO.title}
        code={COURSE_INFO.code}
        provider={COURSE_INFO.provider}
      />

      <nav className="terminal-tabs" role="tablist" aria-label="Main">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls="main-panel"
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">[{tab.icon}]</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="terminal-content">
        <main
          className="terminal-window"
          id="main-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          <div className="terminal-window-header">
            <div className="window-title">
              <span className="icon">
                {TABS.find((t) => t.id === activeTab)?.icon ?? ''}
              </span>
              {TABS.find((t) => t.id === activeTab)?.label ?? ''} PANEL
            </div>
            {activeUnit && (
              <span className="window-meta">
                ACTIVE: {activeUnit.code} - {activeUnit.name}
              </span>
            )}
          </div>
          <div className="terminal-window-body">{renderTabContent()}</div>
        </main>

        <aside
          className="terminal-window time-tracker-window"
          aria-label="Study timer"
        >
          <div className="terminal-window-header">
            <div className="window-title">
              <span className="icon">TIMER</span>
              TIMER
            </div>
          </div>
          <div className="terminal-window-body">
            <TimeTracker
              selectedUnitId={selectedUnitId}
              onUnitSelect={setSelectedUnitId}
              units={TIMER_UNITS}
            />
          </div>
        </aside>
      </div>

      <StatusBar />
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
};

export default App;
