/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SWAPI_CACHE_TTL_SECONDS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
