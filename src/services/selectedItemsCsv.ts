import type { AppLocale } from '@/i18n/routing';
import { buildLocalizedAppDetailsUrl } from '@/i18n/appPaths';
import type { SearchResultItem } from '../types/item';

const CSV_HEADERS = ['id', 'name', 'description', 'app_details_url', 'api_url'] as const;

export function buildAppDetailsUrl(
  appOrigin: string,
  itemId: string,
  locale: AppLocale = 'en',
): string {
  return buildLocalizedAppDetailsUrl(appOrigin, itemId, locale);
}

export function buildSelectedItemsCsvContent(
  items: SearchResultItem[],
  appOrigin: string,
  locale: AppLocale = 'en',
): string {
  const header = CSV_HEADERS.join(',');
  const rows = items.map((item) => {
    const fields = [
      item.id,
      item.name,
      item.description,
      buildAppDetailsUrl(appOrigin, item.id, locale),
      item.detailsUrl,
    ];

    return fields.map(escapeCsvField).join(',');
  });

  return [header, ...rows].join('\n');
}

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function getSelectedItemsCsvFilename(selectedCount: number): string {
  return `${selectedCount}_items.csv`;
}

export function downloadSelectedItemsCsv(
  items: SearchResultItem[],
  appOrigin: string = window.location.origin,
  locale: AppLocale = 'en',
): void {
  if (items.length === 0) {
    return;
  }

  const csvContent = buildSelectedItemsCsvContent(items, appOrigin, locale);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = getSelectedItemsCsvFilename(items.length);
  downloadLink.click();
  URL.revokeObjectURL(objectUrl);
}
