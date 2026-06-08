import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSubmission } from '../types/formSubmission';

export interface FormSubmissionsState {
  items: FormSubmission[];
}

const initialState: FormSubmissionsState = {
  items: [],
};

const formSubmissionsSlice = createSlice({
  name: 'formSubmissions',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<FormSubmission>) {
      state.items.unshift(action.payload);
    },
  },
});

export const { addSubmission } = formSubmissionsSlice.actions;

export default formSubmissionsSlice.reducer;
