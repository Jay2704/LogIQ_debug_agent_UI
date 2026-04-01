import type {
  Anomaly,
  AnomalyActivityPoint,
  CreateJobInput,
  CreateUserInput,
  InsightMetrics,
  Job,
  JobDetailBundle,
  RcaAssistiveExplanation,
  RcaResult,
  ReportArtifact,
  TopRootCauseFileRow,
  User,
  UtilityRunRecord,
  UtilityToolDefinition,
} from "@/types";

/**
 * Contract for job / investigation endpoints. Swap implementation for HTTP
 * without changing UI — keep method shapes stable.
 */
export interface JobsService {
  list(): Promise<Job[]>;
  getDetailBundle(jobId: string): Promise<JobDetailBundle | undefined>;
  /** POST /api/v1/jobs — creates a job row on the backend (or mock session). */
  create(input: CreateJobInput): Promise<Job>;
}

export interface AnomaliesService {
  list(): Promise<Anomaly[]>;
}

/** RCA aggregates used by dashboard and future insights views. */
export interface RcaService {
  getByJobIdMap(): Promise<Record<string, RcaResult>>;
  /** Live backend: anomaly-driven deterministic RCA result (may be null if no candidates). */
  getResultsByAnomalyId(
    anomalyId: string,
    jobId: string
  ): Promise<RcaResult | null>;
  /** Live backend: assistive explanation layer (LLM narrative). */
  getExplanationByAnomalyId(
    anomalyId: string
  ): Promise<RcaAssistiveExplanation>;
}

/** Triggers backend RCA pipeline for an anomaly (POST /debug-agent/run). */
export interface DebugAgentService {
  run(anomalyId: string): Promise<void>;
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

/** Standalone log utilities — independent from RCA job pipeline */
export interface UtilitiesService {
  listTools(): Promise<UtilityToolDefinition[]>;
  getTool(id: string): Promise<UtilityToolDefinition | undefined>;
  getMostUsedToolIds(): Promise<string[]>;
  getRecentRuns(): Promise<UtilityRunRecord[]>;
}

/** User CRUD-style helpers for signup / lookup (no token auth in this layer yet). */
export interface UsersService {
  create(input: CreateUserInput): Promise<User>;
  getUserById(userId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
}

/** Root API surface — one place to mock or replace with fetch-based client. */
export interface LogIQApi {
  jobs: JobsService;
  anomalies: AnomaliesService;
  rca: RcaService;
  debugAgent: DebugAgentService;
  reports: ReportsService;
  insights: InsightsService;
  dashboard: DashboardService;
  utilities: UtilitiesService;
  users: UsersService;
}
