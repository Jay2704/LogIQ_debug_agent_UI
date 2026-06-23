import type {
  InvestigationReport,
  InvestigationReportFeedbackEntry,
  InvestigationReportMultiAgentFinding,
  InvestigationReportRunbook,
  InvestigationReportSimilarIncident,
  EvidenceCoverage,
  EvidenceCoverageLevel,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseSimilarIncident(row: unknown): InvestigationReportSimilarIncident | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id) || readString(r.investigation_id);
  const title = readString(r.title) || readString(r.name);
  if (!id && !title) return null;
  return {
    id: id || title,
    title: title || id,
    service: readString(r.service),
    overlap: readString(r.overlap) || readString(r.summary),
  };
}

function parseFeedbackEntry(row: unknown): InvestigationReportFeedbackEntry | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const action = readString(r.action);
  const submittedAt =
    readString(r.submitted_at) || readString(r.submittedAt) || readString(r.timestamp);
  if (!action || !submittedAt) return null;
  return {
    action,
    comment: readString(r.comment) || undefined,
    submittedAt,
    submittedBy:
      readString(r.submitted_by) || readString(r.submittedBy) || undefined,
  };
}

function parseMultiAgentFinding(
  row: unknown
): InvestigationReportMultiAgentFinding | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const agent = readString(r.agent) || readString(r.agent_label) || readString(r.label);
  const summary =
    readString(r.summary) || readString(r.finding) || readString(r.title);
  if (!agent || !summary) return null;
  return {
    agent,
    summary,
    confidence: readNumber(r.confidence),
  };
}

function parseRunbook(row: unknown): InvestigationReportRunbook | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id) || readString(r.runbook_id);
  const title = readString(r.title);
  if (!id && !title) return null;
  return {
    id: id || title,
    title: title || id,
    summary: readString(r.summary) || readString(r.description),
  };
}

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseCoverageLevel(value: string): EvidenceCoverageLevel {
  const normalized = value.trim().toLowerCase();
  if (normalized === "high") return "high";
  if (normalized === "good") return "good";
  if (normalized === "partial") return "partial";
  return "low";
}

function parseEvidenceCoverage(row: unknown): EvidenceCoverage | undefined {
  if (!row || typeof row !== "object") return undefined;
  const r = row as Record<string, unknown>;
  const availableRaw = r.available_sources ?? r.availableSources;
  const missingRaw = r.missing_sources ?? r.missingSources;
  const availableSources = Array.isArray(availableRaw)
    ? availableRaw.filter((item): item is string => typeof item === "string")
    : [];
  const missingSources = Array.isArray(missingRaw)
    ? missingRaw.filter((item): item is string => typeof item === "string")
    : [];
  const levelRaw = readString(r.level, "low");
  return {
    coveragePercent: readNumber(r.coverage_percent ?? r.coveragePercent),
    level: parseCoverageLevel(levelRaw),
    availableSources,
    missingSources,
    confidenceLimitations:
      readString(r.confidence_limitations) ||
      readString(r.confidenceLimitations) ||
      "",
  };
}

export function parseInvestigationReportJson(
  json: unknown,
  investigationId: string
): InvestigationReport {
  if (!json || typeof json !== "object") {
    return {
      investigationId,
      generatedAt: new Date().toISOString(),
      executiveSummary: "",
      timelineSummary: "",
      rootCause: "",
      confidence: 0,
      similarIncidents: [],
      feedbackHistory: [],
      multiAgentFindings: [],
      runbooks: [],
      recommendedActions: [],
    };
  }

  const r = json as Record<string, unknown>;
  const similarRaw = r.similar_incidents ?? r.similarIncidents;
  const feedbackRaw = r.feedback_history ?? r.feedbackHistory;
  const multiAgentRaw = r.multi_agent_findings ?? r.multiAgentFindings;
  const runbooksRaw = r.runbooks;
  const actionsRaw = r.recommended_actions ?? r.recommendedActions;

  return {
    investigationId:
      readString(r.investigation_id, investigationId) || investigationId,
    generatedAt:
      readString(r.generated_at) ||
      readString(r.generatedAt) ||
      new Date().toISOString(),
    executiveSummary:
      readString(r.executive_summary) || readString(r.executiveSummary),
    timelineSummary:
      readString(r.timeline_summary) || readString(r.timelineSummary),
    rootCause:
      readString(r.root_cause) ||
      readString(r.rootCause) ||
      readString(r.primary_root_cause),
    confidence: readNumber(r.confidence),
    confidenceNote:
      readString(r.confidence_note) || readString(r.confidenceNote) || undefined,
    similarIncidents: Array.isArray(similarRaw)
      ? similarRaw
          .map(parseSimilarIncident)
          .filter((item): item is InvestigationReportSimilarIncident => item !== null)
      : [],
    feedbackHistory: Array.isArray(feedbackRaw)
      ? feedbackRaw
          .map(parseFeedbackEntry)
          .filter((item): item is InvestigationReportFeedbackEntry => item !== null)
      : [],
    multiAgentFindings: Array.isArray(multiAgentRaw)
      ? multiAgentRaw
          .map(parseMultiAgentFinding)
          .filter((item): item is InvestigationReportMultiAgentFinding => item !== null)
      : [],
    runbooks: Array.isArray(runbooksRaw)
      ? runbooksRaw
          .map(parseRunbook)
          .filter((item): item is InvestigationReportRunbook => item !== null)
      : [],
    recommendedActions: parseStringArray(actionsRaw),
    evidenceCoverage: parseEvidenceCoverage(r.evidence_coverage ?? r.evidenceCoverage),
  };
}
