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
