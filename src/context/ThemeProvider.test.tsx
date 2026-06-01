import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSwitcher from '../components/ThemeSwitcher';
import ThemeProvider from './ThemeProvider';

function resetDocumentTheme(): void {
  document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.style.colorScheme = 'light';
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    resetDocumentTheme();
  });

  it('applies light theme to document on mount', () => {
    render(
      <ThemeProvider>
        <span>App content</span>
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('updates document theme when user selects dark', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('radio', { name: 'Dark' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
