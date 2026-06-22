'use client';

import { useTranslations } from 'next-intl';
import { useGetPeoplePageQuery } from '@/api/swapiApi';
import { useHomeSearch } from '@/components/search/HomeSearchContext';
import CardList from '@/components/CardList';
import ErrorBanner from '@/components/ErrorBanner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import type { PeoplePageResult } from '@/services/swapiPeople';

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
  } = useHomeSearch();

  const shouldUseServerSnapshot =
    initialData !== null &&
    committedSearch === initialSearch &&
    currentPage === initialPage;

  const {
    data: queryData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPeoplePageQuery(
    { searchFromInput: committedSearch, page: currentPage },
    { skip: !hasPageParam },
  );

  const usingServerSnapshot =
    shouldUseServerSnapshot && queryData === undefined && !isFetching;
  const peoplePageData =
    queryData ?? (shouldUseServerSnapshot ? initialData : null);
  const results = peoplePageData?.items ?? [];
  const totalPages = peoplePageData?.totalPages ?? 1;
  const isLoading = isFetching && peoplePageData === null;
  const fetchError =
    error instanceof Error
      ? error.message
      : isError
        ? t('loadError')
        : usingServerSnapshot
          ? initialFetchError
          : null;
  const hasLoadedOnce = isSuccess || isError || shouldUseServerSnapshot;
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
