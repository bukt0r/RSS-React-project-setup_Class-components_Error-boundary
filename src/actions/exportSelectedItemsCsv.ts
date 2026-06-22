'use server';

import type { AppLocale } from '@/i18n/routing';
import {
  buildSelectedItemsCsvContent,
  getSelectedItemsCsvFilename,
} from '@/services/selectedItemsCsv';
import type { SearchResultItem } from '@/types/item';

export interface SelectedItemsCsvExport {
  content: string;
  filename: string;
}

export async function exportSelectedItemsCsv(
  items: SearchResultItem[],
  appOrigin: string,
  locale: AppLocale = 'en',
): Promise<SelectedItemsCsvExport | null> {
  if (items.length === 0) {
    return null;
  }

  return {
    content: buildSelectedItemsCsvContent(items, appOrigin, locale),
    filename: getSelectedItemsCsvFilename(items.length),
  };
}
