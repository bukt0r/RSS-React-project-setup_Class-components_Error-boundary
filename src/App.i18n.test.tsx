import { screen } from '@testing-library/react';
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

describe('App internationalization', () => {
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

  it('renders Russian UI when locale is ru', () => {
    renderAppPage('/?page=1', 'ru');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Поиск объектов' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Поиск' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'О проекте' })).toBeInTheDocument();
  });
});
