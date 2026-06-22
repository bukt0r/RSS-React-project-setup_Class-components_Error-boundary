'use server';

import { redirect } from '@/i18n/navigation';
import { buildHomeSearchQuery } from '@/lib/searchParams/buildHomeSearchQuery';
import { routing } from '@/i18n/routing';
import type { AppLocale } from '@/i18n/routing';

export async function submitSearchAction(
  _previousState: unknown,
  formData: FormData,
): Promise<void> {
  const search = formData.get('search')?.toString().trim() ?? '';
  const locale = (formData.get('locale')?.toString() ?? routing.defaultLocale) as AppLocale;
  const query = buildHomeSearchQuery({ page: 1, search });

  redirect({
    href: {
      pathname: '/',
      query: Object.fromEntries(query.entries()),
    },
    locale,
  });
}
