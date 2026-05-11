import { fetchFirstPagePeople, SwapiHttpError } from './swapiPeople';

describe('swapiPeople service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requests base endpoint when search is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    } as Response);

    await fetchFirstPagePeople('   ');

    expect(fetchMock).toHaveBeenCalledWith('https://swapi.py4e.com/api/people/');
  });

  it('requests encoded search query and maps response data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            name: 'Luke Skywalker',
            gender: 'male',
            birth_year: '19BBY',
            height: '172',
            mass: '77',
            hair_color: 'blond',
          },
        ],
      }),
    } as Response);

    const result = await fetchFirstPagePeople(' Luke ');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://swapi.py4e.com/api/people/?search=Luke',
    );
    expect(result).toEqual([
      {
        name: 'Luke Skywalker',
        description:
          'Gender: male · Birth year: 19BBY · Height: 172 cm · Mass: 77 kg · Hair: blond',
      },
    ]);
  });

  it('throws SwapiHttpError with mapped message for 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    await expect(fetchFirstPagePeople('Leia')).rejects.toEqual(
      expect.objectContaining<Partial<SwapiHttpError>>({
        name: 'SwapiHttpError',
        status: 404,
        message: 'No data was found for this request (404).',
      }),
    );
  });

  it('propagates network failures from fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network down'));

    await expect(fetchFirstPagePeople('Han')).rejects.toThrow('Network down');
  });
});
