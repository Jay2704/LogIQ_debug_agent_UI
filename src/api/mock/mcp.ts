import type { McpService } from "@/api/contracts";
import {
  integrationConnectionsToMcpConnections,
  integrationConnectionsToProviderStatus,
  integrationConnectionToMcpConnection,
} from "@/lib/mapIntegrationToMcp";
import { mockIntegrationsService } from "./integrations";
import type {
  JiraTicketSummary,
  McpPreviewContextInput,
  UnifiedInvestigationContext,
} from "@/types";

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
  async getStatus(workspaceId: string) {
    await new Promise((r) => setTimeout(r, 120));
    const rows = await mockIntegrationsService.listConnections(workspaceId);
    return integrationConnectionsToProviderStatus(rows);
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

  async getConnections(workspaceId: string) {
    await new Promise((r) => setTimeout(r, 120));
    const rows = await mockIntegrationsService.listConnections(workspaceId);
    return { connections: integrationConnectionsToMcpConnections(rows) };
  },

  async validateConnection(workspaceId: string, connectionId: string) {
    await new Promise((r) => setTimeout(r, 280));
    await mockIntegrationsService.validateConnection(connectionId);
    const rows = await mockIntegrationsService.listConnections(workspaceId);
    const row = rows.find((r) => r.id === connectionId);
    if (!row) {
      throw new Error(`[LogIQ MCP] validateConnection: unknown connection ${connectionId}`);
    }
    return integrationConnectionToMcpConnection(row);
  },

  async validateAllConnections(workspaceId: string) {
    await new Promise((r) => setTimeout(r, 400));
    const rows = await mockIntegrationsService.listConnections(workspaceId);
    for (const row of rows.filter((r) => r.enabled)) {
      await mockIntegrationsService.validateConnection(row.id);
    }
    const refreshed = await mockIntegrationsService.listConnections(workspaceId);
    return { connections: integrationConnectionsToMcpConnections(refreshed) };
  },
};
