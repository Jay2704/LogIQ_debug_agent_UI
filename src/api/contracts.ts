import type {
  Anomaly,
  InsightMetrics,
  Job,
  JobDetailBundle,
  RcaResult,
  ReportArtifact,
} from "@/types";

/**
 * Contract for job / investigation endpoints. Swap implementation for HTTP
 * without changing UI — keep method shapes stable.
 */
export interface JobsService {
  list(): Promise<Job[]>;
  getDetailBundle(jobId: string): Promise<JobDetailBundle | undefined>;
}

export interface AnomaliesService {
  list(): Promise<Anomaly[]>;
}

/** RCA aggregates used by dashboard and future insights views. */
export interface RcaService {
  getByJobIdMap(): Promise<Record<string, RcaResult>>;
}

export interface ReportsService {
  list(): Promise<ReportArtifact[]>;
  getByAnomalyId(anomalyId: string): Promise<ReportArtifact | undefined>;
}

export interface InsightsService {
  getMetrics(): Promise<InsightMetrics>;
}

/** Root API surface — one place to mock or replace with fetch-based client. */
export interface LogIQApi {
  jobs: JobsService;
  anomalies: AnomaliesService;
  rca: RcaService;
  reports: ReportsService;
  insights: InsightsService;
}
