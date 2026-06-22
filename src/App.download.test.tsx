import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { exportSelectedItemsCsv } from './actions/exportSelectedItemsCsv';
import { downloadCsvFile } from './lib/downloadCsvFile';
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

vi.mock('./actions/exportSelectedItemsCsv', () => ({
  exportSelectedItemsCsv: vi.fn(),
}));

vi.mock('./lib/downloadCsvFile', () => ({
  downloadCsvFile: vi.fn(),
}));

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
    vi.mocked(exportSelectedItemsCsv).mockResolvedValue({
      content: 'id,name\n1,Luke Skywalker',
      filename: '2_items.csv',
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

    await waitFor(() => {
      expect(exportSelectedItemsCsv).toHaveBeenCalledTimes(1);
    });

    expect(exportSelectedItemsCsv).toHaveBeenCalledWith(
      [
        createSearchResultItem('1', 'Luke Skywalker', 'Jedi'),
        createSearchResultItem('2', 'Leia Organa', 'Leader'),
      ],
      window.location.origin,
      'en',
    );
    expect(downloadCsvFile).toHaveBeenCalledWith('id,name\n1,Luke Skywalker', '2_items.csv');
  });

  it('does not call server export when no items are selected', async () => {
    renderAppPage();

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
      ).toBeInTheDocument();
    });

    expect(exportSelectedItemsCsv).not.toHaveBeenCalled();
    expect(downloadCsvFile).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Download' }),
    ).not.toBeInTheDocument();
  });
});
