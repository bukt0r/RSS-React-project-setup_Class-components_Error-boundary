'use client';

import HomePageClient from '@/components/search/HomePageClient';
import HomePageLayout from '@/components/search/HomePageLayout';
import SearchResultsInteractive from '@/components/search/SearchResultsInteractive';
import PersonDetailsPanel from './PersonDetailsPanel';
import '@/App.css';

function HomePage() {
  return (
    <HomePageLayout
      isDetailsOpen={false}
      detailsPanel={
        <aside className="home-split__details">
          <PersonDetailsPanel />
        </aside>
      }
    >
      <HomePageClient initialPage={1} initialDetailsId={null}>
        <SearchResultsInteractive
          initialPage={1}
          initialSearch=""
          initialDetailsId={null}
          initialData={null}
          initialFetchError={null}
        />
      </HomePageClient>
    </HomePageLayout>
  );
}

export default HomePage;
