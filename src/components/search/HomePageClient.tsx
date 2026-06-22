'use client';

import { useCallback, type ReactNode } from 'react';
import HomePageOrchestrator from '@/components/search/HomePageOrchestrator';
import {
  HomeSearchProvider,
} from '@/components/search/HomeSearchContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedItemsById } from '@/store/selectedItemsSelectors';
import { toggleSelectedItem } from '@/store/selectedItemsSlice';
import type { SearchResultItem } from '@/types/item';

interface HomePageClientProps {
  children: ReactNode;
  initialPage: number;
  initialDetailsId: string | null;
}

function HomePageClient({
  children,
  initialPage,
  initialDetailsId,
}: HomePageClientProps) {
  const dispatch = useAppDispatch();
  const selectedItemsById = useAppSelector(selectSelectedItemsById);

  const isItemChecked = useCallback(
    (id: string): boolean => Boolean(selectedItemsById[id]),
    [selectedItemsById],
  );

  const handleToggleItemCheck = useCallback(
    (item: SearchResultItem): void => {
      dispatch(toggleSelectedItem(item));
    },
    [dispatch],
  );

  return (
    <HomeSearchProvider
      initialPage={initialPage}
      initialDetailsId={initialDetailsId}
      isItemChecked={isItemChecked}
      onToggleItemCheck={handleToggleItemCheck}
    >
      <HomePageOrchestrator>{children}</HomePageOrchestrator>
    </HomeSearchProvider>
  );
}

export default HomePageClient;
