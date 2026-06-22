import { getPathname } from '@/i18n/navigation';
import type { AppLocale } from './routing';
import { appRoutes } from './routes';

export function buildLocalizedDetailsHref(
  locale: AppLocale,
  itemId: string,
): string {
  return getPathname({
    locale,
    href: {
      pathname: appRoutes.home,
      query: { page: '1', details: itemId },
    },
  });
}

export function buildLocalizedAppDetailsUrl(
  appOrigin: string,
  itemId: string,
  locale: AppLocale,
): string {
  const origin = appOrigin.replace(/\/$/, '');
  return `${origin}${buildLocalizedDetailsHref(locale, itemId)}`;
}
