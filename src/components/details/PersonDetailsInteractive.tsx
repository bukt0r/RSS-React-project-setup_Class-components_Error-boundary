'use client';

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAppSearchParams } from '@/hooks/useAppSearchParams';
import ErrorBanner from '@/components/ErrorBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import PersonDetailsView from '@/components/details/PersonDetailsView';
import { loadPersonById, type LoadedPersonDetails } from '@/server/loadPersonById';
import type { SearchResultItem } from '@/types/item';
import '@/views/PersonDetailsPanel.css';

interface PersonDetailsInteractiveProps {
  detailsId: string;
  initialPerson: SearchResultItem | null;
  initialFetchError: string | null;
}

function PersonDetailsInteractive({
  detailsId,
  initialPerson,
  initialFetchError,
}: PersonDetailsInteractiveProps) {
  const t = useTranslations('details');
  const router = useRouter();
  const { setSearchParams } = useAppSearchParams();
  const shouldUseServerSnapshot = initialPerson !== null;
  const [clientState, setClientState] = useState<LoadedPersonDetails | null>(null);
  const [isClientLoading, setIsClientLoading] = useState(!shouldUseServerSnapshot);
  const [isRefreshing, startTransition] = useTransition();

  const personState = shouldUseServerSnapshot
    ? { data: initialPerson, error: initialFetchError }
    : clientState ?? { data: null, error: null };

  const loadDetails = useCallback(async (personId: string): Promise<void> => {
    setIsClientLoading(true);
    const result = await loadPersonById(personId);
    setClientState(result);
    setIsClientLoading(false);
  }, []);

  useEffect(() => {
    if (shouldUseServerSnapshot) {
      return;
    }

    let cancelled = false;

    void loadPersonById(detailsId).then((result) => {
      if (!cancelled) {
        setClientState(result);
        setIsClientLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [detailsId, shouldUseServerSnapshot]);

  const closeDetails = (): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('details');
      return next;
    });
  };

  const handleRefreshDetails = (): void => {
    startTransition(async () => {
      await loadDetails(detailsId);
      router.refresh();
    });
  };

  const isBusy = isClientLoading || isRefreshing;

  return (
    <section
      className="person-details"
      aria-label={t('itemDetails')}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="person-details__header">
        <h2 className="person-details__title">{t('title')}</h2>
        <button
          type="button"
          className="person-details__close"
          onClick={closeDetails}
          aria-label={t('closeLabel')}
        >
          {t('close')}
        </button>
        <button
          type="button"
          className="person-details__refresh"
          onClick={handleRefreshDetails}
          disabled={isBusy}
        >
          {t('refresh')}
        </button>
      </div>

      <ErrorBanner message={personState.error} />

      {isBusy ? (
        <div className="person-details__loading" aria-busy="true">
          <LoadingSpinner label={t('loading')} />
        </div>
      ) : null}

      {!isBusy && personState.data ? (
        <PersonDetailsView person={personState.data} />
      ) : null}
    </section>
  );
}

export default PersonDetailsInteractive;
