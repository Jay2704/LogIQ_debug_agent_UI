import type {
  CreateIntegrationConnectionInput,
  IntegrationConnection,
  IntegrationProvider,
  IntegrationValidationStatus,
  UpdateIntegrationConnectionInput,
  ValidateIntegrationConnectionResult,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

const PROVIDERS = new Set<IntegrationProvider>(["jira", "github"]);
const STATUSES = new Set<IntegrationValidationStatus>([
  "valid",
  "invalid",
  "unknown",
  "pending",
]);

function parseProvider(value: string): IntegrationProvider | null {
  const normalized = value.trim().toLowerCase();
  return PROVIDERS.has(normalized as IntegrationProvider)
    ? (normalized as IntegrationProvider)
    : null;
}

function parseStatus(value: string): IntegrationValidationStatus {
  const normalized = value.trim().toLowerCase();
  return STATUSES.has(normalized as IntegrationValidationStatus)
    ? (normalized as IntegrationValidationStatus)
    : "unknown";
}

function mapBackendValidationStatus(
  row: Record<string, unknown>
): IntegrationValidationStatus {
  const explicit = readString(row.validation_status) || readString(row.validationStatus);
  if (explicit) return parseStatus(explicit);

  const lastStatus =
    readString(row.last_validation_status) || readString(row.lastValidationStatus);
  if (lastStatus === "healthy") return "valid";
  if (lastStatus === "unhealthy") return "invalid";

  if (readBoolean(row.healthy, false)) return "valid";
  return "unknown";
}

function parseBaseRow(row: unknown): IntegrationConnection | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id) || readString(r.connection_id);
  const providerRaw = readString(r.provider);
  const provider = parseProvider(providerRaw);
  if (!id || !provider) return null;

  const credentialsMeta =
    r.credentials && typeof r.credentials === "object"
      ? (r.credentials as Record<string, unknown>)
      : null;
  const hasSecret =
    readBoolean(credentialsMeta?.configured, false) ||
    readBoolean(r.has_secret ?? r.hasSecret, false);

  const common = {
    id,
    displayName:
      readString(r.display_name) || readString(r.displayName) || readString(r.name),
    workspaceId:
      readString(r.workspace_id) || readString(r.workspaceId),
    enabled: readBoolean(r.is_enabled ?? r.enabled, true),
    hasSecret,
    secretMasked:
      readString(r.secret_masked) || readString(r.secretMasked) || null,
    lastValidatedAt:
      readString(r.last_validated_at) || readString(r.lastValidatedAt) || null,
    validationStatus: mapBackendValidationStatus(r),
    validationError:
      readString(r.last_validation_error) ||
      readString(r.validation_error) ||
      readString(r.validationError) ||
      null,
    createdAt: readString(r.created_at) || readString(r.createdAt) || "",
    updatedAt: readString(r.updated_at) || readString(r.updatedAt) || "",
  };

  if (provider === "jira") {
    return {
      ...common,
      provider: "jira",
      baseUrl: readString(r.base_url) || readString(r.baseUrl),
      projectKey: readString(r.project_key) || readString(r.projectKey),
      email: readString(r.email),
    };
  }

  return {
    ...common,
    provider: "github",
    orgName: readString(r.org_name) || readString(r.orgName),
    repoName: readString(r.repo_name) || readString(r.repoName),
  };
}

export function parseIntegrationConnectionJson(row: unknown): IntegrationConnection | null {
  return parseBaseRow(row);
}

export function parseIntegrationConnectionsJson(json: unknown): IntegrationConnection[] {
  if (Array.isArray(json)) {
    return json
      .map(parseIntegrationConnectionJson)
      .filter((row): row is IntegrationConnection => row !== null);
  }
  if (json && typeof json === "object") {
    const r = json as Record<string, unknown>;
    const rows = r.connections ?? r.items ?? r.data;
    if (Array.isArray(rows)) {
      return rows
        .map(parseIntegrationConnectionJson)
        .filter((row): row is IntegrationConnection => row !== null);
    }
  }
  return [];
}

export function parseValidateIntegrationConnectionJson(
  json: unknown,
  id: string
): ValidateIntegrationConnectionResult {
  if (!json || typeof json !== "object") {
    return {
      id,
      validationStatus: "unknown",
      validationError: null,
      lastValidatedAt: new Date().toISOString(),
    };
  }
  const r = json as Record<string, unknown>;
  const statusRaw =
    readString(r.status) ||
    readString(r.validation_status) ||
    readString(r.validationStatus) ||
    "";
  let validationStatus = parseStatus(statusRaw);
  if (statusRaw === "healthy") validationStatus = "valid";
  if (statusRaw === "unhealthy") validationStatus = "invalid";

  return {
    id: readString(r.connection_id) || readString(r.id, id) || id,
    validationStatus,
    validationError:
      readString(r.detail) ||
      readString(r.validation_error) ||
      readString(r.validationError) ||
      null,
    lastValidatedAt:
      readString(r.validated_at) ||
      readString(r.last_validated_at) ||
      readString(r.lastValidatedAt) ||
      new Date().toISOString(),
  };
}

export function serializeCreateIntegrationBody(
  input: CreateIntegrationConnectionInput
): Record<string, unknown> {
  if (input.provider === "jira") {
    return {
      provider: "jira",
      display_name: input.displayName.trim(),
      workspace_id: input.workspaceId.trim(),
      base_url: input.baseUrl.trim(),
      project_key: input.projectKey.trim(),
      is_enabled: input.enabled ?? true,
      credentials: {
        email: input.email.trim(),
        api_token: input.apiToken,
      },
    };
  }
  return {
    provider: "github",
    display_name: input.displayName.trim(),
    workspace_id: input.workspaceId.trim(),
    org_name: input.orgName.trim(),
    repo_name: input.repoName.trim(),
    is_enabled: input.enabled ?? true,
    credentials: {
      token: input.token,
    },
  };
}

export function serializeUpdateIntegrationBody(
  input: UpdateIntegrationConnectionInput
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const jira = input as import("@/types").UpdateJiraConnectionInput;
  const github = input as import("@/types").UpdateGitHubConnectionInput;

  if (jira.displayName !== undefined) body.display_name = jira.displayName.trim();
  if (jira.baseUrl !== undefined) body.base_url = jira.baseUrl.trim();
  if (jira.projectKey !== undefined) body.project_key = jira.projectKey.trim();
  if (github.orgName !== undefined) body.org_name = github.orgName.trim();
  if (github.repoName !== undefined) body.repo_name = github.repoName.trim();
  if (input.enabled !== undefined) body.is_enabled = input.enabled;

  const credentials: Record<string, unknown> = {};
  if (jira.email !== undefined) credentials.email = jira.email.trim();
  if (jira.apiToken !== undefined) credentials.api_token = jira.apiToken;
  if (github.token !== undefined) credentials.token = github.token;
  if (Object.keys(credentials).length > 0) {
    body.credentials = credentials;
  }

  return body;
}
