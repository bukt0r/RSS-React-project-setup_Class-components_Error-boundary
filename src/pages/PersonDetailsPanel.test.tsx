import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonDetailsPanel from './PersonDetailsPanel';
import { fetchPersonById } from '../services/swapiPeople';
import { createSearchResultItem } from '../test-utils/createSearchResultItem';
import { renderWithProviders } from '../test-utils/renderWithProviders';

vi.mock('../services/swapiPeople', () => ({
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

function renderPanel(initialPath = '/?page=1&details=1') {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<PersonDetailsPanel />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PersonDetailsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when details param is missing', () => {
    const { container } = renderPanel('/?page=1');

    expect(container).toBeEmptyDOMElement();
  });

  it('loads and displays person details for details id', async () => {
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('1', 'Luke Skywalker', 'Jedi master'),
    );

    renderPanel();

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('1');
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Jedi master')).toBeInTheDocument();
  });

  it('removes details param when close button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('1', 'Luke Skywalker', 'Jedi master'),
    );

    renderPanel();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Close details' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(screen.queryByRole('heading', { level: 3, name: 'Luke Skywalker' })).not.toBeInTheDocument();
  });

  it('shows loading indicator while person details query is in flight', async () => {
    let resolveFetch: (value: Awaited<ReturnType<typeof fetchPersonById>>) => void =
      () => undefined;

    vi.mocked(fetchPersonById).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    renderPanel();

    expect(screen.getByText('Loading details')).toBeInTheDocument();

    resolveFetch(createSearchResultItem('1', 'Luke Skywalker', 'Jedi master'));

    await waitFor(() => {
      expect(screen.queryByText('Loading details')).not.toBeInTheDocument();
    });
  });

  it('shows error message when person details query fails', async () => {
    vi.mocked(fetchPersonById).mockRejectedValue(
      new Error('Unable to load details. Please try again.'),
    );

    renderPanel();

    await waitFor(() => {
      expect(
        screen.getByText('Unable to load details. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  it('refetches person details after manual refresh invalidates cache', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPersonById)
      .mockResolvedValueOnce(
        createSearchResultItem('1', 'Luke Skywalker', 'Jedi master'),
      )
      .mockResolvedValueOnce(
        createSearchResultItem('1', 'Luke Skywalker', 'Updated master'),
      );

    renderPanel();

    await waitFor(() => {
      expect(screen.getByText('Jedi master')).toBeInTheDocument();
    });
    expect(fetchPersonById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    await waitFor(() => {
      expect(screen.getByText('Updated master')).toBeInTheDocument();
    });
    expect(fetchPersonById).toHaveBeenCalledTimes(2);
  });
});
