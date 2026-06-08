import { screen } from '@testing-library/react';
import SubmissionList from './SubmissionList';
import { addSubmission } from '../../store/formSubmissionsSlice';
import { renderWithProviders, setupStore } from '../../test-utils/renderWithProviders';
import type { FormSubmission } from '../../types/formSubmission';

const sampleSubmission: FormSubmission = {
  id: '1',
  source: 'react-hook-form',
  name: 'Leia Organa',
  age: 30,
  email: 'leia@example.com',
  gender: 'female',
  acceptedTerms: true,
  country: 'United Kingdom',
  imageBase64: 'data:image/jpeg;base64,abc',
  submittedAt: 1,
};

describe('SubmissionList', () => {
  it('shows empty state when there are no submissions', () => {
    renderWithProviders(<SubmissionList />);

    expect(screen.getByRole('status')).toHaveTextContent('No submissions yet.');
  });

  it('renders submitted cards from the store', () => {
    const store = setupStore();
    store.dispatch(addSubmission(sampleSubmission));

    renderWithProviders(<SubmissionList />, { store });

    expect(
      screen.getByRole('heading', { level: 3, name: 'Leia Organa' }),
    ).toBeInTheDocument();
    expect(screen.getByText('react-hook-form')).toBeInTheDocument();
    expect(
      screen.getByText('leia@example.com · 30 · United Kingdom'),
    ).toBeInTheDocument();
  });
});
