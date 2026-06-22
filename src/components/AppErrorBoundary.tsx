import { Component, Fragment, type ErrorInfo, type ReactNode } from 'react';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';
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
        <ErrorBoundaryFallback
          message={this.state.error?.message ?? ''}
          onRetry={this.handleReset}
        />
      );
    }

    return (
      <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    );
  }
}

export default AppErrorBoundary;
