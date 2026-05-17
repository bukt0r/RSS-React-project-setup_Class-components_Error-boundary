import { useCallback } from 'react';
import {
  readStoredSearchRaw,
  writeStoredSearchTrimmed,
} from '../services/searchStorage';

export function useSearchStorage() {
  const readStoredSearch = useCallback((): string | null => {
    return readStoredSearchRaw();
  }, []);

  const saveTrimmedSearch = useCallback((trimmed: string): void => {
    writeStoredSearchTrimmed(trimmed);
  }, []);

  return { readStoredSearch, saveTrimmedSearch };
}
