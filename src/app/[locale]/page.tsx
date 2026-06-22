import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import PersonDetailsSection from '@/components/details/PersonDetailsSection';
import HomePageClient from '@/components/search/HomePageClient';
import HomePageLayout from '@/components/search/HomePageLayout';
import PersonDetailsPanelShell from '@/components/search/PersonDetailsPanelShell';
import SearchResultsSection from '@/components/search/SearchResultsSection';
import { parseHomeSearchParams } from '@/lib/searchParams/parseHomeSearchParams';
import '@/App.css';

export default async function HomeRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const parsed = parseHomeSearchParams(await searchParams);

  return (
    <HomePageLayout
      isDetailsOpen={parsed.isDetailsOpen}
      detailsPanel={
        <PersonDetailsPanelShell>
          <Suspense fallback={null}>
            <PersonDetailsSection detailsId={parsed.detailsId} />
          </Suspense>
        </PersonDetailsPanelShell>
      }
    >
      <HomePageClient
        initialPage={parsed.currentPage}
        initialDetailsId={parsed.detailsId}
      >
        <Suspense fallback={null}>
          <SearchResultsSection
            page={parsed.currentPage}
            search={parsed.searchQuery}
            detailsId={parsed.detailsId}
          />
        </Suspense>
      </HomePageClient>
    </HomePageLayout>
  );
}
