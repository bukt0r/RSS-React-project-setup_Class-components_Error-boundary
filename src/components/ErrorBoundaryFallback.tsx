'use client';

import { useTranslations } from 'next-intl';

interface ErrorBoundaryFallbackProps {
  message: string;
  onRetry: () => void;
}

function ErrorBoundaryFallback({
  message,
  onRetry,
}: ErrorBoundaryFallbackProps) {
  const t = useTranslations('errorBoundary');
  const displayMessage = message || t('fallback');

  return (
    <div className="error-boundary-fallback" role="alert">
      <h1 className="error-boundary-fallback__title">{t('title')}</h1>
      <p className="error-boundary-fallback__message">{displayMessage}</p>
      <button
        type="button"
        className="error-boundary-fallback__retry"
        onClick={onRetry}
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}

export default ErrorBoundaryFallback;
