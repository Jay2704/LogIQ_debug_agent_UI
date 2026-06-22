import type { McpService } from "@/api/contracts";
import type {
  JiraTicketSummary,
  McpConnection,
  McpConnectionsResult,
  McpPreviewContextInput,
  McpProviderId,
  McpProviderStatus,
  UnifiedInvestigationContext,
} from "@/types";

const MOCK_PROVIDER_STATUS: McpProviderStatus[] = [
  {
    provider: "jira",
    label: "Jira",
    connected: true,
    configured: true,
    message: "Ticket intake ready",
  },
  {
    provider: "github",
    label: "GitHub",
    connected: true,
    configured: true,
    message: "Commits and pull requests available",
  },
  {
    provider: "gitlab",
    label: "GitLab",
    connected: true,
    configured: true,
    message: "Merge requests available",
  },
];

let mockConnections: McpConnection[] = [
  {
    provider: "jira",
    label: "Jira",
    configured: true,
    healthy: true,
    lastCheckedAt: "2026-03-29T10:00:00.000Z",
    status: "healthy",
  },
  {
    provider: "github",
    label: "GitHub",
    configured: true,
    healthy: false,
    lastCheckedAt: "2026-03-29T09:45:00.000Z",
    errorMessage: "Token expired — re-authenticate GitHub App installation.",
    status: "unhealthy",
  },
  {
    provider: "gitlab",
    label: "GitLab",
    configured: false,
    healthy: false,
    lastCheckedAt: "2026-03-28T16:20:00.000Z",
    errorMessage: "Missing GITLAB_TOKEN in server configuration.",
    status: "not_configured",
  },
];

function cloneConnections(): McpConnection[] {
  return mockConnections.map((row) => ({ ...row }));
}

function validateProviderMock(provider: McpProviderId): McpConnection {
  const now = new Date().toISOString();
  mockConnections = mockConnections.map((row) => {
    if (row.provider !== provider) return row;
    if (!row.configured) {
      return {
        ...row,
        lastCheckedAt: now,
        healthy: false,
        status: "failed",
        errorMessage: "Validation failed — provider is not configured.",
      };
    }
    if (row.provider === "github") {
      return {
        ...row,
        lastCheckedAt: now,
        healthy: true,
        status: "healthy",
        errorMessage: undefined,
      };
    }
    if (row.provider === "gitlab") {
      return {
        ...row,
        lastCheckedAt: now,
        healthy: false,
        status: "failed",
        errorMessage: "Validation failed — missing required credentials.",
      };
    }
    return {
      ...row,
      lastCheckedAt: now,
      healthy: true,
      status: "healthy",
      errorMessage: undefined,
    };
  });

  const updated = mockConnections.find((row) => row.provider === provider);
  if (!updated) {
    throw new Error(`[LogIQ MCP] validateConnection: unknown provider ${provider}`);
  }
  return { ...updated };
}

function buildMockContext(
  ticket: JiraTicketSummary,
  ticketKey: string
): UnifiedInvestigationContext {
  const repo = ticket.labels.find((l) => l.includes("/")) ?? "logiq/platform-api";
  const gitlabProject = repo.replace("/", "%2F");

  return {
    ticketKey,
    jira: {
      key: ticket.key,
      summary: ticket.summary,
      status: ticket.status,
      priority: ticket.priority,
      labels: ticket.labels,
      cleanedDescription: ticket.cleanedDescription,
      extractedHints: ticket.extractedHints,
    },
    githubCommits: [
      {
        sha: "a1b2c3d4e5f6789012345678901234567890abcd",
        shortSha: "a1b2c3d",
        message: "fix(auth): tighten MFA session timeout handling",
        authorName: "alex.chen",
        committedAt: "2026-06-18T14:22:00.000Z",
        repository: repo,
        url: `https://github.com/${repo}/commit/a1b2c3d4e5f6789012345678901234567890abcd`,
      },
      {
        sha: "f9e8d7c6b5a4321098765432109876543210fedc",
        shortSha: "f9e8d7c",
        message: "chore(obs): add structured error codes for login failures",
        authorName: "sam.rivera",
        committedAt: "2026-06-17T09:05:00.000Z",
        repository: repo,
        url: `https://github.com/${repo}/commit/f9e8d7c6b5a4321098765432109876543210fedc`,
      },
      {
        sha: "1234567890abcdef1234567890abcdef12345678",
        shortSha: "1234567",
        message: "refactor(cache): isolate redis connection pool per tenant",
        authorName: "jordan.lee",
        committedAt: "2026-06-15T16:40:00.000Z",
        repository: repo,
        url: `https://github.com/${repo}/commit/1234567890abcdef1234567890abcdef12345678`,
      },
    ],
    githubPullRequests: [
      {
        number: 482,
        title: "Harden MFA timeout + retry path for stale sessions",
        state: "merged",
        author: "alex.chen",
        createdAt: "2026-06-16T11:00:00.000Z",
        mergedAt: "2026-06-18T15:10:00.000Z",
        repository: repo,
        url: `https://github.com/${repo}/pull/482`,
      },
      {
        number: 479,
        title: "Add login failure telemetry for RCA correlation",
        state: "open",
        author: "sam.rivera",
        createdAt: "2026-06-14T08:30:00.000Z",
        repository: repo,
        url: `https://github.com/${repo}/pull/479`,
      },
    ],
    gitlabMergeRequests: [
      {
        iid: 118,
        title: "Backport MFA session fix to release-2.4",
        state: "merged",
        author: "ops.bot",
        createdAt: "2026-06-18T16:00:00.000Z",
        mergedAt: "2026-06-19T10:20:00.000Z",
        project: repo,
        url: `https://gitlab.com/${gitlabProject}/-/merge_requests/118`,
      },
    ],
    previewedAt: new Date().toISOString(),
  };
}

export const mockMcpService: McpService = {
  async getStatus() {
    await new Promise((r) => setTimeout(r, 120));
    return MOCK_PROVIDER_STATUS.map((row) => ({ ...row }));
  },

  async previewContext(input: McpPreviewContextInput) {
    const ticketKey = input.ticketKey.trim().toUpperCase();
    if (!ticketKey) {
      throw new Error("[LogIQ MCP] previewContext: ticket_key is required");
    }

    const ticket =
      input.ticket ??
      ({
        key: ticketKey,
        summary: "Investigation ticket",
        status: "In Progress",
        priority: "High",
        labels: ["rca", "auth"],
        cleanedDescription: input.logContent?.slice(0, 280) ?? "",
        extractedHints: ["auth", "timeout"],
      } satisfies JiraTicketSummary);

    await new Promise((r) => setTimeout(r, 350));
    return buildMockContext(ticket, ticketKey);
  },

  async getConnections() {
    await new Promise((r) => setTimeout(r, 120));
    return { connections: cloneConnections() } satisfies McpConnectionsResult;
  },

  async validateConnection(provider: McpProviderId) {
    await new Promise((r) => setTimeout(r, 280));
    return validateProviderMock(provider);
  },

  async validateAllConnections() {
    await new Promise((r) => setTimeout(r, 400));
    for (const row of mockConnections) {
      validateProviderMock(row.provider);
    }
    return { connections: cloneConnections() };
  },
};
