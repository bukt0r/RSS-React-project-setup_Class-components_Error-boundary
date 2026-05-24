import type { SearchResultItem } from '../types/item';
import type { RootState } from './store';

export const selectSelectedItemsById = (
  state: RootState,
): Record<string, SearchResultItem> => state.selectedItems.byId;

export const selectSelectedItems = (state: RootState): SearchResultItem[] =>
  Object.values(state.selectedItems.byId);

export const selectSelectedItemsCount = (state: RootState): number =>
  Object.keys(state.selectedItems.byId).length;

export const selectIsItemSelected = (
  state: RootState,
  itemId: string,
): boolean => Boolean(state.selectedItems.byId[itemId]);
