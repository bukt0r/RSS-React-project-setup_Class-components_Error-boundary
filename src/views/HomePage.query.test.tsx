import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchStorage } from '../hooks/useSearchStorage';
import { fetchPeoplePage, fetchPersonById } from '../services/swapiPeople';
import { createSearchResultItem } from '../test-utils/createSearchResultItem';
import { renderHomePage } from '../test-utils/renderAppPage';

vi.mock('../services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('../hooks/useSearchStorage', () => ({
  useSearchStorage: vi.fn(),
}));

describe('HomePage RTK Query behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearchStorage).mockReturnValue({
      readStoredSearch: () => null,
      saveTrimmedSearch: vi.fn(),
    });
  });

  it('shows loading indicator while people page query is in flight', async () => {
    let resolveFetch: (value: Awaited<ReturnType<typeof fetchPeoplePage>>) => void =
      () => undefined;

    vi.mocked(fetchPeoplePage).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    renderHomePage();

    expect(screen.getByLabelText('Loading results')).toBeInTheDocument();

    resolveFetch({
      items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
      currentPage: 1,
      totalPages: 1,
    });

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading results')).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' }),
    ).toBeInTheDocument();
  });

  it('shows error message when people page query fails', async () => {
    vi.mocked(fetchPeoplePage).mockRejectedValue(
      new Error('No data was found for this request (404).'),
    );

    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByText('No data was found for this request (404).'),
      ).toBeInTheDocument();
    });
  });

  it('reloads page data when navigating back to a previously visited page', async () => {
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
      })
      .mockResolvedValueOnce({
        items: [createSearchResultItem('1', 'Person One', 'First page again')],
        currentPage: 1,
        totalPages: 2,
      });

    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Person One' }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Person Two' }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Previous' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Person One' }),
      ).toBeInTheDocument();
    });

    expect(fetchPeoplePage).toHaveBeenCalledTimes(3);
  });

  it('refetches current page after manual refresh invalidates cache', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPeoplePage)
      .mockResolvedValueOnce({
        items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
        currentPage: 1,
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        items: [createSearchResultItem('1', 'Luke Skywalker', 'Updated')],
        currentPage: 1,
        totalPages: 1,
      });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByText('Jedi')).toBeInTheDocument();
    });
    expect(fetchPeoplePage).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
    expect(fetchPeoplePage).toHaveBeenCalledTimes(2);
  });

  it('reloads person details when reopening the same item', async () => {
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
      expect(screen.getByText('Smuggler details')).toBeInTheDocument();
    });
    expect(fetchPersonById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    await waitFor(() => {
      expect(screen.queryByText('Smuggler details')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Han Solo/i }));

    await waitFor(() => {
      expect(screen.getByText('Smuggler details')).toBeInTheDocument();
    });
    expect(fetchPersonById).toHaveBeenCalledTimes(2);
  });
});
