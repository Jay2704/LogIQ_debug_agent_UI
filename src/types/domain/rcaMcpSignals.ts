/** MCP correlation signals that contribute to RCA candidate ranking. */
export type McpSignalKey =
  | "recent_commit_match"
  | "recent_pr_match"
  | "changed_file_match"
  | "jira_ticket_match"
  | "jira_label_match"
  | "author_activity_match";

export const MCP_SIGNAL_KEYS: McpSignalKey[] = [
  "recent_commit_match",
  "recent_pr_match",
  "changed_file_match",
  "jira_ticket_match",
  "jira_label_match",
  "author_activity_match",
];

export interface McpJiraArtifactRef {
  ticketKey: string;
  summary?: string;
  labels?: string[];
  status?: string;
}

export interface McpGitHubArtifactRef {
  pullRequestNumber?: number;
  pullRequestTitle?: string;
  changedFiles?: string[];
  commitSha?: string;
  repository?: string;
}

export interface McpArtifactRefs {
  jira?: McpJiraArtifactRef;
  github?: McpGitHubArtifactRef;
}

export interface McpContextSummary {
  text?: string;
  matchedEvidence?: string[];
}

/**
 * MCP-powered investigation context from RCA API payloads
 * (`signal_scores`, `mcp_artifact_refs`, `mcp_context_summary`, `evidence_summary`, `explanation`).
 */
export interface RcaMcpInvestigationContext {
  signalScores: Partial<Record<McpSignalKey, number>>;
  mcpArtifactRefs: McpArtifactRefs;
  mcpContextSummary?: McpContextSummary;
  evidenceSummary: string[];
  /** GraphRAG narrative with Jira/GitHub citations */
  graphRagExplanation?: string;
}
