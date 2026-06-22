import type { ReactElement } from 'react';
import { usePathname } from '@/i18n/navigation';
import SharedLayout from '../components/layout/SharedLayout';
import AboutPage from '../pages/AboutPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import PersonDetailsPanel from '../pages/PersonDetailsPanel';
import NavigationSync from './NavigationSync';
import { setNextNavigation } from './nextNavigationMock';
import type { AppLocale } from '../i18n/routing';
import { renderWithProviders } from './renderWithProviders';

function AppRouterPage() {
  const pathname = usePathname();

  if (pathname === '/about') {
    return <AboutPage />;
  }

  if (pathname === '/') {
    return <HomePage />;
  }

  return <NotFoundPage />;
}

export function renderAppPage(
  initialPath = '/?page=1',
  locale: AppLocale = 'en',
) {
  setNextNavigation(initialPath);

  return renderWithProviders(
    <NavigationSync>
      {() => (
        <SharedLayout>
          <AppRouterPage />
        </SharedLayout>
      )}
    </NavigationSync>,
    { locale },
  );
}

export function renderHomePage(
  initialPath = '/?page=1',
  locale: AppLocale = 'en',
) {
  setNextNavigation(initialPath);

  return renderWithProviders(
    <NavigationSync>{() => <HomePage />}</NavigationSync>,
    { locale },
  );
}

export function renderPersonDetailsPanel(initialPath = '/?page=1&details=1') {
  setNextNavigation(initialPath);

  return renderWithProviders(
    <NavigationSync>{() => <PersonDetailsPanel />}</NavigationSync>,
  );
}

export function renderWithSharedLayout(
  children: ReactElement,
  initialPath = '/?page=1',
) {
  setNextNavigation(initialPath);

  return renderWithProviders(
    <NavigationSync>{() => <SharedLayout>{children}</SharedLayout>}</NavigationSync>,
  );
}
