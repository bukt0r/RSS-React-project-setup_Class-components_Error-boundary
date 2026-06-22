'use server';

import { revalidatePath } from 'next/cache';

export async function refreshSearchResultsAction(): Promise<void> {
  revalidatePath('/', 'page');
}
