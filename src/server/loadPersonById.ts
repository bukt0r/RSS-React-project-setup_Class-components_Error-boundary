import {
  fetchPersonById,
  SwapiHttpError,
} from '@/services/swapiPeople';
import type { SearchResultItem } from '@/types/item';

export interface LoadedPersonDetails {
  data: SearchResultItem | null;
  error: string | null;
}

export async function loadPersonById(id: string): Promise<LoadedPersonDetails> {
  try {
    const data = await fetchPersonById(id);
    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof SwapiHttpError || error instanceof Error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: 'Unable to load details. Please try again.' };
  }
}
