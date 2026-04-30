import type { LogIQApi } from "@/api/contracts";
import { createHttpApi } from "@/api/http/createHttpApi";

/**
 * Factory for the active API implementation.
 * - Default: in-memory mock (`src/data/mock/`) — no network, no backend required.
 * - HTTP: when {@link import('./config').USE_HTTP_API} is true, all requests use
 *   {@link import('./config').API_BASE_URL} inside {@link import('./http/createHttpApi').createHttpApi}.
 *
 * Pages and hooks import the singleton {@link api} — not this function — so swapping
 * transports is centralized in `src/api/config.ts` and this file.
 */
export function createApiClient(): LogIQApi {
  return createHttpApi();
}

/** Singleton used across the app */
export const api = createApiClient();
