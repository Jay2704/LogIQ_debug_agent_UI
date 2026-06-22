import type {
  InvestigationTimeline,
  InvestigationTimelineEvent,
  TimelineEventGroup,
  TimelineEventSeverity,
} from "@/types";

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
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

function normalizeGroup(value: string): TimelineEventGroup | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "_");
  if (GROUPS.has(normalized as TimelineEventGroup)) {
    return normalized as TimelineEventGroup;
  }
  const aliases: Record<string, TimelineEventGroup> = {
    code: "code_changes",
    commit: "code_changes",
    deploy: "deployments",
    deployment: "deployments",
    metric: "observability",
    alert: "observability",
    infra: "infrastructure",
    incident: "incidents",
    investigation: "rca",
    feedback: "feedback",
  };
  return aliases[normalized] ?? null;
}

function parseEventRow(row: unknown): InvestigationTimelineEvent | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const id = readString(r.id);
  const timestamp =
    readString(r.timestamp) || readString(r.occurred_at) || readString(r.occurredAt);
  const eventType =
    readString(r.event_type) || readString(r.eventType) || readString(r.type);
  const groupRaw =
    readString(r.group) || readString(r.category) || eventType;
  const group = normalizeGroup(groupRaw);
  const source = readString(r.source);
  const title = readString(r.title) || readString(r.summary);
  if (!id || !timestamp || !eventType || !group || !source || !title) return null;

  const severityRaw = readString(r.severity, "info").toLowerCase();
  const severity = SEVERITIES.has(severityRaw as TimelineEventSeverity)
    ? (severityRaw as TimelineEventSeverity)
    : "info";

  return {
    id,
    timestamp,
    eventType,
    group,
    source,
    title,
    description:
      readString(r.description) || readString(r.detail) || readString(r.body),
    severity,
  };
}

export function parseInvestigationTimelineJson(
  json: unknown,
  fallbackId: string
): InvestigationTimeline {
  if (!json || typeof json !== "object") {
    throw new Error("[LogIQ API] GET /api/v1/investigations/:id/timeline: invalid JSON payload");
  }

  const data = json as Record<string, unknown>;
  const investigationId =
    readString(data.investigation_id) ||
    readString(data.investigationId) ||
    fallbackId;

  const events = (
    Array.isArray(data.events) ? data.events : []
  )
    .map(parseEventRow)
    .filter((row): row is InvestigationTimelineEvent => row !== null)
    .sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return { investigationId, events };
}
