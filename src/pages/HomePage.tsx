import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import CardList from '../components/CardList';
import ErrorBanner from '../components/ErrorBanner';
import ErrorSpike from '../components/ErrorSpike';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { useSearchStorage } from '../hooks/useSearchStorage';
import { fetchPeoplePage, SwapiHttpError } from '../services/swapiPeople';
import type { SearchResultItem } from '../types/item';
import '../App.css';

function parsePageParam(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function HomePage() {
  const { readStoredSearch, saveTrimmedSearch } = useSearchStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMountedRef = useRef(true);

  const [searchInput, setSearchInput] = useState(
    () => readStoredSearch() ?? '',
  );
  const [committedSearch, setCommittedSearch] = useState(
    () => readStoredSearch() ?? '',
  );
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [simulateCrash, setSimulateCrash] = useState(false);

  const currentPage = parsePageParam(searchParams.get('page'));
  const selectedDetailsId = searchParams.get('details');
  const isDetailsOpen = selectedDetailsId !== null;

  const closeDetails = useCallback((): void => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('details');
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const openDetails = useCallback(
    (id: string): void => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('details', id);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const updatePageInUrl = useCallback(
    (page: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(page));
          next.delete('details');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const fetchResults = useCallback(
    async (query: string, page: number) => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const data = await fetchPeoplePage(query, page);
        if (!isMountedRef.current) return;
        setResults(data.items);
        setTotalPages(data.totalPages);
        setFetchError(null);
        setHasLoadedOnce(true);
      } catch (error: unknown) {
        if (!isMountedRef.current) return;
        const message =
          error instanceof SwapiHttpError
            ? error.message
            : 'Unable to load data. Please try again.';
        setResults([]);
        setFetchError(message);
        setHasLoadedOnce(true);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!searchParams.get('page')) {
      updatePageInUrl(1);
    }
  }, [searchParams, updatePageInUrl]);

  useEffect(() => {
    if (!searchParams.get('page')) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch when URL page or query changes
    void fetchResults(committedSearch, currentPage);
  }, [committedSearch, currentPage, fetchResults, searchParams]);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);

    if (isDetailsOpen) {
      closeDetails();
    }

    if (currentPage !== 1) {
      updatePageInUrl(1);
    }
  };

  const handleSearchClick = (): void => {
    const trimmed = searchInput.trim();

    if (currentPage !== 1) {
      updatePageInUrl(1);
    } else if (isDetailsOpen) {
      closeDetails();
    }

    if (trimmed === committedSearch && currentPage === 1 && !isDetailsOpen) {
      return;
    }

    setCommittedSearch(trimmed);
    saveTrimmedSearch(trimmed);
  };

  const handlePageChange = (page: number): void => {
    updatePageInUrl(page);
  };

  const handleTestErrorClick = (): void => {
    setSimulateCrash(true);
  };

  const handleResultsPanelClick = (): void => {
    if (isDetailsOpen) {
      closeDetails();
    }
  };

  return (
    <main
      className={`app-layout home-split ${isDetailsOpen ? 'home-split--open' : ''}`}
    >
      <div className="home-split__main">
      <section
        className="search-section"
        aria-label="Search section"
        onClick={(event) => event.stopPropagation()}
      >
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

      <section
        className="results-section"
        aria-label="Results section"
        onClick={handleResultsPanelClick}
      >
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
            <CardList
              items={results}
              selectedId={selectedDetailsId}
              onItemSelect={openDetails}
            />
          </div>
        </div>
        {hasLoadedOnce && !isLoading ? (
          <div onClick={(event) => event.stopPropagation()}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </section>

      <div
        className="app-test-error"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={handleTestErrorClick}>
          Test error
        </button>
      </div>

      {simulateCrash ? <ErrorSpike /> : null}
      </div>

      <aside className="home-split__details">
        <Outlet />
      </aside>
    </main>
  );
}

export default HomePage;
