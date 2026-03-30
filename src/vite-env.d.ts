/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Backend API origin only (scheme + host + optional port). No path segment.
   * Set via env — e.g. deployed `https://api.example.com` or your local backend URL.
   */
  readonly VITE_API_BASE_URL?: string;
  /** Legacy alias for `VITE_API_BASE_URL` when the new name is unset. */
  readonly VITE_API_URL?: string;
  /**
   * Must be the string `true` (case-insensitive, trimmed) to enable HTTP; also requires
   * `VITE_API_BASE_URL` / `VITE_API_URL`. Otherwise the app uses in-memory mocks.
   */
  readonly VITE_USE_HTTP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
