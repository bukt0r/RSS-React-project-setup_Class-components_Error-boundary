'use server';

import { loadPersonById, type LoadedPersonDetails } from '@/server/loadPersonById';

export async function loadPersonDetailsAction(
  personId: string,
): Promise<LoadedPersonDetails> {
  return loadPersonById(personId);
}
