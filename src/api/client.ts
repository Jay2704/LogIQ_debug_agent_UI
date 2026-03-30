import type { LogIQApi } from "@/api/contracts";
import { createMockApi } from "@/api/mock/mockApi";

/**
 * Active API client. Uses local mock fixtures. When the backend exists, prefer
 * `createHttpApi` from `@/api/http/createHttpApi` behind `VITE_API_URL` (or your
 * own env flag) without changing page components — only this factory.
 */
export function createApiClient(): LogIQApi {
  return createMockApi();
}

export const api = createApiClient();
