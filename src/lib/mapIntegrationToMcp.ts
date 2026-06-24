import type {
  IntegrationConnection,
  IntegrationProvider,
  McpConnection,
  McpConnectionStatus,
  McpProviderStatus,
} from "@/types";

const PROVIDER_LABELS: Record<IntegrationProvider, string> = {
  jira: "Jira",
  github: "GitHub",
};

function resolveMcpStatus(row: IntegrationConnection): McpConnectionStatus {
  if (!row.hasSecret || !row.enabled) return "not_configured";
  if (row.validationStatus === "valid") return "healthy";
  if (row.validationStatus === "invalid") {
    return row.validationError?.toLowerCase().includes("fail") ? "failed" : "unhealthy";
  }
  return "unhealthy";
}

/** Map an integration_connections row to MCP Connection Center card data. */
export function integrationConnectionToMcpConnection(
  row: IntegrationConnection
): McpConnection {
  const configured = row.hasSecret && row.enabled;
  const healthy = row.validationStatus === "valid" && row.enabled;

  return {
    id: row.id,
    provider: row.provider,
    label: row.displayName || PROVIDER_LABELS[row.provider],
    configured,
    healthy,
    lastCheckedAt: row.lastValidatedAt ?? undefined,
    errorMessage: row.validationError ?? undefined,
    status: resolveMcpStatus(row),
  };
}

export function integrationConnectionsToMcpConnections(
  rows: IntegrationConnection[]
): McpConnection[] {
  return rows.map(integrationConnectionToMcpConnection);
}

/** Aggregate workspace integrations into per-provider status for RCA workflow UI. */
export function integrationConnectionsToProviderStatus(
  rows: IntegrationConnection[]
): McpProviderStatus[] {
  return (["jira", "github"] as const).map((provider) => {
    const matches = rows.filter((row) => row.provider === provider);
    const enabled = matches.filter((row) => row.enabled);
    const best =
      enabled.find((row) => row.validationStatus === "valid") ??
      enabled[0] ??
      matches[0];

    if (!best) {
      return {
        provider,
        label: PROVIDER_LABELS[provider],
        connected: false,
        configured: false,
        message: `No ${PROVIDER_LABELS[provider]} connection — configure in Integrations.`,
      };
    }

    const configured = best.hasSecret && best.enabled;
    const connected = best.validationStatus === "valid" && best.enabled;

    return {
      provider,
      label: best.displayName || PROVIDER_LABELS[provider],
      connected,
      configured,
      message:
        best.validationError ??
        (connected
          ? "Validated via integration_connections"
          : configured
            ? "Validation pending or failed — open MCP Connection Center"
            : "Connection disabled or missing credentials"),
    };
  });
}
