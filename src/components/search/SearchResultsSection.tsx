import { getTranslations } from 'next-intl/server';
import SearchResultsInteractive from '@/components/search/SearchResultsInteractive';
import { loadPeoplePage } from '@/server/loadPeoplePage';

interface SearchResultsSectionProps {
  page: number;
  search: string;
  detailsId: string | null;
}

async function SearchResultsSection({
  page,
  search,
  detailsId,
}: SearchResultsSectionProps) {
  const t = await getTranslations('home');
  const { data, error } = await loadPeoplePage(search, page);

  return (
    <SearchResultsInteractive
      initialPage={page}
      initialSearch={search}
      initialDetailsId={detailsId}
      initialData={data}
      initialFetchError={error}
      resultsHeading={t('results')}
    />
  );
}

export default SearchResultsSection;
