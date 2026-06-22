'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { submitSearchAction } from '@/actions/submitSearch';
import { useHomeSearch } from '@/components/search/HomeSearchContext';
import ErrorSpike from '@/components/ErrorSpike';

function SearchSubmitButton() {
  const t = useTranslations('home');
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {t('search')}
    </button>
  );
}

function HomeSearchControls() {
  const t = useTranslations('home');
  const locale = useLocale();
  const {
    searchInput,
    hasPageParam,
    handleSearchInputChange,
    handleSearchSubmit,
    triggerResultsRefresh,
  } = useHomeSearch();
  const [simulateCrash, setSimulateCrash] = useState(false);
  const [, submitSearch, isSearchPending] = useActionState(submitSearchAction, null);

  return (
    <>
      <section
        className="search-section"
        aria-label={t('searchSection')}
        onClick={(event) => event.stopPropagation()}
      >
        <h1>{t('title')}</h1>
        <form
          action={submitSearch}
          className="search-controls"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            name="search"
            placeholder={t('searchPlaceholder')}
            value={searchInput}
            onChange={handleSearchInputChange}
            disabled={isSearchPending}
          />
          <input type="hidden" name="locale" value={locale} />
          <SearchSubmitButton />
          <button
            type="button"
            onClick={() => void triggerResultsRefresh()}
            disabled={isSearchPending || !hasPageParam}
          >
            {t('refresh')}
          </button>
        </form>
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
