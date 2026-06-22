import { fetchPeoplePage, SwapiHttpError } from '@/services/swapiPeople';
import { loadPeoplePage } from './loadPeoplePage';
import { createSearchResultItem } from '@/test-utils/createSearchResultItem';

vi.mock('@/services/swapiPeople', () => ({
  fetchPeoplePage: vi.fn(),
  SwapiHttpError: class SwapiHttpError extends Error {
    constructor(status: number, message: string) {
      super(message);
      this.name = 'SwapiHttpError';
    }
  },
}));

describe('loadPeoplePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loaded page data on success', async () => {
    vi.mocked(fetchPeoplePage).mockResolvedValue({
      items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
      currentPage: 1,
      totalPages: 1,
    });

    await expect(loadPeoplePage('', 1)).resolves.toEqual({
      data: {
        items: [createSearchResultItem('1', 'Luke Skywalker', 'Jedi')],
        currentPage: 1,
        totalPages: 1,
      },
      error: null,
    });
  });

  it('returns an error message when fetch fails', async () => {
    vi.mocked(fetchPeoplePage).mockRejectedValue(
      new SwapiHttpError(404, 'No data was found for this request (404).'),
    );

    await expect(loadPeoplePage('Luke', 1)).resolves.toEqual({
      data: null,
      error: 'No data was found for this request (404).',
    });
  });
});
