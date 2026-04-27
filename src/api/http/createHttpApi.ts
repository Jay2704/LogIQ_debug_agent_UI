import type { LogIQApi } from "@/api/contracts";
import { createMockApi } from "@/api/mock/mockApi";
import type {
  CreateJobInput,
  CreateUserInput,
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

const BASE_URL = "http://localhost:8000";
const EXPLICIT_API_ORIGIN = BASE_URL.replace(/\/+$/, "");

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

/**
 * Backend may return a flat ticket object or `{ ticket: { ticket_key, summary, description, ... }, hints: [...] }`.
 * Normalize to {@link JiraTicketSummary} in one place so the dashboard shows real priority and description.
 */
function parseJiraTicketSummaryJson(json: unknown): JiraTicketSummary {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] GET /api/v1/jira/tickets/:key: invalid JSON payload");
  }
  const root = json as Record<string, unknown>;
  const nested =
    root.ticket && typeof root.ticket === "object"
      ? (root.ticket as Record<string, unknown>)
      : null;
  const t = nested ?? root;

  const labels = Array.isArray(t.labels)
    ? t.labels.filter((x): x is string => typeof x === "string")
    : Array.isArray(root.labels)
      ? root.labels.filter((x): x is string => typeof x === "string")
      : [];

  const hintsFromRoot = Array.isArray(root.hints)
    ? root.hints.filter((x): x is string => typeof x === "string")
    : [];
  const hintsFromTicket = Array.isArray(t.extracted_hints)
    ? t.extracted_hints.filter((x): x is string => typeof x === "string")
    : [];
  const hintsFromRootLegacy = Array.isArray(root.extracted_hints)
    ? root.extracted_hints.filter((x): x is string => typeof x === "string")
    : [];
  const extractedHints =
    hintsFromRoot.length > 0
      ? hintsFromRoot
      : hintsFromTicket.length > 0
        ? hintsFromTicket
        : hintsFromRootLegacy;

  const str = (v: unknown) => (typeof v === "string" ? v : "");

  const key =
    str(t.ticket_key).trim() ||
    str(t.key).trim() ||
    str(root.key).trim() ||
    "";

  const summary = str(t.summary) || str(root.summary);

  const statusRaw = str(t.status) || str(root.status);
  const status = statusRaw.trim() ? statusRaw : "Unknown";

  const priorityRaw = str(t.priority) || str(root.priority);
  const priority = priorityRaw.trim() ? priorityRaw : "Unknown";

  const cleanedDescription =
    str(t.cleaned_description) ||
    str(t.description) ||
    str(root.cleaned_description) ||
    str(root.description);

  return {
    key,
    summary,
    status,
    priority,
    labels,
    cleanedDescription,
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

export function createHttpApi(_baseUrl: string): LogIQApi {
  const baseUrl = EXPLICIT_API_ORIGIN;
  const mocks = createMockApi();

  async function postAuthLogin(input: LoginInput): Promise<User> {
    const url = `${baseUrl}/api/v1/auth/login`;
    console.log("Login API URL:", `${baseUrl}/api/v1/auth/login`);
    const res = await fetch(url, {
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
        const ticketKey = ticket.key;
        const trimmedLogContent = logContent.trim();
        if (!trimmedLogContent) {
          throw new Error("[LogIQ API] runRcaWithTicket: log_content is empty");
        }
        const url = `${baseUrl}/api/v1/jira/rca/run`;
        const payload = {
          ticket_key: ticketKey,
          ticket_summary: ticket.summary,
          ticket_status: ticket.status,
          ticket_priority: ticket.priority,
          extracted_hints: ticket.extractedHints,
          log_content: trimmedLogContent,
        };
        console.log("FINAL URL:", `${baseUrl}/api/v1/jira/rca/run`);
        console.log("Payload length:", trimmedLogContent.length);
        console.log("[LogIQ API] runRcaWithTicket request", {
          finalUrl: `${baseUrl}/api/v1/jira/rca/run`,
          payloadKeys: Object.keys(payload),
        });
        const finalUrl = url;
        const options: RequestInit = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        };

        try {
          const response = await fetch(finalUrl, options);

          const rawText = await response.text();
          console.log("RAW BACKEND RESPONSE:", rawText);

          if (!response.ok) {
            throw new Error(rawText);
          }

          const data = JSON.parse(rawText) as Record<string, unknown>;
          console.log("RCA API RESPONSE:", data);

          const evidence = Array.isArray(data.evidence)
            ? data.evidence.filter((x): x is string => typeof x === "string")
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
            extractedLogSignals: [],
            explanation: typeof data.explanation === "string" ? data.explanation : undefined,
            remediationSuggestions: [],
          };
        } catch (err) {
          console.error("FULL RCA ERROR:", err);
          const message = err instanceof Error ? err.message : String(err);
          alert("RCA failed: " + message);
          throw err;
        }
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
