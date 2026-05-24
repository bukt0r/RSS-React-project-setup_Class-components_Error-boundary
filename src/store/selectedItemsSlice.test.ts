import selectedItemsReducer, {
  clearSelectedItems,
  toggleSelectedItem,
} from './selectedItemsSlice';
import {
  selectIsItemSelected,
  selectSelectedItems,
  selectSelectedItemsCount,
} from './selectedItemsSelectors';
import type { RootState } from './store';

const luke = {
  id: '1',
  name: 'Luke Skywalker',
  description: 'Jedi',
};

const leia = {
  id: '2',
  name: 'Leia Organa',
  description: 'Leader',
};

function createState(
  byId: RootState['selectedItems']['byId'] = {},
): RootState {
  return {
    selectedItems: { byId },
  };
}

describe('selectedItemsSlice', () => {
  it('adds an item when toggled on', () => {
    const next = selectedItemsReducer(
      { byId: {} },
      toggleSelectedItem(luke),
    );

    expect(next.byId).toEqual({ '1': luke });
  });

  it('removes an item when toggled off', () => {
    const next = selectedItemsReducer(
      { byId: { '1': luke } },
      toggleSelectedItem(luke),
    );

    expect(next.byId).toEqual({});
  });

  it('clears all selected items', () => {
    const next = selectedItemsReducer(
      { byId: { '1': luke, '2': leia } },
      clearSelectedItems(),
    );

    expect(next.byId).toEqual({});
  });
});

describe('selectedItemsSelectors', () => {
  it('returns selected items and count', () => {
    const state = createState({ '1': luke, '2': leia });

    expect(selectSelectedItems(state)).toEqual(
      expect.arrayContaining([luke, leia]),
    );
    expect(selectSelectedItemsCount(state)).toBe(2);
  });

  it('reports whether an item is selected', () => {
    const state = createState({ '1': luke });

    expect(selectIsItemSelected(state, '1')).toBe(true);
    expect(selectIsItemSelected(state, '2')).toBe(false);
  });
});
