/** Specialist agents that contribute findings to a multi-agent investigation. */
export type InvestigationAgentId =
  | "timeline"
  | "deployment"
  | "infrastructure"
  | "incident"
  | "knowledge"
  | "rca";

export type MultiAgentRunStatus = "not_started" | "running" | "completed" | "failed";

export type AgentRunStatus = "idle" | "running" | "completed" | "failed";

export interface AgentFinding {
  id: string;
  summary: string;
  evidence: string[];
  /** Deterministic confidence score (0–1). */
  confidence: number;
}

export interface MultiAgentPanel {
  agentId: InvestigationAgentId;
  label: string;
  status: AgentRunStatus;
  findings: AgentFinding[];
}

export interface MultiAgentInvestigationSummary {
  headline: string;
  narrative: string;
  primaryRootCause: string;
  overallConfidence: number;
  recommendedActions: string[];
}

export interface MultiAgentInvestigationReport {
  investigationId: string;
  status: MultiAgentRunStatus;
  agents: MultiAgentPanel[];
  summary: MultiAgentInvestigationSummary | null;
  lastRunAt: string | null;
}

export const INVESTIGATION_AGENT_LABELS: Record<InvestigationAgentId, string> = {
  timeline: "Timeline Agent",
  deployment: "Deployment Agent",
  infrastructure: "Infrastructure Agent",
  incident: "Incident Agent",
  knowledge: "Knowledge Agent",
  rca: "RCA Agent",
};

export const INVESTIGATION_AGENT_ORDER: InvestigationAgentId[] = [
  "timeline",
  "deployment",
  "infrastructure",
  "incident",
  "knowledge",
  "rca",
];
