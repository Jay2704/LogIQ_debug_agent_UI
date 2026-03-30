import type { Anomaly, Job, JobDetailBundle, RcaResult, SimilarIncident } from "@/types";

/** Demo-only similar incidents when the job id is not in local fixtures (see `jobDetailMerge.ts`). */
const MOCK_SUPPLEMENT_SIMILAR_INCIDENTS: SimilarIncident[] = [
  {
    id: "mock-sim-demo",
    service: "demo",
    title: "Sample similar incident (mock)",
    occurredAt: new Date().toISOString(),
    overlap: "Placeholder until the API exposes similarity search",
  },
];

function placeholderAnomaly(anomalyId: string): Anomaly {
  return {
    id: anomalyId,
    service: "—",
    severity: "medium",
    status: "investigating",
    detectedAt: new Date().toISOString(),
    summary:
      "Anomaly record is not loaded from the API yet; this block uses a placeholder for layout.",
    signalType: "unknown",
  };
}

function placeholderRca(jobId: string): RcaResult {
  return {
    jobId,
    fileId: "pending",
    runId: "pending",
    rootCausePath:
      "Connect GET /api/v1/rca/* endpoints to populate deterministic RCA.",
    confidence: 0,
    rank: 0,
    evidenceRef: "",
    steps: {
      triage: "pending",
      rca: "pending",
      evidence: "pending",
      explanation: "pending",
      reporting: "pending",
    },
  };
}

/**
 * Wraps a live GET /api/v1/jobs/{job_id} row into {@link JobDetailBundle}.
 * Does not merge `src/data/mock/` job bundles — UI sections without backend support use
 * placeholders / {@link MOCK_SUPPLEMENT_SIMILAR_INCIDENTS} only.
 */
export function buildJobDetailBundleFromApiJob(apiJob: Job, jobId: string): JobDetailBundle {
  return {
    job: apiJob,
    jobRowSource: "api",
    anomaly: placeholderAnomaly(apiJob.anomalyId),
    rca: placeholderRca(jobId),
    explanation:
      "RCA narrative will appear here once explanation endpoints are wired. The job row above is loaded from the API.",
    evidence: [],
    remediation: [
      "Remediation steps are not returned by the job API yet — showing mock placeholder text.",
    ],
    similarIncidents: MOCK_SUPPLEMENT_SIMILAR_INCIDENTS,
    confidenceNote:
      "Confidence scoring requires RCA API data; job metadata above is live from the backend.",
    limitationsNote:
      "Extended limitations are not available from the API for this job id.",
  };
}
