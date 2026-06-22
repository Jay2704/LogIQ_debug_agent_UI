import type {
  AgentFinding,
  AgentRunStatus,
  InvestigationAgentId,
  MultiAgentInvestigationReport,
  MultiAgentInvestigationSummary,
  MultiAgentPanel,
  MultiAgentRunStatus,
} from "@/types";
import {
  INVESTIGATION_AGENT_LABELS,
  INVESTIGATION_AGENT_ORDER,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

const AGENT_IDS = new Set<InvestigationAgentId>(INVESTIGATION_AGENT_ORDER);
const RUN_STATUSES = new Set<MultiAgentRunStatus>([
  "not_started",
  "running",
  "completed",
  "failed",
]);
const AGENT_STATUSES = new Set<AgentRunStatus>([
  "idle",
  "running",
  "completed",
  "failed",
]);

function normalizeAgentId(value: string): InvestigationAgentId | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (AGENT_IDS.has(normalized as InvestigationAgentId)) {
    return normalized as InvestigationAgentId;
  }
  const aliases: Record<string, InvestigationAgentId> = {
    timeline_agent: "timeline",
    deployment_agent: "deployment",
    infrastructure_agent: "infrastructure",
    incident_agent: "incident",
    knowledge_agent: "knowledge",
    rca_agent: "rca",
  };
  return aliases[normalized] ?? null;
}

function parseFindingRow(row: unknown, prefix: string, index: number): AgentFinding | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const summary =
    readString(r.summary) || readString(r.finding) || readString(r.title);
  if (!summary) return null;
  const evidenceRaw = r.evidence ?? r.evidence_items ?? r.evidenceItems;
  const evidence = Array.isArray(evidenceRaw)
    ? evidenceRaw.filter((item): item is string => typeof item === "string")
    : [];
  return {
    id: readString(r.id) || `${prefix}-finding-${index + 1}`,
    summary,
    evidence,
    confidence: readNumber(r.confidence),
  };
}

function parsePanelRow(row: unknown, investigationId: string): MultiAgentPanel | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const agentId = normalizeAgentId(
    readString(r.agent_id) || readString(r.agentId) || readString(r.id)
  );
  if (!agentId) return null;
  const statusRaw = readString(r.status, "idle").toLowerCase();
  const status = AGENT_STATUSES.has(statusRaw as AgentRunStatus)
    ? (statusRaw as AgentRunStatus)
    : "idle";
  const findingsRaw = r.findings ?? r.results;
  const findings = Array.isArray(findingsRaw)
    ? findingsRaw
        .map((item, index) => parseFindingRow(item, `${investigationId}-${agentId}`, index))
        .filter((item): item is AgentFinding => item !== null)
    : [];
  return {
    agentId,
    label: readString(r.label) || INVESTIGATION_AGENT_LABELS[agentId],
    status,
    findings,
  };
}

function parseSummaryRow(row: unknown): MultiAgentInvestigationSummary | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const headline =
    readString(r.headline) || readString(r.title) || readString(r.summary_headline);
  const narrative =
    readString(r.narrative) ||
    readString(r.summary) ||
    readString(r.description);
  const primaryRootCause =
    readString(r.primary_root_cause) ||
    readString(r.primaryRootCause) ||
    readString(r.root_cause) ||
    readString(r.rootCause);
  if (!headline && !narrative) return null;
  const actionsRaw = r.recommended_actions ?? r.recommendedActions ?? r.actions;
  const recommendedActions = Array.isArray(actionsRaw)
    ? actionsRaw.filter((item): item is string => typeof item === "string")
    : [];
  return {
    headline: headline || "Investigation summary",
    narrative: narrative || "",
    primaryRootCause,
    overallConfidence: readNumber(r.overall_confidence ?? r.overallConfidence),
    recommendedActions,
  };
}

function emptyPanels(): MultiAgentPanel[] {
  return INVESTIGATION_AGENT_ORDER.map((agentId) => ({
    agentId,
    label: INVESTIGATION_AGENT_LABELS[agentId],
    status: "idle" as const,
    findings: [],
  }));
}

export function parseMultiAgentReportJson(
  json: unknown,
  investigationId: string
): MultiAgentInvestigationReport {
  if (!json || typeof json !== "object") {
    return {
      investigationId,
      status: "not_started",
      agents: emptyPanels(),
      summary: null,
      lastRunAt: null,
    };
  }

  const r = json as Record<string, unknown>;
  const statusRaw = readString(r.status, "not_started").toLowerCase();
  const status = RUN_STATUSES.has(statusRaw as MultiAgentRunStatus)
    ? (statusRaw as MultiAgentRunStatus)
    : "not_started";
  const agentsRaw = r.agents ?? r.panels ?? r.agent_panels;
  const parsedAgents = Array.isArray(agentsRaw)
    ? agentsRaw
        .map((row) => parsePanelRow(row, investigationId))
        .filter((row): row is MultiAgentPanel => row !== null)
    : [];
  const agentsById = new Map(parsedAgents.map((panel) => [panel.agentId, panel]));
  const agents = INVESTIGATION_AGENT_ORDER.map(
    (agentId) =>
      agentsById.get(agentId) ?? {
        agentId,
        label: INVESTIGATION_AGENT_LABELS[agentId],
        status: "idle" as const,
        findings: [],
      }
  );
  const summary = parseSummaryRow(r.summary ?? r.final_summary ?? r.finalSummary);

  return {
    investigationId: readString(r.investigation_id, investigationId) || investigationId,
    status,
    agents,
    summary,
    lastRunAt:
      readString(r.last_run_at) ||
      readString(r.lastRunAt) ||
      readString(r.completed_at) ||
      null,
  };
}
