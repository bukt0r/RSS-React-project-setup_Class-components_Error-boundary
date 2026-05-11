import { Component } from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  label?: string;
}

class LoadingSpinner extends Component<LoadingSpinnerProps> {
  render() {
    const label = this.props.label ?? 'Loading';

    return (
      <div className="loading-spinner" role="status" aria-live="polite">
        <span className="loading-spinner__ring" aria-hidden />
        <span className="loading-spinner__label">{label}</span>
      </div>
    );
  }
}

export default LoadingSpinner;
