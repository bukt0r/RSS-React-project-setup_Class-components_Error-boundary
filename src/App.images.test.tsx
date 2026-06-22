import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchPeoplePage, fetchPersonById } from './services/swapiPeople';
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

describe('App images', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('1', 'Luke Skywalker', 'Jedi details'),
    );
  });

  it('renders character images in search results', async () => {
    renderAppPage('/?page=1');

    await waitFor(() => {
      expect(
        screen.getByRole('img', { name: 'Luke Skywalker' }),
      ).toHaveAttribute(
        'src',
        'https://starwars-visualguide.com/assets/img/character/1.jpg',
      );
    });
  });

  it('renders character image in the details panel', async () => {
    const user = userEvent.setup();
    renderAppPage('/?page=1');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Luke Skywalker/i })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: /Luke Skywalker/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('img', { name: 'Luke Skywalker' })).toHaveLength(2);
    });
  });

  it('renders the app logo on the about page', () => {
    renderAppPage('/about');

    expect(screen.getByRole('img', { name: 'Item Search logo' })).toHaveAttribute(
      'src',
      '/images/rs-search-logo.svg',
    );
  });
});
