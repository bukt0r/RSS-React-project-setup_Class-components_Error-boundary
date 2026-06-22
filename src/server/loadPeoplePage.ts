import {
  fetchPeoplePage,
  type PeoplePageResult,
  SwapiHttpError,
} from '@/services/swapiPeople';

export interface LoadedPeoplePage {
  data: PeoplePageResult | null;
  error: string | null;
}

export async function loadPeoplePage(
  searchFromInput: string,
  page: number,
): Promise<LoadedPeoplePage> {
  try {
    const data = await fetchPeoplePage(searchFromInput, page);
    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof SwapiHttpError || error instanceof Error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: 'Unable to load data. Please try again.' };
  }
}
