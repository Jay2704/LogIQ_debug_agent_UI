export type IntegrationProvider = "jira" | "github";

export type IntegrationValidationStatus = "valid" | "invalid" | "unknown" | "pending";

export interface IntegrationConnectionBase {
  id: string;
  provider: IntegrationProvider;
  displayName: string;
  workspaceId: string;
  enabled: boolean;
  hasSecret: boolean;
  secretMasked: string | null;
  lastValidatedAt: string | null;
  validationStatus: IntegrationValidationStatus;
  validationError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JiraIntegrationConnection extends IntegrationConnectionBase {
  provider: "jira";
  baseUrl: string;
  projectKey: string;
  email: string;
}

export interface GitHubIntegrationConnection extends IntegrationConnectionBase {
  provider: "github";
  orgName: string;
  repoName: string;
}

export type IntegrationConnection =
  | JiraIntegrationConnection
  | GitHubIntegrationConnection;

export interface CreateJiraConnectionInput {
  provider: "jira";
  displayName: string;
  workspaceId: string;
  baseUrl: string;
  projectKey: string;
  email: string;
  apiToken: string;
  enabled?: boolean;
}

export interface CreateGitHubConnectionInput {
  provider: "github";
  displayName: string;
  workspaceId: string;
  orgName: string;
  repoName: string;
  token: string;
  enabled?: boolean;
}

export type CreateIntegrationConnectionInput =
  | CreateJiraConnectionInput
  | CreateGitHubConnectionInput;

export interface UpdateJiraConnectionInput {
  displayName?: string;
  workspaceId?: string;
  baseUrl?: string;
  projectKey?: string;
  email?: string;
  apiToken?: string;
  enabled?: boolean;
}

export interface UpdateGitHubConnectionInput {
  displayName?: string;
  workspaceId?: string;
  orgName?: string;
  repoName?: string;
  token?: string;
  enabled?: boolean;
}

export type UpdateIntegrationConnectionInput =
  | UpdateJiraConnectionInput
  | UpdateGitHubConnectionInput;

export interface ValidateIntegrationConnectionResult {
  id: string;
  validationStatus: IntegrationValidationStatus;
  validationError: string | null;
  lastValidatedAt: string;
}
