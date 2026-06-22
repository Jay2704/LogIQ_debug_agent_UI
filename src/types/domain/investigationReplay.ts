import type { TimelineEventGroup, TimelineEventSeverity } from "./investigationTimeline";

/** Single step in an investigation replay sequence. */
export interface InvestigationReplayEvent {
  id: string;
  timestamp: string;
  eventType: string;
  group: TimelineEventGroup;
  source: string;
  title: string;
  description: string;
  severity: TimelineEventSeverity;
  /** Graph node revealed when this step plays (optional sync). */
  graphNodeId?: string;
}

export interface InvestigationReplay {
  investigationId: string;
  events: InvestigationReplayEvent[];
  /** Suggested playback duration at 1× speed (ms). */
  durationMs: number;
}

export type ReplaySpeed = 1 | 2 | 5;

export const REPLAY_SPEED_OPTIONS: ReplaySpeed[] = [1, 2, 5];

/** Base interval between replay steps at 1× speed. */
export const REPLAY_STEP_MS = 1500;
