import type { LogIQApi } from "@/api/contracts";
import { USE_HTTP_API } from "@/api/config";
import { createConferenceDemoApi } from "@/api/demo/createConferenceDemoApi";
import { createHttpApi } from "@/api/http/createHttpApi";
import { createMockApi } from "@/api/mock/mockApi";
import { DEMO_MODE } from "@/lib/demoMode";

let cachedClient: LogIQApi | null = null;
let cachedDemoFlag: boolean | null = null;

/**
 * Factory for the active API implementation.
 * When {@link DEMO_MODE} is enabled, always returns conference fixtures (no network).
 */
export function createApiClient(): LogIQApi {
  if (DEMO_MODE) return createConferenceDemoApi();
  return USE_HTTP_API ? createHttpApi() : createMockApi();
}

/** Resolves the active API client (rebuilt if demo flag changes). */
export function getApi(): LogIQApi {
  if (cachedClient === null || cachedDemoFlag !== DEMO_MODE) {
    cachedClient = createApiClient();
    cachedDemoFlag = DEMO_MODE;
  }
  return cachedClient;
}

/** Lazy proxy — every `api.*` call uses the client for the current mode. */
export const api: LogIQApi = new Proxy({} as LogIQApi, {
  get(_target, prop) {
    const client = getApi();
    return client[prop as keyof LogIQApi];
  },
});
