'use client';

import type { ReactNode } from 'react';
import HomeSearchControls from '@/components/search/HomeSearchControls';

interface HomePageOrchestratorProps {
  children: ReactNode;
}

function HomePageOrchestrator({ children }: HomePageOrchestratorProps) {
  return (
    <div className="home-split__main">
      <HomeSearchControls />
      {children}
    </div>
  );
}

export default HomePageOrchestrator;
