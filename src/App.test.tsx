import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { useSearchStorage } from './hooks/useSearchStorage';
import { fetchPeoplePage } from './services/swapiPeople';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./hooks/useSearchStorage', () => ({
  useSearchStorage: vi.fn(),
}));

function renderHomePage(initialPath = '/?page=1') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads initial data using query restored from storage', async () => {
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => 'Luke',
      saveTrimmedSearch: vi.fn(),
    });
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [{ id: '1', name: 'Luke Skywalker', description: 'Jedi' }],
      currentPage: 1,
      totalPages: 1,
    });

    renderHomePage();

    await waitFor(() => {
      expect(fetchPeoplePage).toHaveBeenCalledWith('Luke', 1);
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
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [{ id: '2', name: 'Leia Organa', description: 'Leader' }],
      currentPage: 1,
      totalPages: 1,
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled();
    });

    const input = screen.getByPlaceholderText('Enter item name');
    await user.clear(input);
    await user.type(input, '  Leia  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchPeoplePage).toHaveBeenLastCalledWith('Leia', 1);
    });
    expect(saveTrimmedSearch).toHaveBeenCalledWith('Leia');
    expect(screen.getByDisplayValue('Leia')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Leia Organa' }),
    ).toBeInTheDocument();
  });
});
