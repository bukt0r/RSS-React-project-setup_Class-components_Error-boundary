import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchStorage } from './hooks/useSearchStorage';
import { fetchPeoplePage, fetchPersonById } from './services/swapiPeople';
import { createSearchResultItem } from './test-utils/createSearchResultItem';
import { renderHomePage } from './test-utils/renderAppPage';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./hooks/useSearchStorage', () => ({
  useSearchStorage: vi.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch: vi.fn(),
    });
  });

  it('keeps search input empty when storage contains a saved query', async () => {
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => 'Luke',
      saveTrimmedSearch: vi.fn(),
    });
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
      currentPage: 1,
      totalPages: 1,
    });

    renderHomePage();

    await waitFor(() => {
      expect(fetchPeoplePage).toHaveBeenCalledWith('', 1);
    });
    expect(screen.getByPlaceholderText('Enter item name')).toHaveValue('');
  });

  it('allows editing search input freely', async () => {
    const user = userEvent.setup();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch: vi.fn(),
    });
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [],
      currentPage: 1,
      totalPages: 1,
    });

    renderHomePage();

    const input = screen.getByPlaceholderText('Enter item name');
    expect(input).toHaveValue('');

    await user.type(input, 'Leia');

    expect(screen.getByDisplayValue('Leia')).toBeInTheDocument();
  });

  it('submits trimmed query, persists it and renders results', async () => {
    const user = userEvent.setup();
    const saveTrimmedSearch = vi.fn();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch,
    });
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('2', 'Leia Organa', 'Leader')],
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
        items: [createSearchResultItem('1', 'Person One', 'First page')],
        currentPage: 1,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [createSearchResultItem('2', 'Person Two', 'Second page')],
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
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    });
  });

  it('sets details query param when a result card is selected', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('10', 'Han Solo', 'Smuggler')],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('10', 'Han Solo', 'Smuggler details'),
    );

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Han Solo/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /Han Solo/i }));

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('10');
    });
    await waitFor(() => {
      expect(screen.getByText('Smuggler details')).toBeInTheDocument();
    });
  });
});
