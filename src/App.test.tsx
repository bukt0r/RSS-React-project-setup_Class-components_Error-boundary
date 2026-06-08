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

  it('opens shared modal from the main page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(
      screen.getByRole('dialog', { name: 'Form modal' }),
    ).toBeInTheDocument();
  });

  it('shows submissions section on the main page', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Submissions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('No submissions yet.');
  });
});
