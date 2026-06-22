import { loadPersonDetailsAction } from '@/actions/loadPersonDetails';
import { fetchPersonById } from '@/services/swapiPeople';
import { createSearchResultItem } from '@/test-utils/createSearchResultItem';

vi.mock('@/services/swapiPeople', () => ({
  fetchPersonById: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

describe('loadPersonDetailsAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads person details on the server', async () => {
    vi.mocked(fetchPersonById).mockResolvedValue(
      createSearchResultItem('10', 'Han Solo', 'Smuggler'),
    );

    await expect(loadPersonDetailsAction('10')).resolves.toEqual({
      data: createSearchResultItem('10', 'Han Solo', 'Smuggler'),
      error: null,
    });
    expect(fetchPersonById).toHaveBeenCalledWith('10');
  });
});
