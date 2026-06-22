import { configureStore } from '@reduxjs/toolkit';
import { NextIntlClientProvider } from 'next-intl';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';
import { swapiApi } from '../api/swapiApi';
import ThemeProvider from '../context/ThemeProvider';
import type { AppLocale } from '../i18n/routing';
import selectedItemsReducer from '../store/selectedItemsSlice';
import type { AppStore } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore;
  locale?: AppLocale;
}

const messagesByLocale = {
  en: enMessages,
  ru: ruMessages,
};

export function setupStore(): AppStore {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [swapiApi.reducerPath]: swapiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(swapiApi.middleware),
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    store = setupStore(),
    locale = 'en',
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
        <Provider store={store}>
          <ThemeProvider>{children}</ThemeProvider>
        </Provider>
      </NextIntlClientProvider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
