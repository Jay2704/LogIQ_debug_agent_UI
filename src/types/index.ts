export type JobStatus = "queued" | "running" | "completed" | "failed";

export type TriggerType =
  | "alert"
  | "manual"
  | "scheduled"
  | "api"
  | "webhook";

export type AnomalySeverity = "critical" | "high" | "medium" | "low";

export type AnomalyStatus =
  | "open"
  | "investigating"
  | "mitigated"
  | "resolved";

export interface Job {
  id: string;
  anomalyId: string;
  status: JobStatus;
  trigger: TriggerType;
  createdAt: string;
  service?: string;
}

export interface Anomaly {
  id: string;
  service: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  detectedAt: string;
  summary: string;
  signalType: string;
}

export interface RcaResult {
  jobId: string;
  rootCausePath: string;
  confidence: number;
  rank: number;
  evidenceRef: string;
  steps: {
    triage: "pending" | "done" | "active";
    rca: "pending" | "done" | "active";
    evidence: "pending" | "done" | "active";
    explanation: "pending" | "done" | "active";
    reporting: "pending" | "done" | "active";
  };
}

export interface JobExplanation {
  jobId: string;
  markdown: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  detail: string;
  source: string;
}

export interface SimilarIncident {
  id: string;
  title: string;
  occurredAt: string;
  overlap: string;
}

export interface JobDetailBundle {
  job: Job;
  anomaly: Anomaly;
  rca: RcaResult;
  explanation: string;
  evidence: EvidenceItem[];
  remediation: string[];
  similarIncidents: SimilarIncident[];
  confidenceNote: string;
  limitationsNote: string;
}

export type ReportStatus = "ready" | "generating" | "failed";

export interface ReportArtifact {
  id: string;
  anomalyId: string;
  title: string;
  summary: string;
  generatedAt: string;
  status: ReportStatus;
  formats: ("pdf" | "json" | "markdown")[];
}

export interface InsightMetrics {
  anomalyTrend: { date: string; count: number }[];
  anomaliesBySeverity: { name: string; value: number; fill: string }[];
  confidenceDistribution: { range: string; count: number }[];
  topServices: { service: string; count: number }[];
  avgResolutionMinutes: number;
  totalAnomalies: number;
  monitoredServices: number;
}
