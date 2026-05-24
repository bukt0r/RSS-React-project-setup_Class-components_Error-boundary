import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { renderWithProviders } from './test-utils/renderWithProviders';
import { fetchPeoplePage } from './services/swapiPeople';
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

function renderApp(initialPath = '/?page=1') {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

async function waitForSearchResults(): Promise<void> {
  await waitFor(() => {
    expect(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    ).toBeInTheDocument();
  });
}

describe('Selection flyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [
        { id: '1', name: 'Luke Skywalker', description: 'Jedi' },
        { id: '2', name: 'Leia Organa', description: 'Leader' },
      ],
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('is hidden when no items are selected', async () => {
    renderApp();
    await waitForSearchResults();

    expect(
      screen.queryByRole('region', { name: 'Selected items summary' }),
    ).not.toBeInTheDocument();
  });

  it('shows the number of selected items', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForSearchResults();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    );
    expect(screen.getByText('1 item selected')).toBeInTheDocument();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    );
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('clears all selections when Unselect all is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderApp();
    await waitForSearchResults();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    );

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(
      screen.queryByRole('region', { name: 'Selected items summary' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    ).not.toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    ).not.toBeChecked();
    expect(store.getState().selectedItems.byId).toEqual({});
  });

  it('stays visible on About page while selections persist', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForSearchResults();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    );

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Unselect all' }),
    ).toBeInTheDocument();
  });
});
