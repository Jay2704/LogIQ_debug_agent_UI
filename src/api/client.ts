import type { LogIQApi } from "@/api/contracts";
import { USE_HTTP_API, API_BASE_URL } from "@/api/config";
import { createHttpApi } from "@/api/http/createHttpApi";
import { createMockApi } from "@/api/mock/mockApi";

/**
 * Factory for the active API implementation.
 * - Default: in-memory mock (fixtures under `src/data/mock/`).
 * - When `VITE_USE_HTTP=true` and `VITE_API_URL` is set: HTTP client (implement `createHttpApi` first).
 *
 * Pages and hooks import the singleton {@link api} — not this function — so swapping
 * transports is a one-line change here.
 */
export function createApiClient(): LogIQApi {
  if (USE_HTTP_API && API_BASE_URL) {
    return createHttpApi(API_BASE_URL);
  }
  return createMockApi();
}

/** Singleton used across the app */
export const api = createApiClient();
