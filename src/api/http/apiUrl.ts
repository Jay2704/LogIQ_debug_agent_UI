/**
 * Builds an absolute request URL from the configured API origin.
 * All HTTP traffic must go through this helper so nothing hardcodes a host.
 *
 * @param baseUrl - Same value as {@link import('../config').API_BASE_URL} (no trailing slash).
 * @param path - Path beginning with `/` (e.g. `/api/v1/jobs`).
 */
export function joinApiUrl(baseUrl: string, path: string): string {
  const root = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${root}${p}`;
}
