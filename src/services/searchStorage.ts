const SEARCH_STORAGE_KEY = 'searchQuery';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStoredSearchRaw(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  return localStorage.getItem(SEARCH_STORAGE_KEY);
}

export function writeStoredSearchTrimmed(trimmed: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  if (localStorage.getItem(SEARCH_STORAGE_KEY) === trimmed) {
    return;
  }

  localStorage.setItem(SEARCH_STORAGE_KEY, trimmed);
}
