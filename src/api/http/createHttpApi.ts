import type { LogIQApi } from "@/api/contracts";
import { createMockApi } from "@/api/mock/mockApi";
import type { CreateJobInput } from "@/types";
import { logApiDebug } from "./debugLog";
import { joinApiUrl } from "./apiUrl";
import { buildJobDetailBundleFromApiJob } from "./jobDetailMerge";
import {
  parseApiJobJson,
  parseApiJobListJson,
} from "./parseApiJob";
import { parseRcaExplanationJson, parseRcaResultsJson } from "./parseRcaApi";

/**
 * “Hybrid” HTTP client: real `fetch` calls for backend-supported routes, while anomalies,
 * reports, insights, dashboard, and utilities delegate to the in-memory mock implementation
 * until those APIs exist — keeps Insights/Reports/Utilities pages working in HTTP mode.
 *
 * All request URLs use {@link joinApiUrl} with the configured origin (`VITE_API_BASE_URL`).
 */

async function readJsonOrNull(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function httpError(res: Response, label: string): Promise<never> {
  const detail = await res.text().catch(() => "");
  throw new Error(
    `[LogIQ API] ${label} ${res.status} ${res.statusText}${detail ? `: ${detail.slice(0, 280)}` : ""}`
  );
}

/** Wraps `fetch` so offline / DNS failures surface as `[LogIQ API] Network error` instead of raw TypeError. */
async function fetchNetwork(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`[LogIQ API] Network error (no response): ${msg}`);
  }
}

export function createHttpApi(baseUrl: string): LogIQApi {
  const mocks = createMockApi();

  return {
    jobs: {
      list: async () => {
        const url = joinApiUrl(baseUrl, "/api/v1/jobs");
        const res = await fetchNetwork(url);
        if (!res.ok) await httpError(res, "GET /api/v1/jobs");
        const json: unknown = await readJsonOrNull(res);
        return parseApiJobListJson(json);
      },
      getDetailBundle: async (jobId: string) => {
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/jobs/${encodeURIComponent(jobId)}`
        );
        logApiDebug("job detail fetch", { routeJobId: jobId, url });
        const res = await fetchNetwork(url);
        if (res.status === 404) return undefined;
        if (!res.ok) await httpError(res, "GET job");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) {
          logApiDebug("job detail empty body", { routeJobId: jobId });
          return undefined;
        }
        const apiJob = parseApiJobJson(json);
        return buildJobDetailBundleFromApiJob(apiJob, jobId);
      },
      create: async (input: CreateJobInput) => {
        const url = joinApiUrl(baseUrl, "/api/v1/jobs");
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_type: input.jobType,
            anomaly_id: input.anomalyId,
            run_id: input.runId,
            triggered_by_user_id: input.triggeredByUserId,
            trigger_source: input.triggerSource,
          }),
        });
        if (!res.ok) await httpError(res, "POST /api/v1/jobs");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) {
          throw new Error("[LogIQ API] POST /api/v1/jobs: empty response body");
        }
        return parseApiJobJson(json);
      },
    },
    anomalies: mocks.anomalies,
    debugAgent: {
      run: async (anomalyId: string) => {
        const url = joinApiUrl(baseUrl, "/debug-agent/run");
        const body = { anomaly_id: anomalyId };
        logApiDebug("debug-agent/run", { url, body });
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) await httpError(res, "POST /debug-agent/run");
      },
    },
    rca: {
      getByJobIdMap: () => mocks.rca.getByJobIdMap(),
      getResultsByAnomalyId: async (anomalyId: string, jobId: string) => {
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/rca/results/${encodeURIComponent(anomalyId)}`
        );
        logApiDebug("rca/results fetch", { anomalyId, jobId, url });
        const res = await fetchNetwork(url);
        if (res.status === 404) {
          logApiDebug("rca/results 404", { anomalyId });
          return null;
        }
        if (!res.ok) await httpError(res, "GET rca/results");
        const json = await readJsonOrNull(res);
        const parsed = parseRcaResultsJson(json, jobId);
        logApiDebug("rca/results parsed", { anomalyId, hasCandidate: parsed !== null });
        return parsed;
      },
      getExplanationByAnomalyId: async (anomalyId: string) => {
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/rca/explanation/${encodeURIComponent(anomalyId)}`
        );
        logApiDebug("rca/explanation fetch", { anomalyId, url });
        const res = await fetchNetwork(url);
        if (res.status === 404) {
          logApiDebug("rca/explanation 404 — empty assistive fallback", {
            anomalyId,
          });
          return parseRcaExplanationJson(null);
        }
        if (!res.ok) await httpError(res, "GET rca/explanation");
        const json = await readJsonOrNull(res);
        return parseRcaExplanationJson(json);
      },
    },
    reports: mocks.reports,
    insights: mocks.insights,
    dashboard: mocks.dashboard,
    utilities: mocks.utilities,
  };
}
