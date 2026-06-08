import type { FormSubmission } from '../types/formSubmission';
import type { RootState } from './store';

export const selectCountries = (state: RootState): string[] =>
  state.countries.items;

export const selectFormSubmissions = (state: RootState): FormSubmission[] =>
  state.formSubmissions.items;

export const selectIsCountryValid = (
  state: RootState,
  country: string,
): boolean => state.countries.items.includes(country);
