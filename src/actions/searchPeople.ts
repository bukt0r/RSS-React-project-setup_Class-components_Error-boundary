'use server';

import { loadPeoplePage, type LoadedPeoplePage } from '@/server/loadPeoplePage';

export async function searchPeopleAction(
  search: string,
  page: number,
): Promise<LoadedPeoplePage> {
  return loadPeoplePage(search, page);
}
