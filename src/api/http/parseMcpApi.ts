import type {
  CommitEvent,
  JiraTicketSummary,
  MergeRequestEvent,
  McpConnection,
  McpConnectionStatus,
  McpProviderId,
  McpProviderStatus,
  PullRequestEvent,
  UnifiedInvestigationContext,
} from "@/types";
import { resolveMcpConnectionStatus } from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function parseProviderRow(row: unknown): McpProviderStatus | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const provider = readString(r.provider) || readString(r.source);
  if (provider !== "jira" && provider !== "github" && provider !== "gitlab") {
    return null;
  }
  const configured = Boolean(r.configured);
  const reachable = Boolean(r.reachable ?? r.connected);
  const detail = readString(r.detail) || readString(r.message);
  return {
    provider,
    label: readString(r.label, provider),
    connected: reachable && configured,
    configured,
    message: detail || undefined,
  };
}

export function parseMcpStatusJson(json: unknown): McpProviderStatus[] {
  const rows = Array.isArray(json)
    ? json
    : json && typeof json === "object" && Array.isArray((json as Record<string, unknown>).providers)
      ? ((json as Record<string, unknown>).providers as unknown[])
      : [];

  return rows
    .map(parseProviderRow)
    .filter((row): row is McpProviderStatus => row !== null);
}

function parseCommitRow(row: unknown): CommitEvent | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const sha = readString(r.sha);
  if (!sha) return null;
  const shortSha =
    readString(r.short_sha) || readString(r.shortSha) || sha.slice(0, 7);
  return {
    sha,
    shortSha,
    message: readString(r.message),
    authorName: readString(r.author_name) || readString(r.authorName) || readString(r.author),
    committedAt:
      readString(r.committed_at) || readString(r.committedAt) || readString(r.date),
    repository: readString(r.repository) || readString(r.repo),
    url: readString(r.url) || undefined,
  };
}

function parsePullRequestRow(row: unknown): PullRequestEvent | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const number = typeof r.number === "number" ? r.number : Number(r.number);
  if (!Number.isFinite(number)) return null;
  return {
    number,
    title: readString(r.title),
    state: readString(r.state),
    author: readString(r.author),
    createdAt: readString(r.created_at) || readString(r.createdAt),
    mergedAt: readString(r.merged_at) || readString(r.mergedAt) || undefined,
    repository: readString(r.repository) || readString(r.repo),
    url: readString(r.url) || undefined,
  };
}

function parseMergeRequestRow(row: unknown): MergeRequestEvent | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const iid = typeof r.iid === "number" ? r.iid : Number(r.iid);
  if (!Number.isFinite(iid)) return null;
  return {
    iid,
    title: readString(r.title),
    state: readString(r.state),
    author: readString(r.author),
    createdAt: readString(r.created_at) || readString(r.createdAt),
    mergedAt: readString(r.merged_at) || readString(r.mergedAt) || undefined,
    project: readString(r.project) || readString(r.repository),
    url: readString(r.url) || undefined,
  };
}

function parseJiraContextBlock(data: Record<string, unknown>): JiraTicketSummary {
  const key = readString(data.key) || readString(data.ticket_key);
  return {
    key,
    summary: readString(data.summary) || readString(data.title),
    status: readString(data.status, "Unknown"),
    priority: readString(data.priority, "Unknown"),
    labels: readStringArray(data.labels),
    cleanedDescription:
      readString(data.cleaned_description) ||
      readString(data.cleanedDescription) ||
      readString(data.description),
    extractedHints:
      readStringArray(data.extracted_hints) || readStringArray(data.extractedHints),
  };
}

export function parseMcpContextPreviewJson(json: unknown): UnifiedInvestigationContext {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] POST /api/v1/mcp/context/preview: invalid JSON payload");
  }
  const data = json as Record<string, unknown>;
  const ticketKey =
    readString(data.ticket_key) || readString(data.ticketKey);
  if (!ticketKey) {
    throw new Error("[LogIQ API] POST /api/v1/mcp/context/preview: missing ticket_key");
  }

  const jiraBlock =
    data.jira && typeof data.jira === "object"
      ? parseJiraContextBlock(data.jira as Record<string, unknown>)
      : parseJiraContextBlock(data);

  const github =
    data.github && typeof data.github === "object"
      ? (data.github as Record<string, unknown>)
      : data;

  const gitlab =
    data.gitlab && typeof data.gitlab === "object"
      ? (data.gitlab as Record<string, unknown>)
      : data;

  const githubCommits = (
    Array.isArray(github.github_commits)
      ? github.github_commits
      : Array.isArray(github.commits)
        ? github.commits
        : Array.isArray(data.github_commits)
          ? data.github_commits
          : []
  )
    .map(parseCommitRow)
    .filter((row): row is CommitEvent => row !== null);

  const githubPullRequests = (
    Array.isArray(github.github_pull_requests)
      ? github.github_pull_requests
      : Array.isArray(github.pull_requests)
        ? github.pull_requests
        : Array.isArray(data.github_pull_requests)
          ? data.github_pull_requests
          : []
  )
    .map(parsePullRequestRow)
    .filter((row): row is PullRequestEvent => row !== null);

  const gitlabMergeRequests = (
    Array.isArray(gitlab.gitlab_merge_requests)
      ? gitlab.gitlab_merge_requests
      : Array.isArray(gitlab.merge_requests)
        ? gitlab.merge_requests
        : Array.isArray(data.gitlab_merge_requests)
          ? data.gitlab_merge_requests
          : []
  )
    .map(parseMergeRequestRow)
    .filter((row): row is MergeRequestEvent => row !== null);

  return {
    ticketKey,
    jira: {
      key: jiraBlock.key || ticketKey,
      summary: jiraBlock.summary,
      status: jiraBlock.status,
      priority: jiraBlock.priority,
      labels: jiraBlock.labels,
      cleanedDescription: jiraBlock.cleanedDescription,
      extractedHints: jiraBlock.extractedHints,
    },
    githubCommits,
    githubPullRequests,
    gitlabMergeRequests,
    previewedAt:
      readString(data.previewed_at) ||
      readString(data.previewedAt) ||
      new Date().toISOString(),
  };
}

export function serializeMcpPreviewBody(input: {
  ticketKey: string;
  ticket?: JiraTicketSummary;
  logContent?: string;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    ticket_key: input.ticketKey.trim().toUpperCase(),
  };
  if (input.ticket) {
    payload.ticket = {
      key: input.ticket.key,
      title: input.ticket.summary,
      description: input.ticket.cleanedDescription,
      labels: input.ticket.labels,
      status: input.ticket.status,
      priority: input.ticket.priority,
      extracted_hints: input.ticket.extractedHints,
    };
  }
  const log = input.logContent?.trim();
  if (log) {
    payload.log_content = log;
  }
  return payload;
}

function parseConnectionStatus(value: unknown): McpConnectionStatus | undefined {
  const status = readString(value).toLowerCase();
  if (
    status === "healthy" ||
    status === "unhealthy" ||
    status === "not_configured" ||
    status === "failed"
  ) {
    return status;
  }
  return undefined;
}

function parseConnectionRow(row: unknown): McpConnection | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id =
    readString(r.id) ||
    readString(r.connection_id) ||
    readString(r.connectionId);
  const provider = readString(r.provider);
  if (provider !== "jira" && provider !== "github" && provider !== "gitlab") {
    return null;
  }

  const configured = Boolean(r.configured);
  const healthy = Boolean(r.healthy);
  const errorMessage = readString(r.error_message) || readString(r.errorMessage) || undefined;
  const status =
    parseConnectionStatus(r.status) ??
    resolveMcpConnectionStatus({ configured, healthy, errorMessage });

  return {
    id: id || `${provider}-legacy`,
    provider: provider as McpProviderId,
    label: readString(r.display_name) || readString(r.label, provider),
    configured,
    healthy,
    lastCheckedAt:
      readString(r.last_checked_at) ||
      readString(r.lastCheckedAt) ||
      readString(r.last_checked) ||
      undefined,
    errorMessage,
    status,
  };
}

export function parseMcpConnectionsJson(json: unknown): McpConnection[] {
  const rows = Array.isArray(json)
    ? json
    : json && typeof json === "object" && Array.isArray((json as Record<string, unknown>).connections)
      ? ((json as Record<string, unknown>).connections as unknown[])
      : [];

  return rows
    .map(parseConnectionRow)
    .filter((row): row is McpConnection => row !== null);
}

export function parseMcpConnectionJson(json: unknown): McpConnection {
  const row = parseConnectionRow(json);
  if (!row) {
    throw new Error("[LogIQ API] MCP connection: invalid connection payload");
  }
  return row;
}
