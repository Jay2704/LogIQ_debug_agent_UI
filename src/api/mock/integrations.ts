import type { IntegrationsService } from "@/api/contracts";
import { maskSecret } from "@/lib/maskSecret";
import type {
  CreateIntegrationConnectionInput,
  GitHubIntegrationConnection,
  IntegrationConnection,
  IntegrationValidationStatus,
  JiraIntegrationConnection,
  UpdateIntegrationConnectionInput,
  ValidateIntegrationConnectionResult,
} from "@/types";

const connectionsByWorkspace = new Map<string, IntegrationConnection[]>();
const secretsById = new Map<string, string>();

function nowIso(): string {
  return new Date().toISOString();
}

function newId(provider: string): string {
  return `int_${provider}_${Date.now()}`;
}

function sanitizeConnection(row: IntegrationConnection): IntegrationConnection {
  return { ...row, hasSecret: secretsById.has(row.id) };
}

function listForWorkspace(workspaceId: string): IntegrationConnection[] {
  const id = workspaceId.trim();
  return (connectionsByWorkspace.get(id) ?? []).map(sanitizeConnection);
}

function findConnection(id: string): IntegrationConnection | undefined {
  for (const rows of connectionsByWorkspace.values()) {
    const match = rows.find((row) => row.id === id);
    if (match) return match;
  }
  return undefined;
}

function validateSecret(provider: string, secret: string): string | null {
  const trimmed = secret.trim();
  if (trimmed.length < 8) {
    return "Token must be at least 8 characters.";
  }
  if (trimmed.toLowerCase() === "invalid") {
    return "Provider rejected credentials (mock validation).";
  }
  if (provider === "jira" && !trimmed.startsWith("jira_")) {
    return "Jira API token format looks invalid for this workspace (mock check).";
  }
  if (provider === "github" && !trimmed.startsWith("gh")) {
    return "GitHub token should start with gh (mock check).";
  }
  return null;
}

function runValidation(connection: IntegrationConnection): ValidateIntegrationConnectionResult {
  const secret = secretsById.get(connection.id) ?? "";
  let error: string | null = null;

  if (!connection.enabled) {
    error = "Connection is disabled.";
  } else if (!secret.trim()) {
    error = "No secret configured for this connection.";
  } else {
    error = validateSecret(connection.provider, secret);
  }

  if (connection.provider === "jira" && !error) {
    if (!connection.baseUrl.startsWith("https://")) {
      error = "Jira base URL must use HTTPS.";
    }
  }

  const validationStatus: IntegrationValidationStatus = error ? "invalid" : "valid";
  const lastValidatedAt = nowIso();
  connection.validationStatus = validationStatus;
  connection.validationError = error;
  connection.lastValidatedAt = lastValidatedAt;
  connection.updatedAt = lastValidatedAt;

  return {
    id: connection.id,
    validationStatus,
    validationError: error,
    lastValidatedAt,
  };
}

function seedIfEmpty(workspaceId: string): void {
  if (listForWorkspace(workspaceId).length > 0) return;

  const createdAt = "2026-03-28T10:00:00.000Z";
  const jira: JiraIntegrationConnection = {
    id: "int_jira_seed",
    provider: "jira",
    displayName: "Platform Jira",
    workspaceId,
    enabled: true,
    hasSecret: true,
    secretMasked: maskSecret("jira_platform_token_9f2a"),
    baseUrl: "https://logiq.atlassian.net",
    projectKey: "LOG",
    email: "oncall@logiq.example",
    lastValidatedAt: createdAt,
    validationStatus: "valid",
    validationError: null,
    createdAt,
    updatedAt: createdAt,
  };
  const github: GitHubIntegrationConnection = {
    id: "int_github_seed",
    provider: "github",
    displayName: "Platform API",
    workspaceId,
    enabled: true,
    hasSecret: true,
    secretMasked: maskSecret("ghp_example_token_7c1d"),
    orgName: "logiq",
    repoName: "platform-api",
    lastValidatedAt: createdAt,
    validationStatus: "valid",
    validationError: null,
    createdAt,
    updatedAt: createdAt,
  };

  secretsById.set(jira.id, "jira_platform_token_9f2a");
  secretsById.set(github.id, "ghp_example_token_7c1d");
  connectionsByWorkspace.set(workspaceId, [jira, github]);
}

export const mockIntegrationsService: IntegrationsService = {
  async listConnections(workspaceId: string) {
    const id = workspaceId.trim();
    if (!id) {
      throw new Error("[LogIQ integrations] listConnections: workspaceId is required");
    }
    await new Promise((r) => setTimeout(r, 140));
    seedIfEmpty(id);
    return listForWorkspace(id);
  },

  async createConnection(payload: CreateIntegrationConnectionInput) {
    await new Promise((r) => setTimeout(r, 180));
    const workspaceId = payload.workspaceId.trim();
    if (!workspaceId) {
      throw new Error("[LogIQ integrations] createConnection: workspaceId is required");
    }

    const createdAt = nowIso();
    const id = newId(payload.provider);
    let connection: IntegrationConnection;

    if (payload.provider === "jira") {
      const secret = payload.apiToken.trim();
      if (!secret) throw new Error("[LogIQ integrations] apiToken is required");
      secretsById.set(id, secret);
      connection = {
        id,
        provider: "jira",
        displayName: payload.displayName.trim(),
        workspaceId,
        enabled: payload.enabled ?? true,
        hasSecret: true,
        secretMasked: maskSecret(secret),
        baseUrl: payload.baseUrl.trim(),
        projectKey: payload.projectKey.trim(),
        email: payload.email.trim(),
        lastValidatedAt: null,
        validationStatus: "unknown",
        validationError: null,
        createdAt,
        updatedAt: createdAt,
      };
    } else {
      const secret = payload.token.trim();
      if (!secret) throw new Error("[LogIQ integrations] token is required");
      secretsById.set(id, secret);
      connection = {
        id,
        provider: "github",
        displayName: payload.displayName.trim(),
        workspaceId,
        enabled: payload.enabled ?? true,
        hasSecret: true,
        secretMasked: maskSecret(secret),
        orgName: payload.orgName.trim(),
        repoName: payload.repoName.trim(),
        lastValidatedAt: null,
        validationStatus: "unknown",
        validationError: null,
        createdAt,
        updatedAt: createdAt,
      };
    }

    const rows = listForWorkspace(workspaceId);
    rows.push(connection);
    connectionsByWorkspace.set(workspaceId, rows);
    return sanitizeConnection(connection);
  },

  async updateConnection(id: string, payload: UpdateIntegrationConnectionInput) {
    await new Promise((r) => setTimeout(r, 160));
    const existing = findConnection(id);
    if (!existing) {
      throw new Error(`[LogIQ integrations] Connection not found: ${id}`);
    }

    const updatedAt = nowIso();
    if (existing.provider === "jira") {
      const jiraPayload = payload as import("@/types").UpdateJiraConnectionInput;
      if (jiraPayload.apiToken?.trim()) {
        secretsById.set(id, jiraPayload.apiToken.trim());
        existing.secretMasked = maskSecret(jiraPayload.apiToken);
        existing.hasSecret = true;
      }
      if (jiraPayload.displayName !== undefined) {
        existing.displayName = jiraPayload.displayName.trim();
      }
      if (jiraPayload.workspaceId !== undefined) {
        existing.workspaceId = jiraPayload.workspaceId.trim();
      }
      if (jiraPayload.baseUrl !== undefined) {
        existing.baseUrl = jiraPayload.baseUrl.trim();
      }
      if (jiraPayload.projectKey !== undefined) {
        existing.projectKey = jiraPayload.projectKey.trim();
      }
      if (jiraPayload.email !== undefined) {
        existing.email = jiraPayload.email.trim();
      }
      if (jiraPayload.enabled !== undefined) {
        existing.enabled = jiraPayload.enabled;
      }
    } else {
      const githubPayload = payload as import("@/types").UpdateGitHubConnectionInput;
      if (githubPayload.token?.trim()) {
        secretsById.set(id, githubPayload.token.trim());
        existing.secretMasked = maskSecret(githubPayload.token);
        existing.hasSecret = true;
      }
      if (githubPayload.displayName !== undefined) {
        existing.displayName = githubPayload.displayName.trim();
      }
      if (githubPayload.workspaceId !== undefined) {
        existing.workspaceId = githubPayload.workspaceId.trim();
      }
      if (githubPayload.orgName !== undefined) {
        existing.orgName = githubPayload.orgName.trim();
      }
      if (githubPayload.repoName !== undefined) {
        existing.repoName = githubPayload.repoName.trim();
      }
      if (githubPayload.enabled !== undefined) {
        existing.enabled = githubPayload.enabled;
      }
    }

    existing.updatedAt = updatedAt;
    return sanitizeConnection(existing);
  },

  async deleteConnection(id: string) {
    await new Promise((r) => setTimeout(r, 120));
    for (const [workspaceId, rows] of connectionsByWorkspace.entries()) {
      const next = rows.filter((row) => row.id !== id);
      if (next.length !== rows.length) {
        connectionsByWorkspace.set(workspaceId, next);
        secretsById.delete(id);
        return;
      }
    }
    throw new Error(`[LogIQ integrations] Connection not found: ${id}`);
  },

  async validateConnection(id: string) {
    await new Promise((r) => setTimeout(r, 420));
    const connection = findConnection(id);
    if (!connection) {
      throw new Error(`[LogIQ integrations] Connection not found: ${id}`);
    }
    return runValidation(connection);
  },
};
