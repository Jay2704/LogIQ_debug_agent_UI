import type {
  InvestigationGraph,
  InvestigationGraphEdge,
  InvestigationGraphNode,
  InvestigationGraphNodeType,
} from "@/types";

const NODE_TYPES = new Set<InvestigationGraphNodeType>([
  "investigation",
  "jira",
  "commit",
  "build",
  "deployment",
  "metric",
  "alert",
  "incident",
  "runbook",
]);

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readMetadata(
  value: unknown
): Record<string, string | number | boolean | null> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (
      typeof raw === "string" ||
      typeof raw === "number" ||
      typeof raw === "boolean" ||
      raw === null
    ) {
      out[key] = raw;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parsePosition(value: unknown): { x: number; y: number } | undefined {
  if (!value || typeof value !== "object") return undefined;
  const p = value as Record<string, unknown>;
  const x = typeof p.x === "number" ? p.x : Number(p.x);
  const y = typeof p.y === "number" ? p.y : Number(p.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return { x, y };
}

function parseNodeRow(row: unknown): InvestigationGraphNode | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id);
  const rawType = readString(r.type).toLowerCase();
  if (!id || !NODE_TYPES.has(rawType as InvestigationGraphNodeType)) return null;

  return {
    id,
    type: rawType as InvestigationGraphNodeType,
    title: readString(r.title) || readString(r.label) || id,
    timestamp:
      readString(r.timestamp) ||
      readString(r.created_at) ||
      readString(r.createdAt) ||
      undefined,
    metadata: readMetadata(r.metadata),
    position: parsePosition(r.position),
  };
}

function parseEdgeRow(row: unknown): InvestigationGraphEdge | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const source = readString(r.source);
  const target = readString(r.target);
  if (!source || !target) return null;
  const id = readString(r.id) || `${source}->${target}`;
  return {
    id,
    source,
    target,
    label: readString(r.label) || undefined,
  };
}

export function parseInvestigationGraphJson(
  json: unknown,
  fallbackId: string
): InvestigationGraph {
  if (!json || typeof json !== "object") {
    throw new Error(
      "[LogIQ API] GET /api/v1/investigations/:id/graph: invalid JSON payload"
    );
  }

  const data = json as Record<string, unknown>;
  const investigationId =
    readString(data.investigation_id) ||
    readString(data.investigationId) ||
    fallbackId;

  const nodes = (
    Array.isArray(data.nodes) ? data.nodes : []
  )
    .map(parseNodeRow)
    .filter((row): row is InvestigationGraphNode => row !== null);

  const edges = (
    Array.isArray(data.edges) ? data.edges : []
  )
    .map(parseEdgeRow)
    .filter((row): row is InvestigationGraphEdge => row !== null);

  return { investigationId, nodes, edges };
}
