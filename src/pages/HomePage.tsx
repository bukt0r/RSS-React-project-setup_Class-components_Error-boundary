import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import CardList from '../components/CardList';
import ErrorBanner from '../components/ErrorBanner';
import ErrorSpike from '../components/ErrorSpike';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSearchStorage } from '../hooks/useSearchStorage';
import { fetchFirstPagePeople, SwapiHttpError } from '../services/swapiPeople';
import type { SearchResultItem } from '../types/item';
import '../App.css';

function HomePage() {
  const { readStoredSearch, saveTrimmedSearch } = useSearchStorage();
  const isMountedRef = useRef(true);
  const lastFetchedTrimmedQueryRef = useRef<string | null>(null);

  const [searchInput, setSearchInput] = useState(
    () => readStoredSearch() ?? '',
  );
  const initialSearchInputRef = useRef(searchInput);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [simulateCrash, setSimulateCrash] = useState(false);

  const loadInitialPage = useCallback(async (searchInputForRequest: string) => {
    const trimmed = searchInputForRequest.trim();

    try {
      const items = await fetchFirstPagePeople(searchInputForRequest);
      if (!isMountedRef.current) return;
      lastFetchedTrimmedQueryRef.current = trimmed;
      setResults(items);
      setFetchError(null);
    } catch (error: unknown) {
      if (!isMountedRef.current) return;
      const message =
        error instanceof SwapiHttpError
          ? error.message
          : 'Unable to load data. Please try again.';
      setResults([]);
      setFetchError(message);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const submitSearch = useCallback(
    async (trimmed: string) => {
      try {
        const items = await fetchFirstPagePeople(trimmed);
        if (!isMountedRef.current) return;
        lastFetchedTrimmedQueryRef.current = trimmed;
        saveTrimmedSearch(trimmed);
        setResults(items);
        setSearchInput(trimmed);
        setFetchError(null);
      } catch (error: unknown) {
        if (!isMountedRef.current) return;
        const message =
          error instanceof SwapiHttpError
            ? error.message
            : 'Unable to load data. Please try again.';
        setResults([]);
        setFetchError(message);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [saveTrimmedSearch],
  );

  useEffect(() => {
    isMountedRef.current = true;
    void loadInitialPage(initialSearchInputRef.current);

    return () => {
      isMountedRef.current = false;
    };
  }, [loadInitialPage]);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = (): void => {
    const trimmed = searchInput.trim();

    if (trimmed === lastFetchedTrimmedQueryRef.current) {
      return;
    }

    void submitSearch(trimmed);
  };

  const handleTestErrorClick = (): void => {
    setSimulateCrash(true);
  };

  return (
    <main className="app-layout">
      <section className="search-section" aria-label="Search section">
        <h1>Item Search</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Enter item name"
            value={searchInput}
            onChange={handleSearchInputChange}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={isLoading}
          >
            Search
          </button>
        </div>
      </section>

      <section className="results-section" aria-label="Results section">
        <h2>Results</h2>
        <ErrorBanner message={fetchError} />
        <div className="results-section__panel">
          {isLoading ? (
            <div
              className="results-section__overlay"
              aria-busy="true"
              aria-label="Loading results"
            >
              <LoadingSpinner label="Loading results" />
            </div>
          ) : null}
          <div className="results-section__body">
            <CardList items={results} />
          </div>
        </div>
      </section>

      <div className="app-test-error">
        <button type="button" onClick={handleTestErrorClick}>
          Test error
        </button>
      </div>

      {simulateCrash ? <ErrorSpike /> : null}
    </main>
  );
}

export default HomePage;
