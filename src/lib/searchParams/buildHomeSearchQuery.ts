interface BuildHomeSearchQueryOptions {
  page: number;
  search?: string;
  detailsId?: string | null;
}

export function buildHomeSearchQuery({
  page,
  search = '',
  detailsId = null,
}: BuildHomeSearchQueryOptions): URLSearchParams {
  const params = new URLSearchParams({ page: String(page) });
  const trimmedSearch = search.trim();

  if (trimmedSearch.length > 0) {
    params.set('q', trimmedSearch);
  }

  if (detailsId) {
    params.set('details', detailsId);
  }

  return params;
}
