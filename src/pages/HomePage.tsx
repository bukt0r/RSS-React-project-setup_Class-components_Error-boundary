import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { swapiApi, useGetPeoplePageQuery } from '../api/swapiApi';
import CardList from '../components/CardList';
import ErrorBanner from '../components/ErrorBanner';
import ErrorSpike from '../components/ErrorSpike';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { useSearchStorage } from '../hooks/useSearchStorage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSelectedItemsById } from '../store/selectedItemsSelectors';
import { toggleSelectedItem } from '../store/selectedItemsSlice';
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
  const dispatch = useAppDispatch();
  const selectedItemsById = useAppSelector(selectSelectedItemsById);
  const { readStoredSearch, saveTrimmedSearch } = useSearchStorage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => readStoredSearch() ?? '',
  );
  const [committedSearch, setCommittedSearch] = useState(
    () => readStoredSearch() ?? '',
  );
  const [simulateCrash, setSimulateCrash] = useState(false);

  const hasPageParam = Boolean(searchParams.get('page'));
  const currentPage = parsePageParam(searchParams.get('page'));
  const selectedDetailsId = searchParams.get('details');
  const isDetailsOpen = selectedDetailsId !== null;
  const {
    data: peoplePageData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPeoplePageQuery(
    { searchFromInput: committedSearch, page: currentPage },
    { skip: !hasPageParam },
  );
  const results = peoplePageData?.items ?? [];
  const totalPages = peoplePageData?.totalPages ?? 1;
  const isLoading = isFetching;
  const fetchError =
    error instanceof Error
      ? error.message
      : isError
        ? 'Unable to load data. Please try again.'
        : null;
  const hasLoadedOnce = isSuccess || isError;

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

  useEffect(() => {
    if (!searchParams.get('page')) {
      updatePageInUrl(1);
    }
  }, [searchParams, updatePageInUrl]);

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

  const handleRefreshResults = (): void => {
    dispatch(
      swapiApi.util.invalidateTags([
        { type: 'PeoplePage', id: `${committedSearch.trim()}::${currentPage}` },
      ]),
    );
  };

  const handleTestErrorClick = (): void => {
    setSimulateCrash(true);
  };

  const handleResultsPanelClick = (): void => {
    if (isDetailsOpen) {
      closeDetails();
    }
  };

  const isItemChecked = useCallback(
    (id: string): boolean => Boolean(selectedItemsById[id]),
    [selectedItemsById],
  );

  const handleToggleItemCheck = useCallback(
    (item: SearchResultItem): void => {
      dispatch(toggleSelectedItem(item));
    },
    [dispatch],
  );

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
          <button
            type="button"
            onClick={handleRefreshResults}
            disabled={isLoading || !hasPageParam}
          >
            Refresh
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
              detailsId={selectedDetailsId}
              onOpenDetails={openDetails}
              isItemChecked={isItemChecked}
              onToggleItemCheck={handleToggleItemCheck}
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
