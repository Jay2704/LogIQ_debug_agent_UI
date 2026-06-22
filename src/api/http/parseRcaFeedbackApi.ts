import type {
  RcaFeedbackAction,
  RcaFeedbackEntry,
  RcaFeedbackSummary,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function parseAction(value: unknown): RcaFeedbackAction | null {
  const action = readString(value).toLowerCase();
  if (action === "confirm" || action === "reject" || action === "override") {
    return action;
  }
  return null;
}

function parseEntryRow(row: unknown): RcaFeedbackEntry | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id);
  const jobId = readString(r.job_id) || readString(r.jobId);
  const action = parseAction(r.action);
  const submittedAt =
    readString(r.submitted_at) || readString(r.submittedAt) || readString(r.created_at);
  if (!id || !jobId || !action || !submittedAt) return null;

  const comment = readString(r.comment) || undefined;
  const submittedBy =
    readString(r.submitted_by) || readString(r.submittedBy) || undefined;

  return { id, jobId, action, comment, submittedAt, submittedBy };
}

export function computeFeedbackRates(history: RcaFeedbackEntry[]): {
  confirmationRate: number;
  rejectionRate: number;
} {
  const confirms = history.filter((entry) => entry.action === "confirm").length;
  const rejects = history.filter((entry) => entry.action === "reject").length;
  const rated = confirms + rejects;
  if (rated === 0) {
    return { confirmationRate: 0, rejectionRate: 0 };
  }
  return {
    confirmationRate: confirms / rated,
    rejectionRate: rejects / rated,
  };
}

export function parseRcaFeedbackSummaryJson(
  json: unknown,
  fallbackJobId: string
): RcaFeedbackSummary {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] RCA feedback: invalid JSON payload");
  }

  const data = json as Record<string, unknown>;
  const jobId = readString(data.job_id) || readString(data.jobId) || fallbackJobId;
  const history = (
    Array.isArray(data.history)
      ? data.history
      : Array.isArray(data.entries)
        ? data.entries
        : []
  )
    .map(parseEntryRow)
    .filter((row): row is RcaFeedbackEntry => row !== null)
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

  const rates = computeFeedbackRates(history);
  const confirmationRate =
    readNumber(data.confirmation_rate) ??
    readNumber(data.confirmationRate) ??
    rates.confirmationRate;
  const rejectionRate =
    readNumber(data.rejection_rate) ??
    readNumber(data.rejectionRate) ??
    rates.rejectionRate;

  return {
    jobId,
    history,
    confirmationRate,
    rejectionRate,
    totalCount:
      readNumber(data.total_count) ??
      readNumber(data.totalCount) ??
      history.length,
  };
}

export function serializeRcaFeedbackBody(input: {
  action: RcaFeedbackAction;
  comment?: string;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = { action: input.action };
  const comment = input.comment?.trim();
  if (comment) {
    payload.comment = comment;
  }
  return payload;
}
