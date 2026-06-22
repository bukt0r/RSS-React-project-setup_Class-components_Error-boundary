'use client';

import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { store } from '@/store/store';

interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
