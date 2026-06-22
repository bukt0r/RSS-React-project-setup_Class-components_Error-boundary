import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from './LanguageSwitcher';
import { getNavigationLocale } from '../test-utils/nextNavigationMock';
import { renderWithProviders } from '../test-utils/renderWithProviders';

describe('LanguageSwitcher', () => {
  it('renders English and Russian options with English selected by default', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Russian' })).not.toBeChecked();
  });

  it('requests locale change when another language is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('radio', { name: 'Russian' }));

    expect(getNavigationLocale()).toBe('ru');
  });
});
