import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string | null;
}

function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="error-banner" role="alert">
      {message}
    </p>
  );
}

export default ErrorBanner;
