import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPersonById, SwapiHttpError } from '../services/swapiPeople';
import type { SearchResultItem } from '../types/item';
import './PersonDetailsPanel.css';

function PersonDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsId = searchParams.get('details');
  const isMountedRef = useRef(true);

  const [person, setPerson] = useState<SearchResultItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const closeDetails = (): void => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('details');
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!detailsId) {
      return;
    }

    const loadDetails = async (): Promise<void> => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const data = await fetchPersonById(detailsId);
        if (!isMountedRef.current) return;
        setPerson(data);
        setFetchError(null);
      } catch (error: unknown) {
        if (!isMountedRef.current) return;
        const message =
          error instanceof SwapiHttpError
            ? error.message
            : 'Unable to load details. Please try again.';
        setPerson(null);
        setFetchError(message);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    void loadDetails();
  }, [detailsId]);

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
