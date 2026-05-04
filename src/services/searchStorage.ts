const SEARCH_STORAGE_KEY = 'searchQuery';

export function readStoredSearchRaw(): string | null {
  return localStorage.getItem(SEARCH_STORAGE_KEY);
}
