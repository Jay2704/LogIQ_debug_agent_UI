import type { LogIQApi } from "@/api/contracts";

/**
 * Placeholder for a real HTTP client. Implement with `fetch` (or your HTTP
 * library) returning the same shapes as {@link LogIQApi}.
 *
 * Then switch {@link createApiClient} in `client.ts`, e.g. when
 * `import.meta.env.VITE_API_URL` is set:
 *
 * ```ts
 * if (import.meta.env.VITE_API_URL) {
 *   return createHttpApi(import.meta.env.VITE_API_URL);
 * }
 * ```
 */
export function createHttpApi(_baseUrl: string): LogIQApi {
  void _baseUrl;
  throw new Error(
    "createHttpApi is not implemented — use the mock client until the backend is ready."
  );
}
