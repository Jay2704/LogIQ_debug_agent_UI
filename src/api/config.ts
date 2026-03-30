/**
 * Environment-driven API mode for this Vite app.
 *
 * **Backend (separate repo)** — create `.env` or `.env.local` in this project root:
 *   `VITE_API_BASE_URL=<backend origin>` (e.g. `https://api.example.com` or your local server URL)
 *   `VITE_USE_HTTP=true`
 *
 * **Deployed frontend** — set the same variables in your host (Vercel/Netlify/CI env):
 *   `VITE_API_BASE_URL=https://api.yourdomain.com` (no path suffix; origin only)
 *   `VITE_USE_HTTP=true`
 *
 * **Mock / offline UI** — omit `VITE_USE_HTTP` or set it to anything other than `true`, or leave
 * the base URL unset. The app uses `src/data/mock/` fixtures via `createApiClient` in `client.ts`.
 *
 * **CORS** — the browser calls the backend origin directly; the API must allow this UI’s origin.
 *
 * UI and hooks must only import `api` from `@/api`, never mock fixtures directly.
 */

/** Non-empty trimmed origin string, trailing slashes removed, or `undefined` if unset/blank. */
function readEnvBaseUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.trim().replace(/\/+$/, "");
  return t.length > 0 ? t : undefined;
}

/**
 * Resolved backend origin (scheme + host [+ port], no path, no trailing slash).
 * Set at build time via Vite env — works for localhost and production hosts alike.
 *
 * - Preferred: `VITE_API_BASE_URL`
 * - Legacy alias: `VITE_API_URL` (used only if `VITE_API_BASE_URL` is unset)
 */
export const API_BASE_URL: string | undefined =
  readEnvBaseUrl(import.meta.env.VITE_API_BASE_URL) ??
  readEnvBaseUrl(import.meta.env.VITE_API_URL);

/**
 * Whether the user explicitly enabled HTTP mode (`VITE_USE_HTTP` truthy, case-insensitive).
 * If `true` but {@link API_BASE_URL} is missing, we still fall back to mocks (see {@link USE_HTTP_API}).
 */
export const HTTP_MODE_FLAG =
  String(import.meta.env.VITE_USE_HTTP ?? "")
    .trim()
    .toLowerCase() === "true";

/**
 * `true` only when both a base URL is configured and HTTP mode is on — then `api` in `client.ts`
 * uses `createHttpApi`. Otherwise the mock client is used.
 *
 * | VITE_USE_HTTP | VITE_API_BASE_URL | Result        |
 * |---------------|-------------------|---------------|
 * | not `true`    | any               | mock          |
 * | `true`        | unset / blank     | mock (safe)   |
 * | `true`        | set               | HTTP client   |
 */
export const USE_HTTP_API = HTTP_MODE_FLAG && Boolean(API_BASE_URL);

/** Convenience: explicit name for “fixtures only” mode. */
export const USE_MOCK_API = !USE_HTTP_API;
