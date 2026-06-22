export interface HomeSearchParams {
  currentPage: number;
  searchQuery: string;
  detailsId: string | null;
  isDetailsOpen: boolean;
}

export function parsePageParam(value: string | string[] | null | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function parseDetailsParam(
  value: string | string[] | null | undefined,
): string | null {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return null;
  }

  return rawValue;
}

export function parseSearchQueryParam(
  value: string | string[] | null | undefined,
): string {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return rawValue?.trim() ?? '';
}

export function parseHomeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): HomeSearchParams {
  const currentPage = parsePageParam(searchParams.page);
  const detailsId = parseDetailsParam(searchParams.details);
  const searchQuery = parseSearchQueryParam(searchParams.q);

  return {
    currentPage,
    searchQuery,
    detailsId,
    isDetailsOpen: detailsId !== null,
  };
}
