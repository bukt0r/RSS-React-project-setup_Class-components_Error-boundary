import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import HomePageClient from '@/components/search/HomePageClient';
import HomePageLayout from '@/components/search/HomePageLayout';
import PersonDetailsPanelShell from '@/components/search/PersonDetailsPanelShell';
import SearchResultsSection from '@/components/search/SearchResultsSection';
import { parseHomeSearchParams } from '@/lib/searchParams/parseHomeSearchParams';
import PersonDetailsPanel from '@/pages/PersonDetailsPanel';
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
          <PersonDetailsPanel />
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
            search=""
            detailsId={parsed.detailsId}
          />
        </Suspense>
      </HomePageClient>
    </HomePageLayout>
  );
}
