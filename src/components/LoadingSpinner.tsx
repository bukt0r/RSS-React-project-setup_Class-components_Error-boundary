import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner__ring" aria-hidden />
      <span className="loading-spinner__label">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
