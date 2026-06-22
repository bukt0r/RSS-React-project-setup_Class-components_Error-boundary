'use client';

import { useRouter } from '@/i18n/navigation';
import { refreshSearchResultsAction } from '@/actions/refreshSearchResults';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useAppSearchParams } from '@/hooks/useAppSearchParams';
import { useSearchStorage } from '@/hooks/useSearchStorage';
import { buildHomeSearchQuery } from '@/lib/searchParams/buildHomeSearchQuery';
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
  handleSearchSubmit: () => void;
  handlePageChange: (page: number) => void;
  handleResultsPanelClick: () => void;
  openDetails: (id: string) => void;
  closeDetails: () => void;
  isItemChecked: (id: string) => boolean;
  handleToggleItemCheck: (item: SearchResultItem) => void;
  registerResultsRefresh: (refresh: () => Promise<void>) => void;
  triggerResultsRefresh: () => Promise<void>;
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
  const router = useRouter();
  const { saveTrimmedSearch } = useSearchStorage();
  const { searchParams, setSearchParams } = useAppSearchParams();
  const refreshResultsRef = useRef<(() => Promise<void>) | null>(null);
  const [draftSearch, setDraftSearch] = useState('');
  const hasPageParam = Boolean(searchParams.get('page'));
  const currentPage = parsePageParam(searchParams.get('page') ?? String(initialPage));
  const committedSearch = searchParams.get('q') ?? '';
  const searchInput = searchParams.has('q') ? committedSearch : draftSearch;
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
        const next = buildHomeSearchQuery({
          page: parsePageParam(prev.get('page') ?? String(initialPage)),
          search: prev.get('q') ?? '',
          detailsId: id,
        });
        return next;
      });
    },
    [initialPage, setSearchParams],
  );

  const updatePageInUrl = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        return buildHomeSearchQuery({
          page,
          search: prev.get('q') ?? '',
        });
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
      setDraftSearch(nextValue);

      if (searchParams.has('q')) {
        setSearchParams((prev) =>
          buildHomeSearchQuery({
            page: 1,
            search: '',
            detailsId: prev.get('details'),
          }),
        );
      }

      if (isDetailsOpen) {
        closeDetails();
      }

      if (currentPage !== 1) {
        updatePageInUrl(1);
      }
    },
    [
      closeDetails,
      currentPage,
      isDetailsOpen,
      searchParams,
      setSearchParams,
      updatePageInUrl,
    ],
  );

  const handleSearchSubmit = useCallback((): void => {
    saveTrimmedSearch(searchInput.trim());
  }, [saveTrimmedSearch, searchInput]);

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

  const registerResultsRefresh = useCallback((refresh: () => Promise<void>) => {
    refreshResultsRef.current = refresh;
  }, []);

  const triggerResultsRefresh = useCallback(async (): Promise<void> => {
    try {
      await refreshSearchResultsAction();
      router.refresh();
    } catch {
      // revalidatePath is unavailable outside the Next.js request runtime (e.g. Vitest).
    }

    await refreshResultsRef.current?.();
  }, [router]);

  const value = useMemo(
    () => ({
      searchInput,
      committedSearch,
      currentPage,
      detailsId,
      isDetailsOpen,
      hasPageParam,
      handleSearchInputChange,
      handleSearchSubmit,
      handlePageChange,
      handleResultsPanelClick,
      openDetails,
      closeDetails,
      isItemChecked,
      handleToggleItemCheck: onToggleItemCheck,
      registerResultsRefresh,
      triggerResultsRefresh,
    }),
    [
      committedSearch,
      currentPage,
      detailsId,
      handlePageChange,
      handleResultsPanelClick,
      handleSearchInputChange,
      handleSearchSubmit,
      hasPageParam,
      isDetailsOpen,
      isItemChecked,
      onToggleItemCheck,
      openDetails,
      closeDetails,
      registerResultsRefresh,
      searchInput,
      triggerResultsRefresh,
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
