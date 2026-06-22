import { searchPeopleAction } from '@/actions/searchPeople';
import { fetchPeoplePage } from '@/services/swapiPeople';
import { createSearchResultItem } from '@/test-utils/createSearchResultItem';

vi.mock('@/services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {},
}));

describe('searchPeopleAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads people page data on the server', async () => {
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
      currentPage: 1,
      totalPages: 1,
    });

    await expect(searchPeopleAction('Luke', 1)).resolves.toEqual({
      data: {
        items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
        currentPage: 1,
        totalPages: 1,
      },
      error: null,
    });
    expect(fetchPeoplePage).toHaveBeenCalledWith('Luke', 1);
  });
});
