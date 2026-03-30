import type { LogIQApi } from "@/api/contracts";
import { USE_HTTP_API, API_BASE_URL } from "@/api/config";
import { createHttpApi } from "@/api/http/createHttpApi";
import { createMockApi } from "@/api/mock/mockApi";

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
  if (USE_HTTP_API && API_BASE_URL) {
    return createHttpApi(API_BASE_URL);
  }
  return createMockApi();
}

/** Singleton used across the app */
export const api = createApiClient();
