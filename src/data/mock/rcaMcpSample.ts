import type { RcaMcpInvestigationContext } from "@/types";

/** Demo MCP context — LAAA-83, PR #3, parseIntegrationsApi.ts (develop / mock). */
export const MOCK_RCA_MCP_CONTEXT: RcaMcpInvestigationContext = {
  signalScores: {
    recent_commit_match: 0.72,
    recent_pr_match: 0.85,
    changed_file_match: 0.91,
    jira_ticket_match: 0.88,
    jira_label_match: 0.64,
    author_activity_match: 0.55,
  },
  mcpArtifactRefs: {
    jira: {
      ticketKey: "LAAA-83",
      summary: "Integration API parsing failures in MCP workflow",
      labels: ["rca", "integrations", "mcp"],
      status: "In Progress",
    },
    github: {
      pullRequestNumber: 3,
      pullRequestTitle: "Wire integrations API parsing for MCP context",
      changedFiles: ["src/api/http/parseIntegrationsApi.ts"],
      repository: "logiq/platform-api",
    },
  },
  mcpContextSummary: {
    text: "MCP correlated Jira intake with recent GitHub activity around integrations parsing.",
    matchedEvidence: [
      "Jira ticket LAAA-83",
      "PR #3",
      "changed file parseIntegrationsApi.ts",
    ],
  },
  evidenceSummary: [
    "Jira ticket LAAA-83 describes integration validation errors tied to parseIntegrationsApi.ts.",
    "GitHub PR #3 modified parseIntegrationsApi.ts within the incident window.",
    "Author activity on PR #3 aligns with the ticket assignee and recent commit timeline.",
  ],
  graphRagExplanation:
    "GraphRAG linked Investigation → JiraTicket (LAAA-83) → PullRequest (#3) → Commit via changed_file_match on parseIntegrationsApi.ts. Signal scores weighted changed_file_match highest (0.91), reinforcing the top RCA candidate path.",
};
