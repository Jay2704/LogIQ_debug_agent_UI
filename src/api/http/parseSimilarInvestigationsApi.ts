import type {
  SimilarHistoricalInvestigation,
  SimilarInvestigationsResult,
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

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function parseIncidentRow(row: unknown): SimilarHistoricalInvestigation | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;

  const investigationId =
    readString(r.investigation_id) ||
    readString(r.investigationId) ||
    readString(r.id);
  const similarityScore = readNumber(r.similarity_score) ?? readNumber(r.similarityScore);
  if (!investigationId || similarityScore === undefined) return null;

  return {
    investigationId,
    similarityScore,
    rootCause:
      readString(r.root_cause) ||
      readString(r.rootCause) ||
      readString(r.primary_root_cause),
    confidence: readNumber(r.confidence),
    matchedFactors:
      readStringArray(r.matched_factors) || readStringArray(r.matchedFactors),
    resolutionSummary:
      readString(r.resolution_summary) ||
      readString(r.resolutionSummary) ||
      readString(r.summary),
  };
}

export function sortSimilarInvestigations(
  incidents: SimilarHistoricalInvestigation[]
): SimilarHistoricalInvestigation[] {
  return [...incidents].sort((a, b) => b.similarityScore - a.similarityScore);
}

export function parseSimilarInvestigationsJson(
  json: unknown,
  fallbackId: string
): SimilarInvestigationsResult {
  const rows = Array.isArray(json)
    ? json
    : json && typeof json === "object"
      ? Array.isArray((json as Record<string, unknown>).incidents)
        ? ((json as Record<string, unknown>).incidents as unknown[])
        : Array.isArray((json as Record<string, unknown>).similar_incidents)
          ? ((json as Record<string, unknown>).similar_incidents as unknown[])
          : Array.isArray((json as Record<string, unknown>).results)
            ? ((json as Record<string, unknown>).results as unknown[])
            : []
      : [];

  const investigationId =
    json && typeof json === "object"
      ? readString((json as Record<string, unknown>).investigation_id) ||
        readString((json as Record<string, unknown>).investigationId) ||
        fallbackId
      : fallbackId;

  const incidents = sortSimilarInvestigations(
    rows
      .map(parseIncidentRow)
      .filter((row): row is SimilarHistoricalInvestigation => row !== null)
  );

  return { investigationId, incidents };
}
