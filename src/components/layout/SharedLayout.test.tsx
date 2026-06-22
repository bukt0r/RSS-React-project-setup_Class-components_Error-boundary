import { screen, waitFor } from '@testing-library/react';
import AboutPageView from '../../components/about/AboutPageView';
import HomePage from '../../views/HomePage';
import NotFoundPage from '../../views/NotFoundPage';
import SharedLayout from './SharedLayout';
import { fetchPeoplePage } from '../../services/swapiPeople';
import { readStoredSearchRaw } from '../../services/searchStorage';
import { getAboutPageContent } from '../../test-utils/aboutPageContent';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import NavigationSync from '../../test-utils/NavigationSync';
import { setNextNavigation } from '../../test-utils/nextNavigationMock';

vi.mock('../../services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('../../services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

describe('SharedLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [],
      currentPage: 1,
      totalPages: 1,
    });
    setNextNavigation('/?page=1');
  });

  it('renders navigation on the home page', async () => {
    renderWithProviders(
      <NavigationSync>
        {() => (
          <SharedLayout>
            <HomePage />
          </SharedLayout>
        )}
      </NavigationSync>,
    );

    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Item Search' }),
      ).toBeInTheDocument();
    });
  });

  it('renders navigation on the about page', () => {
    renderWithProviders(
      <SharedLayout>
        <AboutPageView {...getAboutPageContent()} />
      </SharedLayout>,
    );

    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();
  });

  it('renders navigation on the not-found page', () => {
    renderWithProviders(
      <SharedLayout>
        <NotFoundPage />
      </SharedLayout>,
    );

    expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
  });
});
