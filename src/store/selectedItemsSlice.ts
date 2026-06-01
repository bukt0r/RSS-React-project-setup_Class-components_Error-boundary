import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchResultItem } from '../types/item';

export interface SelectedItemsState {
  byId: Record<string, SearchResultItem>;
}

const initialState: SelectedItemsState = {
  byId: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleSelectedItem(state, action: PayloadAction<SearchResultItem>) {
      const { id } = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
      } else {
        state.byId[id] = action.payload;
      }
    },
    clearSelectedItems(state) {
      state.byId = {};
    },
  },
});

export const { toggleSelectedItem, clearSelectedItems } =
  selectedItemsSlice.actions;

export default selectedItemsSlice.reducer;
