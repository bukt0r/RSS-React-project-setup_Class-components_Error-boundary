import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import ThemeProvider from '../context/ThemeProvider';
import selectedItemsReducer from '../store/selectedItemsSlice';
import type { AppStore } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore;
}

export function setupStore(): AppStore {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
