/**
 * API wiring — swap implementations in {@link createApiClient} when the backend is ready.
 * UI and hooks must only import `api` from `@/api`, never mock fixtures directly.
 */

/** Base URL for REST/WebSocket gateway (set in `.env` when integrating) */
export const API_BASE_URL: string | undefined = import.meta.env.VITE_API_URL;

/**
 * When `true`, use in-memory fixtures. Set `VITE_USE_HTTP=true` (and `VITE_API_URL`) once
 * {@link import('./http/createHttpApi').createHttpApi} is implemented.
 */
export const USE_HTTP_API =
  import.meta.env.VITE_USE_HTTP === "true" && Boolean(API_BASE_URL);
