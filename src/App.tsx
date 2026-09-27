import React from 'react';
import { TabType } from './types';
import type { UnitFocusRequest } from './components/UnitPanel';
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
import { ALL_UNITS, COURSE_INFO, findTopic } from './data/course';
import { MATH_UNIT } from './data/math';
import { ALGEBRA_UNIT } from './data/algebra';
import { GEOMETRY_UNIT } from './data/geometry';
import { BLUEPRINT_UNIT } from './data/blueprints';
import { progressStore, useProgress } from './stores/progress';
import { isUnitUnlocked } from './data/prerequisites';
import { shouldIgnoreShortcut } from './shortcuts';

type NavGroup = 'Study' | 'Records';

/**
 * Sections in sidebar order. `key` is the number shortcut (unchanged from the
 * old tab bar so muscle memory still works); `short` is the sidebar label and
 * `label` the full panel title.
 */
export const TABS: {
  id: TabType;
  label: string;
  short: string;
  icon: string;
  group: NavGroup;
  key: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', short: 'Dashboard', icon: 'DASH', group: 'Study', key: '1' },
  { id: 'units', label: 'Units', short: 'Units', icon: 'UNITS', group: 'Study', key: '2' },
  {
    id: 'math',
    label: 'Foundational Trade Mathematics',
    short: 'Trade maths',
    icon: 'MATH',
    group: 'Study',
    key: '5',
  },
  {
    id: 'algebra',
    label: 'Scientific Notation, Prefixes & Algebra',
    short: 'Notation & algebra',
    icon: 'ALG',
    group: 'Study',
    key: '6',
  },
  {
    id: 'geometry',
    label: 'Geometry, Physics & Hand Tools',
    short: 'Geometry & tools',
    icon: 'GEO',
    group: 'Study',
    key: '7',
  },
  {
    id: 'blueprints',
    label: 'Technical Documents & Blueprints',
    short: 'Drawings',
    icon: 'DWG',
    group: 'Study',
    key: '8',
  },
  { id: 'sessions', label: 'Session Log', short: 'Session log', icon: 'LOG', group: 'Records', key: '3' },
  {
    id: 'overview',
    label: 'Course Overview',
    short: 'Course overview',
    icon: 'INFO',
    group: 'Records',
    key: '4',
  },
];

const NAV_GROUPS: NavGroup[] = ['Study', 'Records'];

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
  // Set by the Dashboard ("Continue studying", unit table rows) to open a unit
  // and optionally one of its topics in the Units tab. `key` makes repeated
  // requests for the same unit fire again.
  const [focusRequest, setFocusRequest] = React.useState<UnitFocusRequest | null>(null);
  const progress = useProgress();

  // A focus request is used once: forget it when leaving the Units tab so
  // coming back later does not jump to that unit / topic again.
  React.useEffect(() => {
    if (activeTab !== 'units') setFocusRequest(null);
  }, [activeTab]);

  React.useEffect(() => {
    const stop = () => progressStore.stopSession();
    window.addEventListener('beforeunload', stop);
    return () => window.removeEventListener('beforeunload', stop);
  }, []);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Escape always closes the help dialog (QuizModal / HelpModal also
      // handle Escape themselves), even while other shortcuts are blocked.
      if (event.key === 'Escape') {
        setHelpOpen(false);
        return;
      }
      if (shouldIgnoreShortcut(event)) return;

      if (event.key === '?') {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }
      const byKey = TABS.find((tab) => tab.key === event.key);
      if (byKey) setActiveTab(byKey.id);
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

  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  // WAI-ARIA tabs pattern, vertical (automatic activation): Down/Up move
  // between sections with wrap-around (Right/Left do the same, as they did
  // in the old horizontal tab bar), Home/End jump to the first/last section.
  // Only the active section is in the Tab order (roving tabindex).
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = TABS.findIndex((tab) => tab.id === activeTab);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (current + 1) % TABS.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (current - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = TABS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  /** Open a unit (and optionally a topic) in the Units tab. */
  const openUnit = (unitId: string, topicId: string | null = null) => {
    const unit = ALL_UNITS.find((candidate) => candidate.id === unitId);
    if (!unit) return;
    const unlocked = isUnitUnlocked(
      unit,
      ALL_UNITS,
      progressStore.getState().unitCompletions,
    );
    if (unlocked) {
      // Same effect as clicking the unit header: select it for the timer and
      // expand it. Locked units are only scrolled to (their lock notice shows).
      setSelectedUnitId(unitId);
      setExpandedUnits((prev) => ({ ...prev, [unitId]: true }));
    }
    setFocusRequest({ unitId, topicId: unlocked ? topicId : null, key: Date.now() });
    setActiveTab('units');
  };

  const renderDashboard = () => (
    <Dashboard
      units={ALL_UNITS}
      selectedUnitId={selectedUnitId}
      onOpenUnit={openUnit}
    />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'units':
        return (
          <UnitPanel
            units={ALL_UNITS}
            expandedUnits={expandedUnits}
            onToggleUnit={toggleUnit}
            onUnitSelect={setSelectedUnitId}
            selectedUnitId={selectedUnitId}
            focusRequest={focusRequest}
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
        return renderDashboard();
    }
  };

  // While the timer runs, the header shows what is actually being timed
  // (progress.activeUnitId / activeTopicId), not whatever is selected now.
  const timerRunning = progress.startTime !== null;
  const headerUnitId = timerRunning ? progress.activeUnitId : selectedUnitId;
  const headerUnit = headerUnitId
    ? TIMER_UNITS.find((u) => u.id === headerUnitId)
    : undefined;
  const headerTopic =
    timerRunning && progress.activeUnitId && progress.activeTopicId
      ? findTopic(progress.activeUnitId, progress.activeTopicId)
      : undefined;
  const headerMeta = headerUnit
    ? `${timerRunning ? 'ACTIVE' : 'SELECTED'}: ${headerUnit.code} - ${headerUnit.name}${
        headerTopic ? ` / ${headerTopic.title}` : ''
      }`
    : '';

  return (
    <div className="terminal-app">
      <TerminalHeader
        title={COURSE_INFO.title}
        code={COURSE_INFO.code}
        provider={COURSE_INFO.provider}
      />

      <div className="terminal-content">
        <nav className="sidebar" aria-label="Sections">
          <div
            className="sidebar-tabs"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Sections"
          >
            {NAV_GROUPS.map((group) => (
              <React.Fragment key={group}>
                {/* Visual group heading; each tab names its group in its
                    description instead, since a tablist may only own tabs. */}
                <div className="sidebar-group" id={`nav-group-${group}`} role="presentation" aria-hidden="true">
                  {group}
                </div>
                {TABS.map((tab, index) =>
                  tab.group !== group ? null : (
                    <button
                      key={tab.id}
                      ref={(element) => {
                        tabRefs.current[index] = element;
                      }}
                      type="button"
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                      aria-controls="main-panel"
                      aria-describedby={`nav-group-${group}`}
                      aria-keyshortcuts={tab.key}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                      title={`${tab.label} (${tab.key})`}
                      className={`tab nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                      onKeyDown={onTabKeyDown}
                    >
                      <span className="tab-icon" aria-hidden="true">
                        [{tab.icon}]
                      </span>
                      <span className="nav-label">{tab.short}</span>
                      <span className="nav-key" aria-hidden="true">
                        {tab.key}
                      </span>
                    </button>
                  ),
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>

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
            {headerUnit && (
              // One line with an ellipsis when the window is narrow; the full
              // text stays available as a tooltip.
              <span className="window-meta" title={headerMeta}>
                {headerMeta}
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
