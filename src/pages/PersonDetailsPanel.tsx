'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSearchParams } from '../hooks/useAppSearchParams';
import { swapiApi, useGetPersonByIdQuery } from '../api/swapiApi';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import PersonImage from '../components/PersonImage';
import { useAppDispatch } from '../store/hooks';
import './PersonDetailsPanel.css';

function PersonDetailsPanel() {
  const t = useTranslations('details');
  const dispatch = useAppDispatch();
  const { searchParams, setSearchParams } = useAppSearchParams();
  const detailsId = searchParams.get('details');
  const { data: person, isFetching, isError, error } = useGetPersonByIdQuery(
    detailsId ?? '',
    { skip: !detailsId },
  );
  const fetchError = useMemo(() => {
    if (!isError) {
      return null;
    }
    return error instanceof Error ? error.message : t('loadError');
  }, [error, isError, t]);
  const isLoading = isFetching;

  const closeDetails = (): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('details');
      return next;
    });
  };

  const handleRefreshDetails = (): void => {
    if (!detailsId) {
      return;
    }
    dispatch(swapiApi.util.invalidateTags([{ type: 'Person', id: detailsId }]));
  };

  if (!detailsId) {
    return null;
  }

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
          disabled={isLoading}
        >
          {t('refresh')}
        </button>
      </div>

      <ErrorBanner message={fetchError} />

      {isLoading ? (
        <div className="person-details__loading" aria-busy="true">
          <LoadingSpinner label={t('loading')} />
        </div>
      ) : null}

      {!isLoading && person ? (
        <article className="person-details__content">
          <PersonImage
            src={person.imageUrl}
            alt={person.name}
            size={96}
            className="person-details__image"
            priority
          />
          <h3 className="person-details__name">{person.name}</h3>
          <p className="person-details__description">{person.description}</p>
        </article>
      ) : null}
    </section>
  );
}

export default PersonDetailsPanel;
