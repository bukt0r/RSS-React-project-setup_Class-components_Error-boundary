import type { SearchResultItem } from '../types/item';

const CSV_HEADERS = ['id', 'name', 'description', 'app_details_url', 'api_url'] as const;

export function buildAppDetailsUrl(appOrigin: string, itemId: string): string {
  const origin = appOrigin.replace(/\/$/, '');
  const params = new URLSearchParams({ details: itemId });
  return `${origin}/?${params.toString()}`;
}

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function buildSelectedItemsCsvContent(
  items: SearchResultItem[],
  appOrigin: string,
): string {
  const header = CSV_HEADERS.join(',');
  const rows = items.map((item) => {
    const fields = [
      item.id,
      item.name,
      item.description,
      buildAppDetailsUrl(appOrigin, item.id),
      item.detailsUrl,
    ];

    return fields.map(escapeCsvField).join(',');
  });

  return [header, ...rows].join('\n');
}

export function getSelectedItemsCsvFilename(selectedCount: number): string {
  return `${selectedCount}_items.csv`;
}

export function downloadSelectedItemsCsv(
  items: SearchResultItem[],
  appOrigin: string = window.location.origin,
): void {
  if (items.length === 0) {
    return;
  }

  const csvContent = buildSelectedItemsCsvContent(items, appOrigin);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = getSelectedItemsCsvFilename(items.length);
  downloadLink.click();
  URL.revokeObjectURL(objectUrl);
}
