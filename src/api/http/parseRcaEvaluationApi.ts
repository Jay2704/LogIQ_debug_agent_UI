import type {
  RcaCandidateRow,
  RcaConfidenceAccuracyRow,
  RcaConfidenceEvaluation,
  RcaEvaluationSummary,
  RcaEvaluationTrends,
  RcaFeedbackTrendPoint,
  RcaServiceAccuracyResult,
  RcaServiceAccuracyRow,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function parseServiceRow(row: unknown): RcaServiceAccuracyRow | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const service = readString(r.service);
  if (!service) return null;
  return {
    service,
    investigations: readNumber(r.investigations),
    accuracy: readNumber(r.accuracy),
    confirmationRate: readNumber(r.confirmation_rate ?? r.confirmationRate),
    rejectionRate: readNumber(r.rejection_rate ?? r.rejectionRate),
  };
}

function parseConfidenceRow(row: unknown): RcaConfidenceAccuracyRow | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const level = readString(r.level).toLowerCase();
  if (level !== "high" && level !== "medium" && level !== "low") return null;
  return {
    level,
    label: readString(r.label, level),
    accuracy: readNumber(r.accuracy),
    count: readNumber(r.count),
  };
}

function parseTrendPoint(row: unknown): RcaFeedbackTrendPoint | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const date = readString(r.date) || readString(r.day);
  if (!date) return null;
  return {
    date,
    confirms: readNumber(r.confirms ?? r.confirmations),
    rejects: readNumber(r.rejects ?? r.rejections),
    overrides: readNumber(r.overrides),
  };
}

function parseCandidateRow(row: unknown): RcaCandidateRow | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const candidate =
    readString(r.candidate) || readString(r.root_cause) || readString(r.rootCause);
  if (!candidate) return null;
  return {
    candidate,
    count: readNumber(r.count),
    service: readString(r.service) || undefined,
  };
}

export function parseRcaEvaluationSummaryJson(json: unknown): RcaEvaluationSummary {
  const data = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  return {
    totalInvestigations: readNumber(data.total_investigations ?? data.totalInvestigations),
    totalFeedback: readNumber(data.total_feedback ?? data.totalFeedback),
    confirmationRate: readNumber(data.confirmation_rate ?? data.confirmationRate),
    rejectionRate: readNumber(data.rejection_rate ?? data.rejectionRate),
    overrideRate: readNumber(data.override_rate ?? data.overrideRate),
    averageConfidence: readNumber(data.average_confidence ?? data.averageConfidence),
    highConfidenceAccuracy: readNumber(
      data.high_confidence_accuracy ?? data.highConfidenceAccuracy
    ),
  };
}

export function parseRcaServiceAccuracyJson(json: unknown): RcaServiceAccuracyResult {
  const rows = Array.isArray(json)
    ? json
    : json && typeof json === "object"
      ? Array.isArray((json as Record<string, unknown>).services)
        ? ((json as Record<string, unknown>).services as unknown[])
        : []
      : [];

  return {
    services: rows
      .map(parseServiceRow)
      .filter((row): row is RcaServiceAccuracyRow => row !== null),
  };
}

export function parseRcaConfidenceEvaluationJson(json: unknown): RcaConfidenceEvaluation {
  const data = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  const rows = Array.isArray(data.by_level)
    ? data.by_level
    : Array.isArray(data.byLevel)
      ? data.byLevel
      : Array.isArray(data.levels)
        ? data.levels
        : [];

  return {
    byLevel: rows
      .map(parseConfidenceRow)
      .filter((row): row is RcaConfidenceAccuracyRow => row !== null),
    highConfidenceAccuracy: readNumber(
      data.high_confidence_accuracy ?? data.highConfidenceAccuracy
    ),
  };
}

export function parseRcaEvaluationTrendsJson(json: unknown): RcaEvaluationTrends {
  const data = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  const trendRows = Array.isArray(data.feedback_trend)
    ? data.feedback_trend
    : Array.isArray(data.feedbackTrend)
      ? data.feedbackTrend
      : Array.isArray(data.trend)
        ? data.trend
        : [];

  const confirmedRows = Array.isArray(data.most_confirmed_candidates)
    ? data.most_confirmed_candidates
    : Array.isArray(data.mostConfirmedCandidates)
      ? data.mostConfirmedCandidates
      : [];

  const rejectedRows = Array.isArray(data.most_rejected_candidates)
    ? data.most_rejected_candidates
    : Array.isArray(data.mostRejectedCandidates)
      ? data.mostRejectedCandidates
      : [];

  return {
    feedbackTrend: trendRows
      .map(parseTrendPoint)
      .filter((row): row is RcaFeedbackTrendPoint => row !== null),
    mostConfirmedCandidates: confirmedRows
      .map(parseCandidateRow)
      .filter((row): row is RcaCandidateRow => row !== null),
    mostRejectedCandidates: rejectedRows
      .map(parseCandidateRow)
      .filter((row): row is RcaCandidateRow => row !== null),
  };
}
