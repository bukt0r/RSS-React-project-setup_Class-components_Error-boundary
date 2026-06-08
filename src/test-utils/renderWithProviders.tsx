import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import countriesReducer from '../store/countriesSlice';
import formSubmissionsReducer from '../store/formSubmissionsSlice';
import type { AppStore } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore;
}

export function setupStore(): AppStore {
  return configureStore({
    reducer: {
      countries: countriesReducer,
      formSubmissions: formSubmissionsReducer,
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
