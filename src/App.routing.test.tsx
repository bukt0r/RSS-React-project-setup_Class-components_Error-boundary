import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { fetchPeoplePage, fetchPersonById } from './services/swapiPeople';
import { readStoredSearchRaw } from './services/searchStorage';

vi.mock('./services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('./services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue({
      id: '1',
      name: 'Luke Skywalker',
      description: 'Jedi',
    });
  });

  it('renders About page with author and course link', () => {
    renderApp('/about');

    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Author:/)).toBeInTheDocument();
    expect(screen.getByText('vufimcev')).toBeInTheDocument();

    const courseLink = screen.getByRole('link', {
      name: 'RS School React course',
    });
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/react/en',
    );
  });

  it('renders 404 page for unknown routes', () => {
    renderApp('/unknown-route');

    expect(
      screen.getByRole('heading', { level: 1, name: '404' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to search' }),
    ).toHaveAttribute('href', '/');
  });

  it('navigates between Search and About via header links', async () => {
    const user = userEvent.setup();
    renderApp('/?page=1');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Item Search' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Search' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Item Search' }),
    ).toBeInTheDocument();
  });

  it('returns to home from 404 via back link', async () => {
    const user = userEvent.setup();
    renderApp('/missing-page');

    await user.click(screen.getByRole('link', { name: 'Back to search' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'Item Search' }),
    ).toBeInTheDocument();
  });
});
