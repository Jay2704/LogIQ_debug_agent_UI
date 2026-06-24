import type { JiraTicketSummary } from "./jira";

/** Phase 1 MCP providers surfaced in the investigation workflow. */
export type McpProviderId = "jira" | "github" | "gitlab";

export interface McpProviderStatus {
  provider: McpProviderId;
  label: string;
  connected: boolean;
  configured: boolean;
  message?: string;
}

export interface CommitEvent {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string;
  committedAt: string;
  repository: string;
  url?: string;
}

export interface PullRequestEvent {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  mergedAt?: string;
  repository: string;
  url?: string;
}

export interface MergeRequestEvent {
  iid: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  mergedAt?: string;
  project: string;
  url?: string;
}

/** Aggregated external context gathered before running an investigation. */
export interface UnifiedInvestigationContext {
  ticketKey: string;
  jira: Pick<
    JiraTicketSummary,
    "key" | "summary" | "status" | "priority" | "labels" | "cleanedDescription" | "extractedHints"
  >;
  githubCommits: CommitEvent[];
  githubPullRequests: PullRequestEvent[];
  gitlabMergeRequests: MergeRequestEvent[];
  previewedAt: string;
}

export interface McpPreviewContextInput {
  ticketKey: string;
  ticket?: JiraTicketSummary;
  logContent?: string;
}

/** Connection health for the MCP Connection Center. */
export type McpConnectionStatus =
  | "healthy"
  | "unhealthy"
  | "not_configured"
  | "failed";

export interface McpConnection {
  /** integration_connections row id */
  id: string;
  provider: McpProviderId;
  label: string;
  configured: boolean;
  healthy: boolean;
  lastCheckedAt?: string;
  errorMessage?: string;
  status: McpConnectionStatus;
}

export interface McpConnectionsResult {
  connections: McpConnection[];
}

export function resolveMcpConnectionStatus(input: {
  configured: boolean;
  healthy: boolean;
  errorMessage?: string;
  status?: McpConnectionStatus;
}): McpConnectionStatus {
  if (input.status) return input.status;
  if (!input.configured) return "not_configured";
  if (input.errorMessage?.toLowerCase().includes("fail")) return "failed";
  if (input.healthy) return "healthy";
  return "unhealthy";
}
