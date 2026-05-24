import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { renderWithProviders } from './test-utils/renderWithProviders';
import PersonDetailsPanel from './pages/PersonDetailsPanel';
import { useSearchStorage } from './hooks/useSearchStorage';
import { fetchPeoplePage, fetchPersonById } from './services/swapiPeople';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./hooks/useSearchStorage', () => ({
  useSearchStorage: vi.fn(),
}));

function renderHomePage(initialPath = '/?page=1') {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<PersonDetailsPanel />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch: vi.fn(),
    });
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

  it('updates page query param when pagination next is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPeoplePage)
      .mockResolvedValueOnce({
        items: [{ id: '1', name: 'Person One', description: 'First page' }],
        currentPage: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [{ id: '2', name: 'Person Two', description: 'Second page' }],
        currentPage: 2,
        totalPages: 2,
      });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(fetchPeoplePage).toHaveBeenLastCalledWith('', 2);
    });
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('sets details query param when a result card is selected', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [{ id: '10', name: 'Han Solo', description: 'Smuggler' }],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue({
      id: '10',
      name: 'Han Solo',
      description: 'Smuggler details',
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Han Solo/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /Han Solo/i }));

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('10');
    });
    expect(screen.getByText('Smuggler details')).toBeInTheDocument();
  });
});
