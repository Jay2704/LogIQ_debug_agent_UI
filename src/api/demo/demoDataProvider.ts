import type { Anomaly, Job, JobDetailBundle, JiraRcaResult, JiraTicketSummary } from "@/types";
import {
  CONFERENCE_ANOMALIES,
  CONFERENCE_INVESTIGATIONS,
  getConferenceJiraRcaResult,
  getConferenceJiraTicketSummary,
  getConferenceJobDetailBundle,
  getConferenceRcaByJobId,
} from "@/data/demo/conferenceDemoData";
import { DEMO_MODE } from "@/lib/demoMode";

/** True when the app must behave as if the backend is always available. */
export function shouldUseDemoData(): boolean {
  return DEMO_MODE;
}

export function getDemoJobs(): Job[] {
  return CONFERENCE_INVESTIGATIONS.map((j) => ({ ...j }));
}

export function getDemoAnomalies(): Anomaly[] {
  return CONFERENCE_ANOMALIES.map((a) => ({ ...a }));
}

export function getDemoJobDetailBundle(
  jobId: string | undefined
): JobDetailBundle | undefined {
  const id = jobId?.trim();
  if (!id) return undefined;
  return getConferenceJobDetailBundle(id);
}

export function getDemoJiraTicket(ticketKey: string): JiraTicketSummary {
  return getConferenceJiraTicketSummary(ticketKey);
}

export function getDemoJiraRca(
  ticket: JiraTicketSummary,
  logContent: string
): JiraRcaResult {
  return getConferenceJiraRcaResult(ticket, logContent);
}

export function getDemoRcaForJob(jobId: string) {
  return getConferenceRcaByJobId(jobId);
}

/**
 * Demo-first resolver: returns conference fixtures immediately in DEMO_MODE
 * without touching the network.
 */
export async function resolveDemoFirst<T>(
  load: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (shouldUseDemoData()) return fallback;
  try {
    return await load();
  } catch {
    return fallback;
  }
}
