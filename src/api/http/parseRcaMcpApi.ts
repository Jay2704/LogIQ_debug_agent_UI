import { MCP_SIGNAL_KEYS } from "@/types";
import type {
  McpArtifactRefs,
  McpGitHubArtifactRef,
  McpJiraArtifactRef,
  McpSignalKey,
  RcaMcpInvestigationContext,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => (typeof row === "string" ? row.trim() : String(row)))
    .filter(Boolean);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function parseSignalScores(value: unknown): Partial<Record<McpSignalKey, number>> {
  const row = asRecord(value);
  if (!row) return {};

  const scores: Partial<Record<McpSignalKey, number>> = {};
  for (const key of MCP_SIGNAL_KEYS) {
    const score = readNumber(row[key]);
    if (score !== undefined) scores[key] = score;
  }
  return scores;
}

function parseJiraArtifact(value: unknown): McpJiraArtifactRef | undefined {
  const row = asRecord(value);
  if (!row) return undefined;

  const ticketKey =
    readString(row.ticket_key) ||
    readString(row.ticketKey) ||
    readString(row.key);
  if (!ticketKey) return undefined;

  return {
    ticketKey,
    summary: readString(row.summary) || readString(row.title) || undefined,
    labels: readStringArray(row.labels),
    status: readString(row.status) || undefined,
  };
}

function parseGitHubArtifact(value: unknown): McpGitHubArtifactRef | undefined {
  const row = asRecord(value);
  if (!row) return undefined;

  const pullRequestNumber =
    readNumber(row.pull_request_number) ??
    readNumber(row.pullRequestNumber) ??
    readNumber(row.pr_number) ??
    readNumber(row.number);

  const changedFiles = readStringArray(
    row.changed_files ?? row.changedFiles ?? row.files
  );

  if (
    pullRequestNumber === undefined &&
    !changedFiles.length &&
    !readString(row.commit_sha) &&
    !readString(row.commitSha)
  ) {
    return undefined;
  }

  return {
    pullRequestNumber,
    pullRequestTitle:
      readString(row.pull_request_title) ||
      readString(row.pullRequestTitle) ||
      readString(row.title) ||
      undefined,
    changedFiles: changedFiles.length ? changedFiles : undefined,
    commitSha: readString(row.commit_sha) || readString(row.commitSha) || undefined,
    repository: readString(row.repository) || readString(row.repo) || undefined,
  };
}

function parseArtifactRefs(value: unknown): McpArtifactRefs {
  const row = asRecord(value);
  if (!row) return {};

  const jira = parseJiraArtifact(row.jira ?? row.jira_ticket ?? row.ticket);
  const github = parseGitHubArtifact(row.github ?? row.pull_request ?? row.pr);

  return {
    ...(jira ? { jira } : {}),
    ...(github ? { github } : {}),
  };
}

function parseContextSummary(value: unknown): RcaMcpInvestigationContext["mcpContextSummary"] {
  if (typeof value === "string" && value.trim()) {
    return { text: value.trim() };
  }
  const row = asRecord(value);
  if (!row) return undefined;

  const text =
    readString(row.text) ||
    readString(row.summary) ||
    readString(row.description) ||
    undefined;
  const matchedEvidence = readStringArray(
    row.matched_evidence ?? row.matchedEvidence ?? row.evidence
  );

  if (!text && !matchedEvidence.length) return undefined;
  return {
    text,
    matchedEvidence: matchedEvidence.length ? matchedEvidence : undefined,
  };
}

function parseEvidenceSummary(root: Record<string, unknown>): string[] {
  return readStringArray(
    root.evidence_summary ?? root.evidenceSummary ?? root.mcp_evidence_summary
  );
}

function parseGraphRagExplanation(root: Record<string, unknown>): string | undefined {
  return (
    readString(root.explanation) ||
    readString(root.graph_rag_explanation) ||
    readString(root.graphRagExplanation) ||
    readString(root.graphrag_explanation) ||
    undefined
  );
}

/** Extract MCP investigation fields from an RCA results or explanation JSON payload. */
export function parseRcaMcpInvestigationContext(
  json: unknown
): RcaMcpInvestigationContext | undefined {
  const root = asRecord(json);
  if (!root) return undefined;

  const signalScores = parseSignalScores(
    root.signal_scores ?? root.signalScores ?? root.mcp_signal_scores
  );
  const mcpArtifactRefs = parseArtifactRefs(
    root.mcp_artifact_refs ?? root.mcpArtifactRefs ?? root.artifact_refs
  );
  const mcpContextSummary = parseContextSummary(
    root.mcp_context_summary ?? root.mcpContextSummary
  );
  const evidenceSummary = parseEvidenceSummary(root);
  const graphRagExplanation = parseGraphRagExplanation(root);

  const hasSignals = Object.keys(signalScores).length > 0;
  const hasArtifacts = Boolean(mcpArtifactRefs.jira || mcpArtifactRefs.github);
  const hasSummary = Boolean(mcpContextSummary?.text || mcpContextSummary?.matchedEvidence?.length);
  const hasEvidence = evidenceSummary.length > 0;
  const hasExplanation = Boolean(graphRagExplanation?.trim());

  if (!hasSignals && !hasArtifacts && !hasSummary && !hasEvidence && !hasExplanation) {
    return undefined;
  }

  return {
    signalScores,
    mcpArtifactRefs,
    mcpContextSummary,
    evidenceSummary,
    graphRagExplanation,
  };
}

/** Merge MCP context from RCA results + explanation payloads (explanation wins on conflicts). */
export function mergeRcaMcpInvestigationContexts(
  ...contexts: (RcaMcpInvestigationContext | undefined)[]
): RcaMcpInvestigationContext | undefined {
  const present = contexts.filter((ctx): ctx is RcaMcpInvestigationContext => Boolean(ctx));
  if (!present.length) return undefined;

  const merged: RcaMcpInvestigationContext = {
    signalScores: {},
    mcpArtifactRefs: {},
    evidenceSummary: [],
  };

  for (const ctx of present) {
    merged.signalScores = { ...merged.signalScores, ...ctx.signalScores };
    merged.mcpArtifactRefs = {
      jira: ctx.mcpArtifactRefs.jira ?? merged.mcpArtifactRefs.jira,
      github: ctx.mcpArtifactRefs.github ?? merged.mcpArtifactRefs.github,
    };
    if (ctx.mcpContextSummary) merged.mcpContextSummary = ctx.mcpContextSummary;
    if (ctx.evidenceSummary.length) merged.evidenceSummary = ctx.evidenceSummary;
    if (ctx.graphRagExplanation) merged.graphRagExplanation = ctx.graphRagExplanation;
  }

  return merged;
}

export function hasRcaMcpInvestigationContext(
  ctx: RcaMcpInvestigationContext | undefined
): ctx is RcaMcpInvestigationContext {
  if (!ctx) return false;
  return (
    Object.keys(ctx.signalScores).length > 0 ||
    Boolean(ctx.mcpArtifactRefs.jira || ctx.mcpArtifactRefs.github) ||
    Boolean(ctx.mcpContextSummary?.text || ctx.mcpContextSummary?.matchedEvidence?.length) ||
    ctx.evidenceSummary.length > 0 ||
    Boolean(ctx.graphRagExplanation?.trim())
  );
}
