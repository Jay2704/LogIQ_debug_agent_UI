import type { LogIQApi } from "@/api/contracts";
import { createMockApi } from "@/api/mock/mockApi";
import type {
  CreateJobInput,
  CreateUserInput,
  JiraRcaResult,
  JiraTicketSearchHit,
  JiraTicketSummary,
  LoginInput,
  User,
} from "@/types";
import { logApiDebug } from "./debugLog";
import { joinApiUrl } from "./apiUrl";
import { buildJobDetailBundleFromApiJob } from "./jobDetailMerge";
import {
  parseApiJobJson,
  parseApiJobListJson,
} from "./parseApiJob";
import { parseRcaExplanationJson, parseRcaResultsJson } from "./parseRcaApi";
import {
  parseUserJson,
  parseUserListJson,
  serializeCreateUserBody,
} from "./parseUserApi";

/**
 * “Hybrid” HTTP client: real `fetch` calls for backend-supported routes (jobs, RCA, debug-agent,
 * users), while anomalies, reports, insights, dashboard, and utilities delegate to the in-memory
 * mock implementation until those APIs exist — keeps Insights/Reports/Utilities pages working
 * in HTTP mode.
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
  const slice = detail.slice(0, 280);
  /** Some environments omit `statusText`; keep a non-empty token so clients can parse `POST … {status} … : body`. */
  const reason = res.statusText?.trim() || "Error";
  const suffix = slice.length > 0 ? `: ${slice}` : "";
  throw new Error(`[LogIQ API] ${label} ${res.status} ${reason}${suffix}`);
}

function parseJiraTicketSummaryJson(json: unknown): JiraTicketSummary {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] GET /api/v1/jira/tickets/:key: invalid JSON payload");
  }
  const row = json as Record<string, unknown>;
  const labels = Array.isArray(row.labels)
    ? row.labels.filter((x): x is string => typeof x === "string")
    : [];
  const extractedHints = Array.isArray(row.extracted_hints)
    ? row.extracted_hints.filter((x): x is string => typeof x === "string")
    : [];
  return {
    key: typeof row.key === "string" ? row.key : "",
    summary: typeof row.summary === "string" ? row.summary : "",
    status: typeof row.status === "string" ? row.status : "Unknown",
    priority: typeof row.priority === "string" ? row.priority : "Unknown",
    labels,
    cleanedDescription:
      typeof row.cleaned_description === "string" ? row.cleaned_description : "",
    extractedHints,
  };
}

function parseJiraSearchHitRow(row: unknown): JiraTicketSearchHit | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const rawKey = typeof r.key === "string" ? r.key.trim() : "";
  if (!rawKey) return null;
  const updatedAt =
    typeof r.updated_at === "string"
      ? r.updated_at
      : typeof r.updatedAt === "string"
        ? r.updatedAt
        : typeof r.updated === "string"
          ? r.updated
          : undefined;
  return {
    key: rawKey.toUpperCase(),
    summary: typeof r.summary === "string" ? r.summary : "",
    status: typeof r.status === "string" ? r.status : "Unknown",
    priority: typeof r.priority === "string" ? r.priority : "Unknown",
    updatedAt,
  };
}

function parseJiraSearchHitsJson(json: unknown): JiraTicketSearchHit[] {
  const raw: unknown[] = Array.isArray(json)
    ? json
    : json && typeof json === "object" && Array.isArray((json as Record<string, unknown>).items)
      ? ((json as Record<string, unknown>).items as unknown[])
      : json && typeof json === "object" && Array.isArray((json as Record<string, unknown>).tickets)
        ? ((json as Record<string, unknown>).tickets as unknown[])
        : [];
  return raw.map(parseJiraSearchHitRow).filter((x): x is JiraTicketSearchHit => x !== null);
}

function parseJiraRcaResultJson(json: unknown): JiraRcaResult {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] POST /api/v1/jira/rca: invalid JSON payload");
  }
  const row = json as Record<string, unknown>;
  const evidenceSummary = Array.isArray(row.evidence_summary)
    ? row.evidence_summary.filter((x): x is string => typeof x === "string")
    : [];
  const extractedLogSignals = Array.isArray(row.extracted_log_signals)
    ? row.extracted_log_signals.filter((x): x is string => typeof x === "string")
    : [];
  const remediationSuggestions = Array.isArray(row.remediation_suggestions)
    ? row.remediation_suggestions.filter((x): x is string => typeof x === "string")
    : Array.isArray(row.remediation)
      ? row.remediation.filter((x): x is string => typeof x === "string")
      : [];
  const confidenceRaw =
    typeof row.confidence === "number"
      ? row.confidence
      : typeof row.confidence_score === "number"
        ? row.confidence_score
        : undefined;
  return {
    rootCause:
      typeof row.root_cause === "string"
        ? row.root_cause
        : typeof row.rootCause === "string"
          ? row.rootCause
          : "Root cause not returned by backend.",
    evidenceSummary,
    extractedLogSignals,
    confidence:
      typeof confidenceRaw === "number"
        ? confidenceRaw > 1
          ? Math.max(0, Math.min(1, confidenceRaw / 100))
          : Math.max(0, Math.min(1, confidenceRaw))
        : undefined,
    explanation:
      typeof row.explanation === "string"
        ? row.explanation
        : typeof row.summary === "string"
          ? row.summary
          : undefined,
    remediationSuggestions,
  };
}

/**
 * Wraps `fetch` so offline / DNS / CORS failures surface as
 * `[LogIQ API] Network error (no response): …` instead of a raw TypeError.
 * Does not run for HTTP 4xx/5xx — those are handled after `fetch` returns.
 */
async function fetchNetwork(url: string, init?: RequestInit): Promise<Response> {
  const method = init?.method ?? "GET";
  if (import.meta.env.DEV) {
    console.info("[LogIQ API] request", method, url);
  }
  try {
    const res = await fetch(url, init);
    if (import.meta.env.DEV && !res.ok) {
      const text = await res.clone().text().catch(() => "");
      console.warn("[LogIQ API] response error", {
        url,
        method,
        status: res.status,
        statusText: res.statusText,
        bodyPreview: text.slice(0, 500),
      });
    }
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    const browserMsg = msg.toLowerCase();
    const likelyCorsOrUnreachable =
      browserMsg.includes("failed to fetch") ||
      browserMsg.includes("load failed") ||
      browserMsg.includes("networkerror when attempting to fetch");
    if (import.meta.env.DEV) {
      console.warn("[LogIQ API] fetch failed (no HTTP response)", {
        url,
        method,
        errorType: e instanceof Error ? e.name : typeof e,
        message: msg,
        likelyCorsOrUnreachable,
      });
    }
    throw new Error(`[LogIQ API] Network error (no response): ${msg}`);
  }
}

export function createHttpApi(baseUrl: string): LogIQApi {
  const mocks = createMockApi();

  async function postAuthLogin(input: LoginInput): Promise<User> {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/login");
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email.trim(),
        password: input.password,
      }),
    });
    if (res.status === 401) {
      throw new Error("[LogIQ API] LOGIN_STATUS 401");
    }
    if (res.status === 403) {
      const text = await res.text();
      let code: string | undefined;
      try {
        const j = JSON.parse(text) as { code?: unknown };
        if (typeof j.code === "string") code = j.code;
      } catch {
        /* non-JSON body */
      }
      const isEmailNotVerified =
        code === "email_not_verified" ||
        /email_not_verified/i.test(text) ||
        /verify your email before logging in/i.test(text);
      if (isEmailNotVerified) {
        throw new Error("[LogIQ API] LOGIN_STATUS 403_UNVERIFIED");
      }
      const reason = res.statusText?.trim() || "Error";
      const slice = text.slice(0, 280);
      throw new Error(
        `[LogIQ API] POST /api/v1/auth/login 403 ${reason}${slice ? `: ${slice}` : ""}`
      );
    }
    if (res.status === 404) {
      throw new Error("[LogIQ API] LOGIN_STATUS 404");
    }
    if (!res.ok) await httpError(res, "POST /api/v1/auth/login");
    const json: unknown = await readJsonOrNull(res);
    if (json === null || json === undefined) {
      throw new Error("[LogIQ API] POST /api/v1/auth/login: empty response body");
    }
    return parseUserJson(json);
  }

  async function postVerifyEmail(token: string): Promise<void> {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/verify-email");
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim() }),
    });
    if (!res.ok) await httpError(res, "POST /api/v1/auth/verify-email");
  }

  async function postForgotPassword(email: string): Promise<void> {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/forgot-password");
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (res.ok || res.status === 404) return;
    await httpError(res, "POST /api/v1/auth/forgot-password");
  }

  async function postResetPassword(token: string, password: string): Promise<void> {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/reset-password");
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.trim(), password }),
    });
    if (!res.ok) await httpError(res, "POST /api/v1/auth/reset-password");
  }

  async function postResendVerification(email: string): Promise<void> {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/resend-verification");
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!res.ok) await httpError(res, "POST /api/v1/auth/resend-verification");
  }

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
    jira: {
      searchTickets: async (query: string) => {
        const q = query.trim();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/jira/tickets/search?q=${encodeURIComponent(q)}`
        );
        const res = await fetchNetwork(url);
        if (!res.ok) await httpError(res, "GET /api/v1/jira/tickets/search");
        const json: unknown = await readJsonOrNull(res);
        return parseJiraSearchHitsJson(json);
      },
      getTicketSummary: async (ticketKey: string) => {
        const key = ticketKey.trim().toUpperCase();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/jira/tickets/${encodeURIComponent(key)}`
        );
        const res = await fetchNetwork(url);
        if (!res.ok) await httpError(res, "GET /api/v1/jira/tickets/:key");
        const json: unknown = await readJsonOrNull(res);
        return parseJiraTicketSummaryJson(json);
      },
      runRcaWithTicket: async ({ ticket, logContent }) => {
        const url = joinApiUrl(baseUrl, "/api/v1/jira/rca");
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticket_key: ticket.key,
            ticket_summary: ticket.summary,
            ticket_status: ticket.status,
            ticket_priority: ticket.priority,
            extracted_hints: ticket.extractedHints,
            log_content: logContent,
          }),
        });
        if (!res.ok) await httpError(res, "POST /api/v1/jira/rca");
        const json: unknown = await readJsonOrNull(res);
        return parseJiraRcaResultJson(json);
      },
    },
    auth: {
      login: postAuthLogin,
      verifyEmail: postVerifyEmail,
      forgotPassword: postForgotPassword,
      resetPassword: postResetPassword,
      resendVerificationEmail: postResendVerification,
    },
    users: {
      create: async (input: CreateUserInput) => {
        const url = joinApiUrl(baseUrl, "/api/v1/users");
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serializeCreateUserBody(input)),
        });
        if (import.meta.env.DEV && !res.ok) {
          const peek = await res.clone().text().catch(() => "");
          console.warn("[LogIQ API] signup POST /api/v1/users", {
            url,
            status: res.status,
            statusText: res.statusText,
            bodyPreview: peek.slice(0, 500),
          });
        }
        if (!res.ok) await httpError(res, "POST /api/v1/users");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) {
          throw new Error("[LogIQ API] POST /api/v1/users: empty response body");
        }
        return parseUserJson(json);
      },
      getUserById: async (userId: string) => {
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/users/${encodeURIComponent(userId)}`
        );
        const res = await fetchNetwork(url);
        if (res.status === 404) return undefined;
        if (!res.ok) await httpError(res, "GET /api/v1/users/:id");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) return undefined;
        return parseUserJson(json);
      },
      getUserByEmail: async (email: string) => {
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/users/by-email/${encodeURIComponent(email.trim())}`
        );
        const res = await fetchNetwork(url);
        if (res.status === 404) return undefined;
        if (!res.ok) await httpError(res, "GET /api/v1/users/by-email/:email");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) return undefined;
        return parseUserJson(json);
      },
      listUsers: async () => {
        const url = joinApiUrl(baseUrl, "/api/v1/users");
        const res = await fetchNetwork(url);
        if (!res.ok) await httpError(res, "GET /api/v1/users");
        const json: unknown = await readJsonOrNull(res);
        if (json === null || json === undefined) return [];
        return parseUserListJson(json);
      },
    },
  };
}
