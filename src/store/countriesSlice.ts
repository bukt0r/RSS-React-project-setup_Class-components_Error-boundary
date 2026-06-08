import { createSlice } from '@reduxjs/toolkit';

export interface CountriesState {
  items: string[];
}

const initialState: CountriesState = {
  items: [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Ukraine',
    'Poland',
    'Japan',
    'Australia',
    'Brazil',
  ],
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export default countriesSlice.reducer;
