'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useHomeSearch } from '@/components/search/HomeSearchContext';
import CardList from '@/components/CardList';
import ErrorBanner from '@/components/ErrorBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import type { PeoplePageResult } from '@/services/swapiPeople';
import { loadPeoplePage, type LoadedPeoplePage } from '@/server/loadPeoplePage';

interface SearchResultsInteractiveProps {
  initialPage: number;
  initialSearch: string;
  initialDetailsId: string | null;
  initialData: PeoplePageResult | null;
  initialFetchError: string | null;
  resultsHeading?: string;
}

function SearchResultsInteractive({
  initialPage,
  initialSearch,
  initialDetailsId,
  initialData,
  initialFetchError,
  resultsHeading,
}: SearchResultsInteractiveProps) {
  const t = useTranslations('home');
  const {
    committedSearch,
    currentPage,
    detailsId,
    hasPageParam,
    handlePageChange,
    handleResultsPanelClick,
    openDetails,
    isItemChecked,
    handleToggleItemCheck,
    registerResultsRefresh,
  } = useHomeSearch();

  const shouldUseServerSnapshot =
    initialData !== null &&
    initialFetchError === null &&
    committedSearch === initialSearch &&
    currentPage === initialPage;

  const [clientResults, setClientResults] = useState<LoadedPeoplePage | null>(null);
  const queryKey = `${committedSearch}::${currentPage}`;
  const [loadedQueryKey, setLoadedQueryKey] = useState<string | null>(
    shouldUseServerSnapshot ? queryKey : null,
  );

  const resultsState = shouldUseServerSnapshot
    ? { data: initialData, error: initialFetchError }
    : clientResults ?? { data: null, error: null };

  const isLoading =
    !shouldUseServerSnapshot && hasPageParam && loadedQueryKey !== queryKey;

  const loadResults = useCallback(
    async (search: string, page: number): Promise<void> => {
      const result = await loadPeoplePage(search, page);
      setClientResults(result);
      setLoadedQueryKey(`${search}::${page}`);
    },
    [],
  );

  useEffect(() => {
    registerResultsRefresh(() => loadResults(committedSearch, currentPage));
  }, [
    committedSearch,
    currentPage,
    loadResults,
    registerResultsRefresh,
  ]);

  useEffect(() => {
    if (shouldUseServerSnapshot || !hasPageParam) {
      return;
    }

    let cancelled = false;

    void loadPeoplePage(committedSearch, currentPage).then((result) => {
      if (!cancelled) {
        setClientResults(result);
        setLoadedQueryKey(queryKey);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    committedSearch,
    currentPage,
    hasPageParam,
    shouldUseServerSnapshot,
    queryKey,
  ]);

  const results = resultsState.data?.items ?? [];
  const totalPages = resultsState.data?.totalPages ?? 1;
  const fetchError = resultsState.error;
  const hasLoadedOnce = resultsState.data !== null || resultsState.error !== null;
  const heading = resultsHeading ?? t('results');

  return (
    <section
      className="results-section"
      aria-label={t('resultsSection')}
      onClick={handleResultsPanelClick}
    >
      <h2>{heading}</h2>
      <ErrorBanner message={fetchError} />
      <div className="results-section__panel">
        {isLoading ? (
          <div
            className="results-section__overlay"
            aria-busy="true"
            aria-label={t('loadingResults')}
          >
            <LoadingSpinner label={t('loadingResults')} />
          </div>
        ) : null}
        <div className="results-section__body">
          <CardList
            items={results}
            detailsId={detailsId ?? initialDetailsId}
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
  );
}

export default SearchResultsInteractive;
