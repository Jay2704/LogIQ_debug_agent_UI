/** Visual grouping for timeline events in the investigation workspace. */
export type TimelineEventGroup =
  | "code_changes"
  | "deployments"
  | "observability"
  | "infrastructure"
  | "incidents"
  | "rca"
  | "feedback";

export type TimelineEventSeverity = "info" | "low" | "medium" | "high" | "critical";

export interface InvestigationTimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  group: TimelineEventGroup;
  source: string;
  title: string;
  description: string;
  severity: TimelineEventSeverity;
}

export interface InvestigationTimeline {
  investigationId: string;
  events: InvestigationTimelineEvent[];
}

export interface TimelineFilters {
  startDate: string;
  endDate: string;
  eventTypes: string[];
  sources: string[];
}
