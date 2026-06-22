import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { downloadSelectedItemsCsv } from './services/selectedItemsCsv';
import { fetchPeoplePage } from './services/swapiPeople';
import { readStoredSearchRaw } from './services/searchStorage';
import { createSearchResultItem } from './test-utils/createSearchResultItem';
import { renderAppPage } from './test-utils/renderAppPage';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

vi.mock('./services/selectedItemsCsv', async () => {
  const actual = await vi.importActual<typeof import('./services/selectedItemsCsv')>(
    './services/selectedItemsCsv',
  );

  return {
    ...actual,
    downloadSelectedItemsCsv: vi.fn(),
  };
});

describe('Selected items CSV download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [
        createSearchResultItem('1', 'Luke Skywalker', 'Jedi'),
        createSearchResultItem('2', 'Leia Organa', 'Leader'),
      ],
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('downloads selected items when Download is clicked', async () => {
    const user = userEvent.setup();
    renderAppPage();

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    );
    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(downloadSelectedItemsCsv).toHaveBeenCalledTimes(1);
    expect(downloadSelectedItemsCsv).toHaveBeenCalledWith(
      [
        createSearchResultItem('1', 'Luke Skywalker', 'Jedi'),
        createSearchResultItem('2', 'Leia Organa', 'Leader'),
      ],
      window.location.origin,
      'en',
    );
  });

  it('does not call download when no items are selected', async () => {
    renderAppPage();

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
      ).toBeInTheDocument();
    });

    expect(downloadSelectedItemsCsv).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Download' }),
    ).not.toBeInTheDocument();
  });
});
