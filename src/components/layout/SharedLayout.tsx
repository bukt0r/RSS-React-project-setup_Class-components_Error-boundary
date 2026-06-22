'use client';

import { useLocale } from 'next-intl';
import { useCallback, type ReactNode } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import SelectionFlyout from '@/components/SelectionFlyout';
import type { AppLocale } from '@/i18n/routing';
import { downloadSelectedItemsCsv } from '@/services/selectedItemsCsv';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from '@/store/selectedItemsSelectors';
import { clearSelectedItems } from '@/store/selectedItemsSlice';

interface SharedLayoutProps {
  children: ReactNode;
}

function SharedLayout({ children }: SharedLayoutProps) {
  const locale = useLocale() as AppLocale;
  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const selectedItems = useAppSelector(selectSelectedItems);

  const handleUnselectAll = useCallback((): void => {
    dispatch(clearSelectedItems());
  }, [dispatch]);

  const handleDownload = useCallback((): void => {
    downloadSelectedItemsCsv(selectedItems, window.location.origin, locale);
  }, [locale, selectedItems]);

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-shell__content">{children}</div>
      <SelectionFlyout
        selectedCount={selectedCount}
        onUnselectAll={handleUnselectAll}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default SharedLayout;
