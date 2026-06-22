'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type SearchParamsUpdater = (prev: URLSearchParams) => URLSearchParams;

const emptySearchParams = new URLSearchParams();

export function useAppSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams() ?? emptySearchParams;

  const setSearchParams = useCallback(
    (updater: SearchParamsUpdater): void => {
      const next = updater(new URLSearchParams(searchParams.toString()));
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return { searchParams, setSearchParams };
}
