import type {
  InvestigationReplay,
  InvestigationReplayEvent,
  TimelineEventGroup,
  TimelineEventSeverity,
} from "@/types";
import { REPLAY_STEP_MS } from "@/types/domain/investigationReplay";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

const GROUPS = new Set<TimelineEventGroup>([
  "code_changes",
  "deployments",
  "observability",
  "infrastructure",
  "incidents",
  "rca",
  "feedback",
]);

const SEVERITIES = new Set<TimelineEventSeverity>([
  "info",
  "low",
  "medium",
  "high",
  "critical",
]);

function parseEventRow(row: unknown, index: number): InvestigationReplayEvent | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id) || `replay-event-${index + 1}`;
  const timestamp =
    readString(r.timestamp) || readString(r.occurred_at) || readString(r.occurredAt);
  const title = readString(r.title);
  if (!timestamp || !title) return null;
  const groupRaw = readString(r.group) || readString(r.category) || "observability";
  const group = GROUPS.has(groupRaw as TimelineEventGroup)
    ? (groupRaw as TimelineEventGroup)
    : "observability";
  const severityRaw = readString(r.severity, "info");
  const severity = SEVERITIES.has(severityRaw as TimelineEventSeverity)
    ? (severityRaw as TimelineEventSeverity)
    : "info";
  const graphNodeId =
    readString(r.graph_node_id) || readString(r.graphNodeId) || undefined;

  return {
    id,
    timestamp,
    eventType: readString(r.event_type) || readString(r.eventType) || readString(r.type),
    group,
    source: readString(r.source),
    title,
    description: readString(r.description),
    severity,
    graphNodeId: graphNodeId || undefined,
  };
}

export function parseInvestigationReplayJson(
  json: unknown,
  investigationId: string
): InvestigationReplay {
  if (!json || typeof json !== "object") {
    return { investigationId, events: [], durationMs: 0 };
  }

  const r = json as Record<string, unknown>;
  const eventsRaw = r.events ?? r.steps ?? r.timeline;
  const events = Array.isArray(eventsRaw)
    ? eventsRaw
        .map((row, index) => parseEventRow(row, index))
        .filter((row): row is InvestigationReplayEvent => row !== null)
        .sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
    : [];

  const durationMs =
    readNumber(r.duration_ms) ||
    readNumber(r.durationMs) ||
    Math.max(events.length, 1) * REPLAY_STEP_MS;

  return {
    investigationId: readString(r.investigation_id, investigationId) || investigationId,
    events,
    durationMs,
  };
}
