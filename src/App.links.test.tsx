import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchPeoplePage, fetchPersonById } from './services/swapiPeople';
import { readStoredSearchRaw } from './services/searchStorage';
import { createSearchResultItem } from './test-utils/createSearchResultItem';
import { renderAppPage } from './test-utils/renderAppPage';
import { appRoutes } from './i18n/routes';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

describe('Localized navigation links', () => {
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

  it('uses next-intl navigation links in the app header', () => {
    renderAppPage('/?page=1');

    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute(
      'href',
      appRoutes.home,
    );
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      appRoutes.about,
    );
  });

  it('uses next-intl navigation for the not-found back link', () => {
    renderAppPage('/unknown-route');

    expect(
      screen.getByRole('link', { name: 'Back to search' }),
    ).toHaveAttribute('href', appRoutes.home);
  });

  it('keeps external about links separate from internal navigation', () => {
    renderAppPage('/about');

    const authorLink = screen.getByRole('link', { name: 'vufimcev' });
    const courseLink = screen.getByRole('link', {
      name: 'RS School React course',
    });

    expect(authorLink).toHaveAttribute('href', 'https://github.com/bukt0r');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs',
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
  });

  it('navigates between localized routes from the header', async () => {
    const user = userEvent.setup();
    renderAppPage('/?page=1');

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Search' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Item Search' }),
    ).toBeInTheDocument();
  });
});
