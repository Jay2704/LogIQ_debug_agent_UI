import type { McpSignalKey } from "@/types";

export const MCP_SIGNAL_LABELS: Record<McpSignalKey, string> = {
  recent_commit_match: "Recent commit match",
  recent_pr_match: "Recent PR match",
  changed_file_match: "Changed file match",
  jira_ticket_match: "Jira ticket match",
  jira_label_match: "Jira label match",
  author_activity_match: "Author activity match",
};

/** Format signal score for display (0–1 → percent, already percent if > 1). */
export function formatSignalScore(value: number): string {
  const normalized = value > 1 ? value / 100 : value;
  return `${Math.round(Math.min(1, Math.max(0, normalized)) * 100)}%`;
}
