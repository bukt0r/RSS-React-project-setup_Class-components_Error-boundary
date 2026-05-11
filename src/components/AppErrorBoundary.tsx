import { Component, Fragment, type ErrorInfo, type ReactNode } from 'react';
import './AppErrorBoundary.css';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    error: null,
    resetKey: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo.componentStack);
  }

  handleReset = (): void => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      resetKey: prev.resetKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" role="alert">
          <h1 className="error-boundary-fallback__title">Something went wrong</h1>
          <p className="error-boundary-fallback__message">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            className="error-boundary-fallback__retry"
            onClick={this.handleReset}
          >
            Try again
          </button>
        </div>
      );
    }

    return (
      <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    );
  }
}

export default AppErrorBoundary;
