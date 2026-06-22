import type { ReactNode } from 'react';

interface HomePageLayoutProps {
  isDetailsOpen: boolean;
  children: ReactNode;
  detailsPanel: ReactNode;
}

function HomePageLayout({
  isDetailsOpen,
  children,
  detailsPanel,
}: HomePageLayoutProps) {
  return (
    <main
      className={`app-layout home-split ${isDetailsOpen ? 'home-split--open' : ''}`}
    >
      {children}
      {detailsPanel}
    </main>
  );
}

export default HomePageLayout;
