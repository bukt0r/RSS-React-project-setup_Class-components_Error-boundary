import formSubmissionsReducer, {
  addSubmission,
} from './formSubmissionsSlice';
import countriesReducer from './countriesSlice';
import {
  selectCountries,
  selectFormSubmissions,
  selectIsCountryValid,
} from './selectors';
import type { FormSubmission } from '../types/formSubmission';
import type { RootState } from './store';

const sampleSubmission: FormSubmission = {
  id: '1',
  source: 'uncontrolled',
  name: 'Luke Skywalker',
  age: 25,
  email: 'luke@example.com',
  gender: 'male',
  acceptedTerms: true,
  country: 'United States',
  imageBase64: 'data:image/png;base64,abc',
  submittedAt: 1,
};

function createState(
  submissions: FormSubmission[] = [],
): RootState {
  return {
    countries: countriesReducer(undefined, { type: 'init' }),
    formSubmissions: { items: submissions },
  };
}

describe('formSubmissionsSlice', () => {
  it('adds a submission to the beginning of history', () => {
    const next = formSubmissionsReducer(
      { items: [] },
      addSubmission(sampleSubmission),
    );

    expect(next.items).toEqual([sampleSubmission]);
  });
});

describe('countriesSlice', () => {
  it('provides a default countries list', () => {
    const state = countriesReducer(undefined, { type: 'init' });

    expect(state.items).toContain('United States');
    expect(state.items).toContain('Ukraine');
  });
});

describe('store selectors', () => {
  it('returns submissions and countries from state', () => {
    const state = createState([sampleSubmission]);

    expect(selectFormSubmissions(state)).toEqual([sampleSubmission]);
    expect(selectCountries(state)).toContain('Canada');
  });

  it('validates country against stored list', () => {
    const state = createState();

    expect(selectIsCountryValid(state, 'Germany')).toBe(true);
    expect(selectIsCountryValid(state, 'Unknownland')).toBe(false);
  });
});
