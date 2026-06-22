import type {
  Anomaly,
  AnomalyActivityPoint,
  CreateJobInput,
  CreateUserInput,
  InsightMetrics,
  Job,
  JobDetailBundle,
  LoginInput,
  RcaAssistiveExplanation,
  RcaResult,
  ReportArtifact,
  TopRootCauseFileRow,
  User,
  JiraRcaResult,
  JiraTicketSearchHit,
  JiraTicketSummary,
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
  /** POST /api/v1/rca/run — triggers deterministic RCA pipeline for an anomaly. */
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

/** JIRA ticket intake used as the first step of investigation workflow. */
export interface JiraService {
  /** GET /api/v1/jira/tickets/search?q=… — partial key or summary text. */
  searchTickets(query: string): Promise<JiraTicketSearchHit[]>;
  /** GET /api/v1/jira/ticket/:ticket_key — full ticket for RCA intake. */
  getTicketSummary(ticketKey: string): Promise<JiraTicketSummary>;
  runRcaWithTicket(input: {
    ticket: JiraTicketSummary;
    logContent: string;
  }): Promise<JiraRcaResult>;
}

/** User CRUD-style helpers for signup / lookup (no token auth in this layer yet). */
export interface UsersService {
  create(input: CreateUserInput): Promise<User>;
  getUserById(userId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
}

/** Successful login — user profile plus JWT from `POST /api/v1/auth/login`. */
export interface LoginResult {
  user: User;
  accessToken: string;
}

/** POST /api/v1/auth/login — returns user profile and JWT access token. */
export interface AuthService {
  login(input: LoginInput): Promise<LoginResult>;
  /** POST /api/v1/auth/verify-email — body `{ token }`. */
  verifyEmail(token: string): Promise<void>;
  /** POST /api/v1/auth/forgot-password — body `{ email }`; do not leak existence of account. */
  forgotPassword(email: string): Promise<void>;
  /** POST /api/v1/auth/reset-password — body `{ token, password }`. */
  resetPassword(token: string, password: string): Promise<void>;
  /** POST /api/v1/auth/resend-verification — body `{ email }`. */
  resendVerificationEmail(email: string): Promise<void>;
}

/** Root API surface — one place to mock or replace with fetch-based client. */
export interface LogIQApi {
  jobs: JobsService;
  anomalies: AnomaliesService;
  rca: RcaService;
  reports: ReportsService;
  insights: InsightsService;
  dashboard: DashboardService;
  utilities: UtilitiesService;
  jira: JiraService;
  users: UsersService;
  auth: AuthService;
}
