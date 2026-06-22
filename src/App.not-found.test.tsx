import { screen } from '@testing-library/react';
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

describe('App not-found handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('1', 'Luke Skywalker', 'Jedi'),
    );
  });

  it('shows the not-found page inside the shared layout', () => {
    renderAppPage('/unknown-route');

    expect(
      screen.getByRole('heading', { level: 1, name: '404' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to search' }),
    ).toHaveAttribute('href', '/');
  });

  it('returns to search from not-found while keeping shared layout', async () => {
    const user = userEvent.setup();
    renderAppPage('/missing-page');

    await user.click(screen.getByRole('link', { name: 'Back to search' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Item Search' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows localized not-found content in Russian', () => {
    renderAppPage('/unknown-route', 'ru');

    expect(screen.getByText('Страница не найдена.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Вернуться к поиску' }),
    ).toBeInTheDocument();
  });
});
