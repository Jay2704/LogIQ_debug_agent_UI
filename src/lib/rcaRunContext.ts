import type { IntegrationConnection, RcaRunInput } from "@/types";

export function resolveRcaRunInput(
  anomalyId: string,
  workspaceId: string,
  connections: IntegrationConnection[]
): RcaRunInput {
  const github = connections.find(
    (row) => row.provider === "github" && row.enabled && row.validationStatus === "valid"
  );
  const repoName =
    github && github.provider === "github" ? github.repoName.trim() : undefined;

  return {
    anomalyId: anomalyId.trim(),
    workspaceId: workspaceId.trim(),
    ...(repoName ? { repoName } : {}),
  };
}
