import { getSwapiCacheTtlSeconds } from './queryConfig';

describe('queryConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns default TTL when env variable is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SWAPI_CACHE_TTL_SECONDS', '');

    expect(getSwapiCacheTtlSeconds()).toBe(300);
  });

  it('returns parsed TTL from env variable', () => {
    vi.stubEnv('NEXT_PUBLIC_SWAPI_CACHE_TTL_SECONDS', '120');

    expect(getSwapiCacheTtlSeconds()).toBe(120);
  });

  it('falls back to default for invalid env value', () => {
    vi.stubEnv('NEXT_PUBLIC_SWAPI_CACHE_TTL_SECONDS', 'invalid');

    expect(getSwapiCacheTtlSeconds()).toBe(300);
  });
});
