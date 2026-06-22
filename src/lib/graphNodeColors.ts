import type { InvestigationGraphNodeType } from "@/types";

export const GRAPH_NODE_TYPE_LABELS: Record<InvestigationGraphNodeType, string> = {
  investigation: "Investigation",
  jira: "Jira",
  commit: "Commit",
  build: "Build",
  deployment: "Deployment",
  metric: "Metric",
  alert: "Alert",
  incident: "Incident",
  runbook: "Runbook",
};

export const GRAPH_NODE_COLORS: Record<
  InvestigationGraphNodeType,
  { background: string; border: string; color: string }
> = {
  investigation: {
    background: "rgba(34, 211, 238, 0.2)",
    border: "#22d3ee",
    color: "#a5f3fc",
  },
  jira: {
    background: "rgba(59, 130, 246, 0.2)",
    border: "#3b82f6",
    color: "#bfdbfe",
  },
  commit: {
    background: "rgba(139, 92, 246, 0.2)",
    border: "#8b5cf6",
    color: "#ddd6fe",
  },
  build: {
    background: "rgba(245, 158, 11, 0.2)",
    border: "#f59e0b",
    color: "#fde68a",
  },
  deployment: {
    background: "rgba(249, 115, 22, 0.2)",
    border: "#f97316",
    color: "#fed7aa",
  },
  metric: {
    background: "rgba(16, 185, 129, 0.2)",
    border: "#10b981",
    color: "#a7f3d0",
  },
  alert: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "#ef4444",
    color: "#fecaca",
  },
  incident: {
    background: "rgba(244, 63, 94, 0.2)",
    border: "#f43f5e",
    color: "#fecdd3",
  },
  runbook: {
    background: "rgba(20, 184, 166, 0.2)",
    border: "#14b8a6",
    color: "#99f6e4",
  },
};

const TYPE_LAYER_ORDER: InvestigationGraphNodeType[] = [
  "investigation",
  "jira",
  "alert",
  "incident",
  "commit",
  "build",
  "deployment",
  "metric",
  "runbook",
];

/** Simple layered layout when the API omits node positions. */
export function layoutGraphPositions(
  nodes: { id: string; type: InvestigationGraphNodeType; position?: { x: number; y: number } }[]
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const layerCounts = new Map<InvestigationGraphNodeType, number>();

  for (const node of nodes) {
    if (node.position) {
      positions.set(node.id, node.position);
      continue;
    }

    const layerIndex = TYPE_LAYER_ORDER.indexOf(node.type);
    const row = layerIndex >= 0 ? layerIndex : TYPE_LAYER_ORDER.length;
    const col = layerCounts.get(node.type) ?? 0;
    layerCounts.set(node.type, col + 1);
    positions.set(node.id, { x: col * 240, y: row * 130 });
  }

  return positions;
}
