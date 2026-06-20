import type { LogIQApi } from "@/api/contracts";
import { USE_HTTP_API } from "@/api/config";
import { createHttpApi } from "@/api/http/createHttpApi";
import { createMockApi } from "@/api/mock/mockApi";

let cachedClient: LogIQApi | null = null;

/** Factory for the active API implementation. */
export function createApiClient(): LogIQApi {
  return USE_HTTP_API ? createHttpApi() : createMockApi();
}

/** Resolves the active API client (lazy singleton). */
export function getApi(): LogIQApi {
  if (cachedClient === null) {
    cachedClient = createApiClient();
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
