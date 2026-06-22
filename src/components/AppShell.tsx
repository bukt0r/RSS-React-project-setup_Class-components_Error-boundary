'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useCallback, type ReactNode } from 'react';
import SelectionFlyout from '@/components/SelectionFlyout';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { downloadSelectedItemsCsv } from '@/services/selectedItemsCsv';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
} from '@/store/selectedItemsSelectors';
import { clearSelectedItems } from '@/store/selectedItemsSlice';

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const selectedItems = useAppSelector(selectSelectedItems);

  const handleUnselectAll = useCallback((): void => {
    dispatch(clearSelectedItems());
  }, [dispatch]);

  const handleDownload = useCallback((): void => {
    downloadSelectedItemsCsv(selectedItems);
  }, [selectedItems]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="app-nav" aria-label="Main navigation">
          <Link
            href="/"
            className={pathname === '/' ? 'app-nav__link active' : 'app-nav__link'}
          >
            Search
          </Link>
          <Link
            href="/about"
            className={
              pathname === '/about' ? 'app-nav__link active' : 'app-nav__link'
            }
          >
            About
          </Link>
        </nav>
        <ThemeSwitcher />
      </header>

      {children}

      <SelectionFlyout
        selectedCount={selectedCount}
        onUnselectAll={handleUnselectAll}
        onDownload={handleDownload}
      />
    </div>
  );
}

export default AppShell;
