import React from 'react';

interface ErrorBoundaryState {
  message: string | null;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { message: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { message: error.message || 'Unexpected renderer error' };
  }

  render() {
    if (!this.state.message) return this.props.children;

    return (
      <div className="empty-state" role="alert">
        <div className="empty-icon">[ ERROR ]</div>
        <div>{this.state.message}</div>
        <button
          type="button"
          className="terminal-btn amber"
          style={{ marginTop: 12 }}
          onClick={() => this.setState({ message: null })}
        >
          Retry
        </button>
      </div>
    );
  }
}
