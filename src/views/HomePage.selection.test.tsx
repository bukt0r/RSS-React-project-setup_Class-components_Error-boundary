import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fetchPeoplePage, fetchPersonById } from '../services/swapiPeople';
import { readStoredSearchRaw } from '../services/searchStorage';
import { createSearchResultItem } from '../test-utils/createSearchResultItem';
import { renderAppPage } from '../test-utils/renderAppPage';

vi.mock('../services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

vi.mock('../services/searchStorage', () => ({
  readStoredSearchRaw: vi.fn(),
  writeStoredSearchTrimmed: vi.fn(),
}));

const luke = createSearchResultItem('1', 'Luke Skywalker', 'Jedi');
const leia = createSearchResultItem('2', 'Leia Organa', 'Leader');

describe('HomePage item selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredSearchRaw).mockReturnValue(null);
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [luke, leia],
      currentPage: 1,
      totalPages: 1,
    });
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('1', 'Luke Skywalker', 'Jedi details'),
    );
  });

  async function waitForResults(): Promise<void> {
    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
      ).toBeInTheDocument();
    });
  }

  it('selects and unselects an item via checkbox', async () => {
    const user = userEvent.setup();
    const { store } = renderAppPage();
    await waitForResults();

    const lukeCheckbox = screen.getByRole('checkbox', {
      name: 'Select Luke Skywalker',
    });

    await user.click(lukeCheckbox);
    expect(lukeCheckbox).toBeChecked();
    expect(store.getState().selectedItems.byId['1']).toEqual(luke);

    await user.click(lukeCheckbox);
    expect(lukeCheckbox).not.toBeChecked();
    expect(store.getState().selectedItems.byId['1']).toBeUndefined();
  });

  it('opens details from card body without changing checkbox selection', async () => {
    const user = userEvent.setup();
    renderAppPage();
    await waitForResults();

    const lukeCheckbox = screen.getByRole('checkbox', {
      name: 'Select Luke Skywalker',
    });
    expect(lukeCheckbox).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: /Luke Skywalker/i }));

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('1');
    });
    expect(lukeCheckbox).not.toBeChecked();
    await waitFor(() => {
      expect(screen.getByText('Jedi details')).toBeInTheDocument();
    });
  });

  it('does not open details when only the checkbox is clicked', async () => {
    const user = userEvent.setup();
    renderAppPage();
    await waitForResults();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    );

    expect(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    ).toBeChecked();
    expect(fetchPersonById).not.toHaveBeenCalled();
    expect(screen.queryByText('Jedi details')).not.toBeInTheDocument();
  });

  it('keeps checkbox selection when details panel is opened', async () => {
    const user = userEvent.setup();
    renderAppPage();
    await waitForResults();

    const lukeCheckbox = screen.getByRole('checkbox', {
      name: 'Select Luke Skywalker',
    });

    await user.click(lukeCheckbox);
    await user.click(screen.getByRole('button', { name: /Luke Skywalker/i }));

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('1');
    });
    expect(lukeCheckbox).toBeChecked();
  });

  it('persists selected items when navigating between Search and About', async () => {
    const user = userEvent.setup();
    const { store } = renderAppPage();
    await waitForResults();

    await user.click(
      screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
    );
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    );

    expect(store.getState().selectedItems.byId).toEqual({
      '1': luke,
      '2': leia,
    });

    await user.click(screen.getByRole('link', { name: 'About' }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();
    expect(Object.keys(store.getState().selectedItems.byId)).toHaveLength(2);

    await user.click(screen.getByRole('link', { name: 'Search' }));

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: 'Select Luke Skywalker' }),
      ).toBeChecked();
    });
    expect(
      screen.getByRole('checkbox', { name: 'Select Leia Organa' }),
    ).toBeChecked();
    expect(store.getState().selectedItems.byId).toEqual({
      '1': luke,
      '2': leia,
    });
  });
});
