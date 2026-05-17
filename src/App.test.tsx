import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './pages/HomePage';
import { useSearchStorage } from './hooks/useSearchStorage';
import { fetchFirstPagePeople } from './services/swapiPeople';

vi.mock('./services/swapiPeople', () => ({
  fetchFirstPagePeople: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./hooks/useSearchStorage', () => ({
  useSearchStorage: vi.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads initial data using query restored from storage', async () => {
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => 'Luke',
      saveTrimmedSearch: vi.fn(),
    });
    vi.mocked(fetchFirstPagePeople).mockResolvedValue([
      { name: 'Luke Skywalker', description: 'Jedi' },
    ]);

    render(<HomePage />);

    await waitFor(() => {
      expect(fetchFirstPagePeople).toHaveBeenCalledWith('Luke');
    });
    expect(screen.getByDisplayValue('Luke')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' }),
    ).toBeInTheDocument();
  });

  it('submits trimmed query, persists it and renders results', async () => {
    const user = userEvent.setup();
    const saveTrimmedSearch = vi.fn();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch,
    });
    vi.mocked(fetchFirstPagePeople)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ name: 'Leia Organa', description: 'Leader' }]);

    render(<HomePage />);

    const input = screen.getByPlaceholderText('Enter item name');
    await user.clear(input);
    await user.type(input, '  Leia  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchFirstPagePeople).toHaveBeenLastCalledWith('Leia');
    });
    expect(saveTrimmedSearch).toHaveBeenCalledWith('Leia');
    expect(screen.getByDisplayValue('Leia')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Leia Organa' }),
    ).toBeInTheDocument();
  });
});
