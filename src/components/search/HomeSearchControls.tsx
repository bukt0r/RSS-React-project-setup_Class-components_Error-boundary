'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { swapiApi, useGetPeoplePageQuery } from '@/api/swapiApi';
import { useHomeSearch } from '@/components/search/HomeSearchContext';
import ErrorSpike from '@/components/ErrorSpike';
import { useAppDispatch } from '@/store/hooks';

function HomeSearchControls() {
  const t = useTranslations('home');
  const dispatch = useAppDispatch();
  const {
    searchInput,
    committedSearch,
    currentPage,
    hasPageParam,
    handleSearchInputChange,
    handleSearchClick,
  } = useHomeSearch();
  const [simulateCrash, setSimulateCrash] = useState(false);
  const { isFetching } = useGetPeoplePageQuery(
    { searchFromInput: committedSearch, page: currentPage },
    { skip: !hasPageParam },
  );

  const handleRefreshResults = useCallback((): void => {
    dispatch(
      swapiApi.util.invalidateTags([
        { type: 'PeoplePage', id: `${committedSearch.trim()}::${currentPage}` },
      ]),
    );
  }, [committedSearch, currentPage, dispatch]);

  return (
    <>
      <section
        className="search-section"
        aria-label={t('searchSection')}
        onClick={(event) => event.stopPropagation()}
      >
        <h1>{t('title')}</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchInput}
            onChange={handleSearchInputChange}
            disabled={isFetching}
          />
          <button type="button" onClick={handleSearchClick} disabled={isFetching}>
            {t('search')}
          </button>
          <button
            type="button"
            onClick={handleRefreshResults}
            disabled={isFetching || !hasPageParam}
          >
            {t('refresh')}
          </button>
        </div>
      </section>

      <div
        className="app-test-error"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={() => setSimulateCrash(true)}>
          {t('testError')}
        </button>
      </div>

      {simulateCrash ? <ErrorSpike /> : null}
    </>
  );
}

export default HomeSearchControls;
