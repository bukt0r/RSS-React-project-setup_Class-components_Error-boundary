import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './countriesSlice';
import formSubmissionsReducer from './formSubmissionsSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    formSubmissions: formSubmissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
