import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchFirstPagePeople } from './services/swapiPeople';
import {
  readStoredSearchRaw,
  writeStoredSearchTrimmed,
} from './services/searchStorage';

vi.mock('./services/swapiPeople', () => ({
  fetchFirstPagePeople: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads initial data using query restored from storage', async () => {
    vi.mocked(readStoredSearchRaw).mockReturnValue('Luke');
    vi.mocked(fetchFirstPagePeople).mockResolvedValue([
      { name: 'Luke Skywalker', description: 'Jedi' },
    ]);

    render(<App />);

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
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchFirstPagePeople)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ name: 'Leia Organa', description: 'Leader' }]);

    render(<App />);

    const input = screen.getByPlaceholderText('Enter item name');
    await user.clear(input);
    await user.type(input, '  Leia  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchFirstPagePeople).toHaveBeenLastCalledWith('Leia');
    });
    expect(writeStoredSearchTrimmed).toHaveBeenCalledWith('Leia');
    expect(screen.getByDisplayValue('Leia')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Leia Organa' }),
    ).toBeInTheDocument();
  });
});
