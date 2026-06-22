import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSwitcher from './ThemeSwitcher';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('ThemeSwitcher', () => {
  it('renders light and dark options with light selected by default', () => {
    renderWithProviders(<ThemeSwitcher />);

    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Dark' })).not.toBeChecked();
  });

  it('switches to dark when dark option is selected', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ThemeSwitcher />);

    await user.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Light' })).not.toBeChecked();
  });
});
