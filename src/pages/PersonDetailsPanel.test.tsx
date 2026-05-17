import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PersonDetailsPanel from './PersonDetailsPanel';
import { fetchPersonById } from '../services/swapiPeople';

vi.mock('../services/swapiPeople', () => ({
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

function renderPanel(initialPath = '/?page=1&details=1') {
  return render(
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
    vi.mocked(fetchPersonById).mockResolvedValue({
      id: '1',
      name: 'Luke Skywalker',
      description: 'Jedi master',
    });

    renderPanel();

    await waitFor(() => {
      expect(fetchPersonById).toHaveBeenCalledWith('1');
    });
    expect(
      screen.getByRole('heading', { level: 3, name: 'Luke Skywalker' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Jedi master')).toBeInTheDocument();
  });

  it('removes details param when close button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPersonById).mockResolvedValue({
      id: '1',
      name: 'Luke Skywalker',
      description: 'Jedi master',
    });

    renderPanel();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Close details' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    expect(screen.queryByRole('heading', { level: 3, name: 'Luke Skywalker' })).not.toBeInTheDocument();
  });
});
