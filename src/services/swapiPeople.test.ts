import {
  fetchFirstPagePeople,
  fetchPeoplePage,
  fetchPersonById,
  SwapiHttpError,
} from './swapiPeople';

const lukePerson = {
  url: 'https://swapi.py4e.com/api/people/1/',
  name: 'Luke Skywalker',
  gender: 'male',
  birth_year: '19BBY',
  height: '172',
  mass: '77',
  hair_color: 'blond',
};

describe('swapiPeople service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests base endpoint when search is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ count: 0, results: [] }),
    } as Response);

    await fetchPeoplePage('   ', 1);

    expect(fetchMock).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/');
  });

  it('requests encoded search query and maps response data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        count: 1,
        results: [lukePerson],
      }),
    } as Response);

    const result = await fetchPeoplePage(' Luke ', 1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://swapi.py4e.com/api/people/?search=Luke',
    );
    expect(result).toEqual({
      items: [
        {
          id: '1',
          name: 'Luke Skywalker',
          description:
            'Gender: male · Birth year: 19BBY · Height: 172 cm · Mass: 77 kg · Hair: blond',
          detailsUrl: 'https://swapi.py4e.com/api/people/1/',
          imageUrl: 'https://starwars-visualguide.com/assets/img/character/1.jpg',
        },
      ],
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('requests a specific page number in the query string', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ count: 20, results: [lukePerson] }),
    } as Response);

    await fetchPeoplePage('', 2);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://swapi.py4e.com/api/people/?page=2',
    );
  });

  it('throws SwapiHttpError with mapped message for 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    await expect(fetchPeoplePage('Leia', 1)).rejects.toEqual(
      expect.objectContaining<Partial<SwapiHttpError>>({
        name: 'SwapiHttpError',
        status: 404,
        message: 'No data was found for this request (404).',
      }),
    );
  });

  it('propagates network failures from fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network down'));

    await expect(fetchPeoplePage('Han', 1)).rejects.toThrow('Network down');
  });

  it('requests person details by id', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => lukePerson,
    } as Response);

    const result = await fetchPersonById('1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://swapi.py4e.com/api/people/1/',
    );
    expect(result.id).toBe('1');
    expect(result.name).toBe('Luke Skywalker');
  });

  it('fetchFirstPagePeople returns items from the first page', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        count: 1,
        results: [lukePerson],
      }),
    } as Response);

    const result = await fetchFirstPagePeople('Luke');

    expect(result).toEqual([
      {
        id: '1',
        name: 'Luke Skywalker',
        description:
          'Gender: male · Birth year: 19BBY · Height: 172 cm · Mass: 77 kg · Hair: blond',
        detailsUrl: 'https://swapi.py4e.com/api/people/1/',
        imageUrl: 'https://starwars-visualguide.com/assets/img/character/1.jpg',
      },
    ]);
  });
});
