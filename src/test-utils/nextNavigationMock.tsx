import { createElement, type MouseEvent, type ReactNode } from 'react';
import { vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  locale: 'en' as 'en' | 'ru',
  pathname: '/',
  searchParams: new URLSearchParams('page=1'),
  listeners: new Set<() => void>(),
  version: 0,
}));

function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(en|ru)(\/.*)?$/);

  if (!match) {
    return pathname || '/';
  }

  return match[2] || '/';
}

function notifyNavigation(): void {
  navigationState.version += 1;
  navigationState.listeners.forEach((listener) => listener());
}

export function getNavigationSnapshot(): number {
  return navigationState.version;
}

export function getNavigationLocale(): 'en' | 'ru' {
  return navigationState.locale;
}

export function getNavigationPathname(): string {
  return navigationState.pathname;
}

export function subscribeNavigation(listener: () => void): () => void {
  navigationState.listeners.add(listener);
  return () => {
    navigationState.listeners.delete(listener);
  };
}

export function resetNavigation(): void {
  navigationState.locale = 'en';
  navigationState.pathname = '/';
  navigationState.searchParams = new URLSearchParams('page=1');
  notifyNavigation();
}

export function setNextNavigation(path: string): void {
  const url = new URL(path, 'http://localhost');
  navigationState.pathname = stripLocalePrefix(url.pathname);
  navigationState.searchParams = new URLSearchParams(url.search);
  notifyNavigation();
}

function navigate(href: string): void {
  if (href.startsWith('?')) {
    navigationState.searchParams = new URLSearchParams(href.slice(1));
    notifyNavigation();
    return;
  }

  const url = new URL(href, 'http://localhost');
  navigationState.pathname = stripLocalePrefix(url.pathname);
  navigationState.searchParams = new URLSearchParams(url.search);
  notifyNavigation();
}

const router = {
  replace: (href: string, options?: { locale?: string }) => {
    if (options?.locale) {
      navigationState.locale = options.locale as 'en' | 'ru';
      notifyNavigation();
      return;
    }

    navigate(href);
  },
  push: (href: string, options?: { locale?: string }) => {
    router.replace(href, options);
  },
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => navigationState.searchParams,
}));

function buildMockPathname(
  locale: 'en' | 'ru',
  href: string | { pathname: string; query?: Record<string, string> },
): string {
  const pathname = typeof href === 'string' ? href : href.pathname;
  const query = typeof href === 'object' ? href.query : undefined;
  const localizedPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  if (!query) {
    return localizedPath;
  }

  return `${localizedPath}?${new URLSearchParams(query).toString()}`;
}

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => router,
  getPathname: ({
    locale,
    href,
  }: {
    locale: 'en' | 'ru';
    href: string | { pathname: string; query?: Record<string, string> };
  }) => buildMockPathname(locale, href),
  Link: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) =>
    createElement(
      'a',
      {
        href: typeof href === 'string' ? href : String(href),
        className,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          navigate(typeof href === 'string' ? href : String(href));
        },
        ...props,
      },
      children,
    ),
  redirect: (
    target:
      | string
      | {
          href: { pathname: string; query?: Record<string, string> };
          locale?: string;
        },
  ) => {
    if (typeof target === 'string') {
      navigate(target);
      return;
    }

    const query = target.href.query
      ? `?${new URLSearchParams(target.href.query).toString()}`
      : '';
    navigate(`${target.href.pathname}${query}`);
  },
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) =>
    createElement(
      'a',
      {
        href,
        className,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          navigate(href);
        },
        ...props,
      },
      children,
    ),
}));
