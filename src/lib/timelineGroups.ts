import type { TimelineEventGroup } from "@/types";

export const TIMELINE_GROUP_ORDER: TimelineEventGroup[] = [
  "code_changes",
  "deployments",
  "observability",
  "infrastructure",
  "incidents",
  "rca",
  "feedback",
];

export const TIMELINE_GROUP_LABELS: Record<TimelineEventGroup, string> = {
  code_changes: "Code Changes",
  deployments: "Deployments",
  observability: "Observability",
  infrastructure: "Infrastructure",
  incidents: "Incidents",
  rca: "RCA",
  feedback: "Feedback",
};

export const TIMELINE_GROUP_COLORS: Record<
  TimelineEventGroup,
  { border: string; bg: string; text: string }
> = {
  code_changes: {
    border: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.14)",
    text: "#ddd6fe",
  },
  deployments: {
    border: "#f97316",
    bg: "rgba(249, 115, 22, 0.14)",
    text: "#fed7aa",
  },
  observability: {
    border: "#10b981",
    bg: "rgba(16, 185, 129, 0.14)",
    text: "#a7f3d0",
  },
  infrastructure: {
    border: "#64748b",
    bg: "rgba(100, 116, 139, 0.18)",
    text: "#cbd5e1",
  },
  incidents: {
    border: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.14)",
    text: "#fecdd3",
  },
  rca: {
    border: "#22d3ee",
    bg: "rgba(34, 211, 238, 0.14)",
    text: "#a5f3fc",
  },
  feedback: {
    border: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.14)",
    text: "#bfdbfe",
  },
};
