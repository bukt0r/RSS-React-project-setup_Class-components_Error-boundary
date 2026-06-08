import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from './test-utils/renderWithProviders';

describe('App', () => {
  it('renders project title', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'React Forms' }),
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal from the main page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open uncontrolled form' }));

    expect(
      screen.getByRole('dialog', { name: 'Uncontrolled form' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept terms and conditions')).toBeInTheDocument();
  });

  it('opens react hook form modal from the main page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open React Hook Form' }));

    expect(
      screen.getByRole('dialog', { name: 'React Hook Form' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept terms and conditions')).toBeInTheDocument();
  });

  it('shows submissions section on the main page', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Submissions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No submissions yet.');
  });
});
