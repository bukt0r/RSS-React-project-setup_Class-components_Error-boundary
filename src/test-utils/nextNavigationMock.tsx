import { createElement, type MouseEvent, type ReactNode } from 'react';
import { vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
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
  replace: navigate,
  push: navigate,
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useSearchParams: () => navigationState.searchParams,
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => navigationState.pathname,
  useRouter: () => router,
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
  redirect: vi.fn(),
  getPathname: vi.fn(),
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
