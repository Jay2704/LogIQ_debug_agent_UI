/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Set to `"true"` with `VITE_API_URL` to use {@link import('./api/http/createHttpApi').createHttpApi} */
  readonly VITE_USE_HTTP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
