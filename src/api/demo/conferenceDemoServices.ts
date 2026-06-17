import type {
  AnomaliesService,
  DashboardService,
  InsightsService,
  JobsService,
  JiraService,
  RcaService,
} from "@/api/contracts";
import { mapTriggerSource } from "@/api/http/parseApiJob";
import {
  CONFERENCE_ANOMALIES,
  CONFERENCE_DASHBOARD_METRICS,
  CONFERENCE_INSIGHT_METRICS,
  CONFERENCE_INVESTIGATIONS,
  CONFERENCE_JIRA_SEARCH,
  CONFERENCE_RCA_BY_JOB_ID,
  getConferenceExplanationForJob,
  getConferenceJiraRcaResult,
  getConferenceJiraTicketSummary,
  getConferenceJobDetailBundle,
  getConferenceRcaByJobId,
} from "@/data/demo/conferenceDemoData";
import type { CreateJobInput, Job, RcaAssistiveExplanation } from "@/types";

const runtimeJobs: Job[] = [];

function withCanonicalJobId(j: Job): Job {
  const id = j.jobId ?? j.id;
  return { ...j, id, jobId: id };
}

export const conferenceJobsService: JobsService = {
  async list() {
    return [...CONFERENCE_INVESTIGATIONS, ...runtimeJobs].map(withCanonicalJobId);
  },
  async getDetailBundle(jobId: string) {
    const bundle = getConferenceJobDetailBundle(jobId);
    if (!bundle) return undefined;
    return { ...bundle, jobRowSource: "mock" as const };
  },
  async create(input: CreateJobInput) {
    const id = `INV-${1006 + runtimeJobs.length}`;
    const job: Job = {
      jobId: id,
      id,
      jobType: input.jobType.trim(),
      anomalyId: input.anomalyId.trim(),
      status: "queued",
      trigger: mapTriggerSource(input.triggerSource),
      createdAt: new Date().toISOString(),
      triggeredByUserId: input.triggeredByUserId.trim(),
      triggerSource: input.triggerSource.trim(),
      userSummary: "New investigation",
    };
    runtimeJobs.push(job);
    return job;
  },
};

export const conferenceAnomaliesService: AnomaliesService = {
  async list() {
    return [...CONFERENCE_ANOMALIES];
  },
};

export const conferenceRcaService: RcaService = {
  async getByJobIdMap() {
    return { ...CONFERENCE_RCA_BY_JOB_ID };
  },
  async getResultsByAnomalyId(_anomalyId: string, jobId: string) {
    return getConferenceRcaByJobId(jobId) ?? null;
  },
  async getExplanationByAnomalyId(anomalyId: string): Promise<RcaAssistiveExplanation> {
    const job = CONFERENCE_INVESTIGATIONS.find((j) => j.anomalyId === anomalyId);
    const summary = job ? getConferenceExplanationForJob(job.id) : "";
    return {
      explanationSummary: summary,
      evidenceHighlights: summary ? ["Conference demo fixture — deterministic RCA narrative."] : [],
      confidenceAlignmentNote:
        "Assistive layer aligns with deterministic RCA confidence from the primary result card.",
      limitations: "Conference demo dataset — representative output for demonstration purposes.",
      remediationSteps: summary
        ? getConferenceJobDetailBundle(job!.id)?.remediation ?? []
        : [],
      patchDirection: summary
        ? "Target ranked file anchor; validate with staging reproduction."
        : undefined,
      finalReportSummary: summary || undefined,
    };
  },
};

export const conferenceJiraService: JiraService = {
  async searchTickets(query: string) {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [...CONFERENCE_JIRA_SEARCH];
    return CONFERENCE_JIRA_SEARCH.filter(
      (row) =>
        row.key.toLowerCase().includes(q) || row.summary.toLowerCase().includes(q)
    );
  },
  async getTicketSummary(ticketKey: string) {
    return getConferenceJiraTicketSummary(ticketKey);
  },
  async runRcaWithTicket({ ticket, logContent }) {
    return getConferenceJiraRcaResult(ticket, logContent);
  },
};

export const conferenceInsightsService: InsightsService = {
  async getMetrics() {
    return { ...CONFERENCE_INSIGHT_METRICS };
  },
};

/** Dashboard widgets enriched with conference headline metrics. */
export const conferenceDashboardService: DashboardService = {
  async getAnomalyActivity() {
    return [
      { label: "00:00", count: 1 },
      { label: "04:00", count: 2 },
      { label: "08:00", count: 3 },
      { label: "12:00", count: 5 },
      { label: "16:00", count: 4 },
      { label: "20:00", count: 2 },
    ];
  },
  async getTopRootCauseFiles() {
    return [
      { path: "/srv/auth/otp_service.py", hits: 28, trend: "up" },
      { path: "/services/payments/gateway_client.py", hits: 21, trend: "up" },
      { path: "/db/connection_pool.py", hits: 16, trend: "flat" },
      { path: "/streaming/consumer_worker.py", hits: 12, trend: "up" },
      { path: "/middleware/rate_limit.py", hits: 9, trend: "down" },
    ];
  },
};

export { CONFERENCE_DASHBOARD_METRICS };
