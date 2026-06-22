'use client';

import { useMemo } from 'react';
import { useAppSearchParams } from '../hooks/useAppSearchParams';
import { swapiApi, useGetPersonByIdQuery } from '../api/swapiApi';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppDispatch } from '../store/hooks';
import './PersonDetailsPanel.css';

function PersonDetailsPanel() {
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
    return error instanceof Error
      ? error.message
      : 'Unable to load details. Please try again.';
  }, [error, isError]);
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
      aria-label="Item details"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="person-details__header">
        <h2 className="person-details__title">Details</h2>
        <button
          type="button"
          className="person-details__close"
          onClick={closeDetails}
          aria-label="Close details"
        >
          Close
        </button>
        <button
          type="button"
          className="person-details__refresh"
          onClick={handleRefreshDetails}
          disabled={isLoading}
        >
          Refresh
        </button>
      </div>

      <ErrorBanner message={fetchError} />

      {isLoading ? (
        <div className="person-details__loading" aria-busy="true">
          <LoadingSpinner label="Loading details" />
        </div>
      ) : null}

      {!isLoading && person ? (
        <article className="person-details__content">
          <h3 className="person-details__name">{person.name}</h3>
          <p className="person-details__description">{person.description}</p>
        </article>
      ) : null}
    </section>
  );
}

export default PersonDetailsPanel;
