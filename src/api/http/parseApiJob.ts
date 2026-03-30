import type { Job, JobStatus, TriggerType } from "@/types";

const JOB_STATUSES: JobStatus[] = [
  "queued",
  "running",
  "completed",
  "failed",
];

const TRIGGER_TYPES: TriggerType[] = [
  "alert",
  "manual",
  "scheduled",
  "api",
  "webhook",
];

function pickString(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/** FastAPI may return numeric ids — coerce for stable URLs and fetches. */
function pickStringOrNumber(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return undefined;
}

function normalizeStatus(raw: string | undefined): JobStatus {
  if (!raw) return "queued";
  const s = raw.toLowerCase().replace(/\s+/g, "_");
  if (JOB_STATUSES.includes(s as JobStatus)) return s as JobStatus;
  if (s === "pending" || s === "queue") return "queued";
  if (s === "in_progress" || s === "active") return "running";
  if (s === "complete" || s === "success" || s === "succeeded")
    return "completed";
  if (s === "fail" || s === "error") return "failed";
  return "queued";
}

export function mapTriggerSource(raw: string | undefined): TriggerType {
  if (!raw) return "manual";
  const t = raw.toLowerCase().replace(/\s+/g, "_");
  if (TRIGGER_TYPES.includes(t as TriggerType)) return t as TriggerType;
  if (t.includes("alert")) return "alert";
  if (t.includes("schedule")) return "scheduled";
  if (t.includes("webhook")) return "webhook";
  if (t.includes("api")) return "api";
  return "manual";
}

/**
 * Some backends wrap a single job as `{ "job": { ... } }` or `{ "data": { ... } }`.
 */
function unwrapJobRowJson(json: unknown): unknown {
  if (!json || typeof json !== "object" || Array.isArray(json)) return json;
  const o = json as Record<string, unknown>;
  const job = o.job;
  if (job && typeof job === "object" && !Array.isArray(job)) {
    return job;
  }
  const data = o.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (
      d.job_id != null ||
      d.jobId != null ||
      d.id != null ||
      d.anomaly_id != null ||
      d.anomalyId != null
    ) {
      return data;
    }
  }
  return json;
}

/**
 * Maps FastAPI `/api/v1/jobs/{id}` JSON (snake_case tolerant) to {@link Job}.
 */
export function parseApiJobJson(json: unknown): Job {
  const row = unwrapJobRowJson(json);
  if (!row || typeof row !== "object") {
    throw new Error("Invalid job response: expected an object");
  }
  const o = row as Record<string, unknown>;

  const canonicalJobId =
    pickStringOrNumber(o, ["job_id", "jobId"]) ??
    pickStringOrNumber(o, ["id"]);
  if (!canonicalJobId) throw new Error("Invalid job response: missing job_id");

  const anomalyId = pickStringOrNumber(o, ["anomaly_id", "anomalyId"]);
  if (!anomalyId) throw new Error("Invalid job response: missing anomaly_id");

  const status = normalizeStatus(pickString(o, ["status", "job_status"]));
  const createdAt =
    pickString(o, ["created_at", "createdAt", "created"]) ??
    new Date().toISOString();

  const triggerRaw = pickString(o, ["trigger_source", "triggerSource"]);
  const trigger = mapTriggerSource(triggerRaw);

  const jobType = pickString(o, ["job_type", "jobType"]);
  const service = pickString(o, ["service", "service_name", "serviceName"]);
  const triggeredByUserId = pickString(o, [
    "triggered_by_user_id",
    "triggeredByUserId",
  ]);
  const userSummary = pickString(o, ["user_summary", "userSummary", "summary"]);

  return {
    jobId: canonicalJobId,
    id: canonicalJobId,
    anomalyId,
    jobType,
    status,
    trigger,
    createdAt,
    service,
    triggeredByUserId,
    triggerSource: triggerRaw ?? undefined,
    userSummary,
  };
}

function tryParseJobItem(json: unknown): Job | undefined {
  try {
    return parseApiJobJson(json);
  } catch {
    return undefined;
  }
}

/**
 * Parses GET /api/v1/jobs payloads: raw array, or `{ jobs }` / `{ items }` / `{ data: [...] }`.
 */
export function parseApiJobListJson(json: unknown): Job[] {
  if (Array.isArray(json)) {
    return json.map(tryParseJobItem).filter((j): j is Job => j !== undefined);
  }
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    const nested = o.data;
    const fromData = Array.isArray(nested)
      ? nested
      : nested && typeof nested === "object"
        ? (nested as Record<string, unknown>).items
        : undefined;
    const raw = o.jobs ?? o.items ?? o.results ?? fromData;
    if (Array.isArray(raw)) {
      return raw.map(tryParseJobItem).filter((j): j is Job => j !== undefined);
    }
  }
  return [];
}
