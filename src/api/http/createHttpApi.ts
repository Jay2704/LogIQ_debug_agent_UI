import type { LogIQApi } from "@/api/contracts";
import { API_BASE_URL } from "@/api/config";
import { createMockApi } from "@/api/mock/mockApi";
import type {
  CreateJobInput,
  CreateUserInput,
  JiraTicketSearchHit,
  JiraTicketSummary,
  LoginInput,
} from "@/types";
import { logApiDebug } from "./debugLog";
import { joinApiUrl } from "./apiUrl";
import { getAccessToken } from "@/auth/tokenStorage";
import { buildJobDetailBundleFromApiJob } from "./jobDetailMerge";
import {
  parseApiJobJson,
  parseApiJobListJson,
} from "./parseApiJob";
import { parseRcaExplanationJson, parseRcaResultsJson } from "./parseRcaApi";
import {
  parseLoginErrorDetail,
  parseLoginResponse,
  parseUserJson,
  parseUserListJson,
  serializeCreateUserBody,
} from "./parseUserApi";
import {
  parseMcpContextPreviewJson,
  parseMcpStatusJson,
  serializeMcpPreviewBody,
} from "./parseMcpApi";
import { parseInvestigationGraphJson } from "./parseInvestigationGraphApi";
import { parseSimilarInvestigationsJson } from "./parseSimilarInvestigationsApi";
import {
  parseRcaFeedbackSummaryJson,
  serializeRcaFeedbackBody,
} from "./parseRcaFeedbackApi";

/**
 * “Hybrid” HTTP client: real `fetch` calls for backend-supported routes (jobs, RCA, auth, Jira,
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

/**
 * Flat backend ticket payload from GET /api/v1/jira/ticket/:ticket_key.
 */
function parseJiraTicketFlatJson(data: Record<string, unknown>): JiraTicketSummary {
  const ticketKey =
    typeof data.ticket_key === "string" ? data.ticket_key.trim().toUpperCase() : "";
  if (!ticketKey) {
    throw new Error("[LogIQ API] GET /api/v1/jira/ticket/:ticket_key: missing ticket_key");
  }

  const labels = Array.isArray(data.labels)
    ? data.labels.filter((label): label is string => typeof label === "string")
    : [];

  return {
    key: ticketKey,
    summary: typeof data.title === "string" ? data.title : "",
    status:
      typeof data.status === "string" && data.status.trim() ? data.status : "Unknown",
    priority:
      typeof data.priority === "string" && data.priority.trim() ? data.priority : "Unknown",
    labels,
    cleanedDescription: typeof data.description === "string" ? data.description : "",
    extractedHints: [],
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

/**
 * Wraps `fetch` so offline / DNS / CORS failures surface as
 * `[LogIQ API] Network error (no response): …` instead of a raw TypeError.
 * Does not run for HTTP 4xx/5xx — those are handled after `fetch` returns.
 */
async function fetchNetwork(url: string, init?: RequestInit): Promise<Response> {
  const method = init?.method ?? "GET";
  const headers = new Headers(init?.headers);
  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const requestInit: RequestInit = { ...init, headers };
  if (import.meta.env.DEV) {
    console.info("[LogIQ API] request", method, url);
  }
  try {
    const res = await fetch(url, requestInit);
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

export function createHttpApi(): LogIQApi {
  if (!API_BASE_URL) {
    throw new Error("[LogIQ API] createHttpApi requires VITE_API_BASE_URL when HTTP mode is enabled");
  }
  const baseUrl = API_BASE_URL;
  const mocks = createMockApi();

  async function postAuthLogin(input: LoginInput) {
    const url = joinApiUrl(baseUrl, "/api/v1/auth/login");
    if (import.meta.env.DEV) {
      console.info("[LogIQ Auth] login endpoint:", url);
      console.info("[LogIQ Auth] API base URL:", baseUrl);
    }
    logApiDebug("auth/login", { url, email: input.email.trim() });
    const res = await fetchNetwork(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email.trim(),
        password: input.password,
      }),
    });
    const bodyText = await res.text();
    const detail = parseLoginErrorDetail(bodyText);

    if (res.status === 401 || detail.code === "invalid_credentials") {
      throw new Error("[LogIQ API] LOGIN_STATUS 401");
    }
    if (
      res.status === 403 &&
      (detail.code === "email_not_verified" ||
        /email_not_verified|verify your email before logging in/i.test(bodyText))
    ) {
      throw new Error("[LogIQ API] LOGIN_STATUS 403_UNVERIFIED");
    }
    if (
      res.status === 400 ||
      res.status === 404 ||
      detail.code === "user_not_found"
    ) {
      throw new Error("[LogIQ API] LOGIN_STATUS 404");
    }
    if (res.status === 429 || detail.code === "rate_limit_exceeded") {
      throw new Error("[LogIQ API] LOGIN_STATUS 429");
    }
    if (!res.ok) {
      const reason = res.statusText?.trim() || "Error";
      const slice = bodyText.slice(0, 280);
      throw new Error(
        `[LogIQ API] POST /api/v1/auth/login ${res.status} ${reason}${slice ? `: ${slice}` : ""}`
      );
    }
    let json: unknown;
    try {
      json = bodyText.trim() ? (JSON.parse(bodyText) as unknown) : null;
    } catch {
      throw new Error("[LogIQ API] POST /api/v1/auth/login: invalid JSON response");
    }
    if (json === null || json === undefined) {
      throw new Error("[LogIQ API] POST /api/v1/auth/login: empty response body");
    }
    return parseLoginResponse(json);
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
    rca: {
      run: async (anomalyId: string) => {
        const url = joinApiUrl(baseUrl, "/api/v1/rca/run");
        const body = { anomaly_id: anomalyId };
        logApiDebug("rca/run", { url, body });
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) await httpError(res, "POST /api/v1/rca/run");
      },
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
          `/api/v1/jira/ticket/${encodeURIComponent(key)}`
        );
        const res = await fetchNetwork(url);
        console.log("Fetch status:", res.status);
        const json: unknown = await readJsonOrNull(res);
        console.log("Fetched ticket:", json);

        if (res.status !== 200) {
          await httpError(res, "GET /api/v1/jira/ticket/:ticket_key");
        }

        if (!json || typeof json !== "object") {
          throw new Error("[LogIQ API] GET /api/v1/jira/ticket/:ticket_key: invalid JSON payload");
        }

        const data = json as Record<string, unknown>;
        if (typeof data.ticket_key !== "string" || !data.ticket_key.trim()) {
          throw new Error("[LogIQ API] GET /api/v1/jira/ticket/:ticket_key: missing ticket_key");
        }

        return parseJiraTicketFlatJson(data);
      },
      runRcaWithTicket: async ({ ticket, logContent }) => {
        const ticketKey = ticket.key;
        const trimmedLogContent = logContent.trim();
        if (!trimmedLogContent) {
          throw new Error("[LogIQ API] runRcaWithTicket: log_content is empty");
        }
        const url = joinApiUrl(baseUrl, "/api/v1/jira/rca/run");
        const payload = {
          ticket_key: ticketKey,
          ticket: {
            key: ticket.key,
            title: ticket.summary,
            description: ticket.cleanedDescription,
            labels: ticket.labels,
          },
          log_content: trimmedLogContent,
        };
        logApiDebug("jira/rca/run request", {
          url,
          ticketKey,
          logBytes: trimmedLogContent.length,
        });
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) await httpError(res, "POST /api/v1/jira/rca/run");
        const data = (await readJsonOrNull(res)) as Record<string, unknown> | null;
        if (!data || typeof data !== "object") {
          throw new Error("[LogIQ API] POST /api/v1/jira/rca/run: invalid JSON payload");
        }

        const evidence = Array.isArray(data.evidence)
          ? data.evidence.filter((x): x is string => typeof x === "string")
          : Array.isArray(data.evidence_summary)
            ? data.evidence_summary.filter((x): x is string => typeof x === "string")
            : [];

        const extractedLogSignals = Array.isArray(data.extracted_log_signals)
          ? data.extracted_log_signals.filter((x): x is string => typeof x === "string")
          : [];

        const remediationSuggestions = Array.isArray(data.remediation_suggestions)
          ? data.remediation_suggestions.filter((x): x is string => typeof x === "string")
          : Array.isArray(data.remediationSuggestions)
            ? data.remediationSuggestions.filter((x): x is string => typeof x === "string")
            : [];

        return {
          primary_root_cause:
            typeof data.primary_root_cause === "string"
              ? data.primary_root_cause
              : typeof data.root_cause === "string"
                ? data.root_cause
                : "",
          rootCause:
            typeof data.root_cause === "string"
              ? data.root_cause
              : typeof data.primary_root_cause === "string"
                ? data.primary_root_cause
                : "",
          confidence: typeof data.confidence === "number" ? data.confidence : undefined,
          evidenceSummary: evidence,
          extractedLogSignals,
          explanation: typeof data.explanation === "string" ? data.explanation : undefined,
          remediationSuggestions,
        };
      },
    },
    mcp: {
      getStatus: async () => {
        const url = joinApiUrl(baseUrl, "/api/v1/mcp/status");
        const res = await fetchNetwork(url);
        if (!res.ok) await httpError(res, "GET /api/v1/mcp/status");
        const json: unknown = await readJsonOrNull(res);
        return parseMcpStatusJson(json);
      },
      previewContext: async (input) => {
        const ticketKey = input.ticketKey.trim().toUpperCase();
        if (!ticketKey) {
          throw new Error("[LogIQ API] previewContext: ticket_key is required");
        }
        const url = joinApiUrl(baseUrl, "/api/v1/mcp/context/preview");
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serializeMcpPreviewBody({ ...input, ticketKey })),
        });
        if (!res.ok) await httpError(res, "POST /api/v1/mcp/context/preview");
        const json: unknown = await readJsonOrNull(res);
        return parseMcpContextPreviewJson(json);
      },
    },
    investigations: {
      getGraph: async (investigationId: string) => {
        const id = investigationId.trim();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/investigations/${encodeURIComponent(id)}/graph`
        );
        const res = await fetchNetwork(url);
        if (!res.ok) {
          await httpError(res, "GET /api/v1/investigations/:id/graph");
        }
        const json: unknown = await readJsonOrNull(res);
        return parseInvestigationGraphJson(json, id);
      },
      getSimilarIncidents: async (investigationId: string) => {
        const id = investigationId.trim();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/investigations/${encodeURIComponent(id)}/similar`
        );
        const res = await fetchNetwork(url);
        if (!res.ok) {
          await httpError(res, "GET /api/v1/investigations/:id/similar");
        }
        const json: unknown = await readJsonOrNull(res);
        return parseSimilarInvestigationsJson(json, id);
      },
    },
    rcaFeedback: {
      getFeedback: async (jobId: string) => {
        const id = jobId.trim();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/jobs/${encodeURIComponent(id)}/rca/feedback`
        );
        const res = await fetchNetwork(url);
        if (!res.ok) {
          await httpError(res, "GET /api/v1/jobs/:job_id/rca/feedback");
        }
        const json: unknown = await readJsonOrNull(res);
        return parseRcaFeedbackSummaryJson(json, id);
      },
      submitFeedback: async (jobId, input) => {
        const id = jobId.trim();
        const url = joinApiUrl(
          baseUrl,
          `/api/v1/jobs/${encodeURIComponent(id)}/rca/feedback`
        );
        const res = await fetchNetwork(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serializeRcaFeedbackBody(input)),
        });
        if (!res.ok) {
          await httpError(res, "POST /api/v1/jobs/:job_id/rca/feedback");
        }
        const json: unknown = await readJsonOrNull(res);
        return parseRcaFeedbackSummaryJson(json, id);
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
