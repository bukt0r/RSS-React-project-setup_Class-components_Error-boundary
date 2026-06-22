'use client';

import type { ReactNode } from 'react';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import ThemeProvider from '@/context/ThemeProvider';
import StoreProvider from '@/components/providers/StoreProvider';

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <AppErrorBoundary>{children}</AppErrorBoundary>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default AppProviders;
