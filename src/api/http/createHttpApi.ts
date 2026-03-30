import type { LogIQApi } from "@/api/contracts";

function notImplemented(operation: string): never {
  throw new Error(
    `[LogIQ API] HTTP not implemented: ${operation}. Implement fetch calls in createHttpApi or use the mock client.`
  );
}

/**
 * Future HTTP client — must return the same shapes as {@link LogIQApi} (see `@/types`).
 *
 * Suggested mapping (adjust to your OpenAPI):
 * - `jobs.list` → `GET /v1/jobs`
 * - `jobs.getDetailBundle` → `GET /v1/jobs/:id/detail` (or composed resources)
 * - `anomalies.list` → `GET /v1/anomalies`
 * - `rca.getByJobIdMap` → `GET /v1/rca` or per-job endpoints
 * - `reports.*` → `GET /v1/reports`, `GET /v1/reports/by-anomaly/:id`
 * - `insights.getMetrics` → `GET /v1/insights/metrics`
 * - `dashboard.*` → `GET /v1/dashboard/anomaly-activity`, `.../top-root-cause-files`
 */
export function createHttpApi(baseUrl: string): LogIQApi {
  const root = baseUrl.replace(/\/$/, "");

  return {
    jobs: {
      list: async () => notImplemented(`GET ${root}/jobs`),
      getDetailBundle: async (jobId: string) =>
        notImplemented(`GET ${root}/jobs/${jobId}/detail-bundle`),
    },
    anomalies: {
      list: async () => notImplemented(`GET ${root}/anomalies`),
    },
    rca: {
      getByJobIdMap: async () => notImplemented(`GET ${root}/rca/by-job`),
    },
    reports: {
      list: async () => notImplemented(`GET ${root}/reports`),
      getByAnomalyId: async (anomalyId: string) =>
        notImplemented(`GET ${root}/reports?anomalyId=${anomalyId}`),
    },
    insights: {
      getMetrics: async () => notImplemented(`GET ${root}/insights/metrics`),
    },
    dashboard: {
      getAnomalyActivity: async () =>
        notImplemented(`GET ${root}/dashboard/anomaly-activity`),
      getTopRootCauseFiles: async () =>
        notImplemented(`GET ${root}/dashboard/top-root-cause-files`),
    },
  };
}
