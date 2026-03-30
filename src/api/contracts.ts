import type {
  Anomaly,
  AnomalyActivityPoint,
  InsightMetrics,
  Job,
  JobDetailBundle,
  RcaResult,
  ReportArtifact,
  TopRootCauseFileRow,
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

/** Dashboard-only widgets (activity spark, top files) — separate from heavy insights API. */
export interface DashboardService {
  getAnomalyActivity(): Promise<AnomalyActivityPoint[]>;
  getTopRootCauseFiles(): Promise<TopRootCauseFileRow[]>;
}

/** Root API surface — one place to mock or replace with fetch-based client. */
export interface LogIQApi {
  jobs: JobsService;
  anomalies: AnomaliesService;
  rca: RcaService;
  reports: ReportsService;
  insights: InsightsService;
  dashboard: DashboardService;
}
