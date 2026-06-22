import { buildSampleTimeline } from "./investigations";
import type { InvestigationReplay, InvestigationReplayEvent } from "@/types";

const GRAPH_NODE_BY_EVENT_TYPE: Record<string, string | undefined> = {
  infra_scale: undefined,
  commit: "commit",
  deployment: "deploy",
  metric_anomaly: "metric",
  alert_fired: "alert",
  incident_opened: "incident",
  rca_complete: "investigation",
  feedback_confirm: "investigation",
};

function graphNodeId(investigationId: string, suffix: string | undefined): string | undefined {
  if (!suffix) return undefined;
  const rootId = `inv-${investigationId}`;
  if (suffix === "investigation") return rootId;
  return `${rootId}-${suffix}`;
}

function toReplayEvent(
  investigationId: string,
  event: InvestigationReplayEvent
): InvestigationReplayEvent {
  const suffix = GRAPH_NODE_BY_EVENT_TYPE[event.eventType];
  return {
    ...event,
    graphNodeId: graphNodeId(investigationId, suffix),
  };
}

export function buildSampleReplay(investigationId: string): InvestigationReplay {
  const timeline = buildSampleTimeline(investigationId);
  const events = [...timeline.events]
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    .map((event) => toReplayEvent(investigationId, event));

  return {
    investigationId,
    events,
    durationMs: Math.max(events.length, 1) * 1500,
  };
}

export async function getMockInvestigationReplay(
  investigationId: string
): Promise<InvestigationReplay> {
  const id = investigationId.trim();
  await new Promise((r) => setTimeout(r, 160));
  return buildSampleReplay(id);
}
