const DEFAULT_SWAPI_CACHE_TTL_SECONDS = 300;

export function getSwapiCacheTtlSeconds(): number {
  const raw =
    process.env.NEXT_PUBLIC_SWAPI_CACHE_TTL_SECONDS ??
    process.env.VITE_SWAPI_CACHE_TTL_SECONDS;

  if (!raw) {
    return DEFAULT_SWAPI_CACHE_TTL_SECONDS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SWAPI_CACHE_TTL_SECONDS;
  }

  return Math.floor(parsed);
}
