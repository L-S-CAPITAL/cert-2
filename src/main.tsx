import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/terminal.css';
import { applyTheme, loadSettings, resolveTheme, systemPrefersLight } from './stores/settings';

// Set the theme before the first render so a light-theme user does not see
// a flash of the dark theme. App keeps it in sync afterwards.
applyTheme(resolveTheme(loadSettings().theme, systemPrefersLight()));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
