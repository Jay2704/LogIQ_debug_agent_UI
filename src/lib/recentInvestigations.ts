import type { JiraRcaResult, JiraTicketSummary } from "@/types";

/**
 * JIRA-first RCA investigation history (browser localStorage).
 * When a server-side history API exists, merge remote rows here or replace load/save
 * behind the same {@link RecentInvestigationEntry} shape so the dashboard stays unchanged.
 */
export const RECENT_INVESTIGATIONS_STORAGE_KEY = "logiq.recent_jira_investigations.v1";
const MAX_RECENT_INVESTIGATIONS = 8;

export interface RecentInvestigationEntry {
  id: string;
  timestamp: string;
  ticket: {
    key: string;
    summary: string;
    status: string;
    priority: string;
    extractedHints: string[];
  };
  rca: {
    rootCause: string;
    summary: string;
  };
  log: {
    fileName: string | null;
    lineCount: number;
  };
}

interface RecentInvestigationsPayloadV1 {
  v: 1;
  items: RecentInvestigationEntry[];
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Returns persisted runs from this browser (newest first). */
export function loadRecentInvestigations(): RecentInvestigationEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_INVESTIGATIONS_STORAGE_KEY);
    if (!raw?.trim()) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.v !== 1 || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter((item): item is RecentInvestigationEntry => {
      if (!isRecord(item)) return false;
      return (
        typeof item.id === "string" &&
        typeof item.timestamp === "string" &&
        isRecord(item.ticket) &&
        isRecord(item.rca) &&
        isRecord(item.log)
      );
    });
  } catch {
    return [];
  }
}

export function saveRecentInvestigations(items: RecentInvestigationEntry[]): void {
  const payload: RecentInvestigationsPayloadV1 = {
    v: 1,
    items: items.slice(0, MAX_RECENT_INVESTIGATIONS),
  };
  localStorage.setItem(RECENT_INVESTIGATIONS_STORAGE_KEY, JSON.stringify(payload));
}

export function addRecentInvestigation(
  ticket: JiraTicketSummary,
  rca: JiraRcaResult,
  log: { fileName: string | null; lineCount: number }
): RecentInvestigationEntry[] {
  const next: RecentInvestigationEntry = {
    id: `${ticket.key}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ticket: {
      key: ticket.key,
      summary: ticket.summary,
      status: ticket.status,
      priority: ticket.priority,
      extractedHints: ticket.extractedHints.slice(0, 4),
    },
    rca: {
      rootCause: rca.rootCause,
      summary: rca.explanation || rca.evidenceSummary[0] || "RCA completed",
    },
    log,
  };
  const existing = loadRecentInvestigations().filter((x) => x.ticket.key !== ticket.key);
  const merged = [next, ...existing].slice(0, MAX_RECENT_INVESTIGATIONS);
  saveRecentInvestigations(merged);
  return merged;
}

export function clearRecentInvestigations(): void {
  localStorage.removeItem(RECENT_INVESTIGATIONS_STORAGE_KEY);
}
