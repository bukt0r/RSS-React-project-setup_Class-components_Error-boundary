'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useAppSearchParams } from '@/hooks/useAppSearchParams';
import { useSearchStorage } from '@/hooks/useSearchStorage';
import { parsePageParam } from '@/lib/searchParams/parseHomeSearchParams';
import type { SearchResultItem } from '@/types/item';

interface HomeSearchContextValue {
  searchInput: string;
  committedSearch: string;
  currentPage: number;
  detailsId: string | null;
  isDetailsOpen: boolean;
  hasPageParam: boolean;
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
  handlePageChange: (page: number) => void;
  handleResultsPanelClick: () => void;
  openDetails: (id: string) => void;
  closeDetails: () => void;
  isItemChecked: (id: string) => boolean;
  handleToggleItemCheck: (item: SearchResultItem) => void;
}

const HomeSearchContext = createContext<HomeSearchContextValue | null>(null);

interface HomeSearchProviderProps {
  children: ReactNode;
  initialPage: number;
  initialDetailsId: string | null;
  isItemChecked: (id: string) => boolean;
  onToggleItemCheck: (item: SearchResultItem) => void;
}

export function HomeSearchProvider({
  children,
  initialPage,
  initialDetailsId,
  isItemChecked,
  onToggleItemCheck,
}: HomeSearchProviderProps) {
  const { readStoredSearch, saveTrimmedSearch } = useSearchStorage();
  const { searchParams, setSearchParams } = useAppSearchParams();
  const [searchInput, setSearchInput] = useState(() => readStoredSearch() ?? '');
  const [committedSearch, setCommittedSearch] = useState(
    () => readStoredSearch() ?? '',
  );

  const hasPageParam = Boolean(searchParams.get('page'));
  const currentPage = parsePageParam(searchParams.get('page') ?? String(initialPage));
  const detailsId = searchParams.get('details') ?? initialDetailsId;
  const isDetailsOpen = detailsId !== null;

  const closeDetails = useCallback((): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('details');
      return next;
    });
  }, [setSearchParams]);

  const openDetails = useCallback(
    (id: string): void => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('details', id);
        return next;
      });
    },
    [setSearchParams],
  );

  const updatePageInUrl = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(page));
        next.delete('details');
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (!searchParams.get('page')) {
      updatePageInUrl(initialPage);
    }
  }, [initialPage, searchParams, updatePageInUrl]);

  const handleSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const nextValue = event.target.value;
      setSearchInput(nextValue);

      if (isDetailsOpen) {
        closeDetails();
      }

      if (currentPage !== 1) {
        updatePageInUrl(1);
      }
    },
    [closeDetails, currentPage, isDetailsOpen, updatePageInUrl],
  );

  const handleSearchClick = useCallback((): void => {
    const trimmed = searchInput.trim();

    if (currentPage !== 1) {
      updatePageInUrl(1);
    } else if (isDetailsOpen) {
      closeDetails();
    }

    if (trimmed === committedSearch && currentPage === 1 && !isDetailsOpen) {
      return;
    }

    setCommittedSearch(trimmed);
    saveTrimmedSearch(trimmed);
  }, [
    closeDetails,
    committedSearch,
    currentPage,
    isDetailsOpen,
    saveTrimmedSearch,
    searchInput,
    updatePageInUrl,
  ]);

  const handlePageChange = useCallback(
    (page: number): void => {
      updatePageInUrl(page);
    },
    [updatePageInUrl],
  );

  const handleResultsPanelClick = useCallback((): void => {
    if (isDetailsOpen) {
      closeDetails();
    }
  }, [closeDetails, isDetailsOpen]);

  const value = useMemo(
    () => ({
      searchInput,
      committedSearch,
      currentPage,
      detailsId,
      isDetailsOpen,
      hasPageParam,
      handleSearchInputChange,
      handleSearchClick,
      handlePageChange,
      handleResultsPanelClick,
      openDetails,
      closeDetails,
      isItemChecked,
      handleToggleItemCheck: onToggleItemCheck,
    }),
    [
      committedSearch,
      currentPage,
      detailsId,
      handlePageChange,
      handleResultsPanelClick,
      handleSearchClick,
      handleSearchInputChange,
      hasPageParam,
      isDetailsOpen,
      isItemChecked,
      onToggleItemCheck,
      openDetails,
      closeDetails,
      searchInput,
    ],
  );

  return (
    <HomeSearchContext.Provider value={value}>{children}</HomeSearchContext.Provider>
  );
}

export function useHomeSearch(): HomeSearchContextValue {
  const context = useContext(HomeSearchContext);

  if (!context) {
    throw new Error('useHomeSearch must be used within HomeSearchProvider');
  }

  return context;
}
