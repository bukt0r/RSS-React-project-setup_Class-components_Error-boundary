import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders project title', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'React Forms' }),
    ).toBeInTheDocument();
  });

  it('opens shared modal from the main page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(
      screen.getByRole('dialog', { name: 'Form modal' }),
    ).toBeInTheDocument();
  });
});
