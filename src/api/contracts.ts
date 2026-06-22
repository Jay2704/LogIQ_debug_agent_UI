import type {
  Anomaly,
  AnomalyActivityPoint,
  CreateJobInput,
  CreateUserInput,
  InsightMetrics,
  InvestigationGraph,
  InvestigationTimeline,
  SimilarInvestigationsResult,
  MultiAgentInvestigationReport,
  InvestigationReport,
  Job,
  JobDetailBundle,
  LoginInput,
  RcaAssistiveExplanation,
  RcaResult,
  RcaFeedbackSubmitInput,
  RcaFeedbackSummary,
  RcaEvaluationSummary,
  RcaServiceAccuracyResult,
  RcaConfidenceEvaluation,
  RcaEvaluationTrends,
  ReportArtifact,
  TopRootCauseFileRow,
  User,
  JiraRcaResult,
  JiraTicketSearchHit,
  JiraTicketSummary,
  McpPreviewContextInput,
  McpProviderStatus,
  McpConnection,
  McpConnectionsResult,
  McpProviderId,
  UnifiedInvestigationContext,
  UtilityRunRecord,
  UtilityToolDefinition,
  DemoScenario,
  DemoLaunchInput,
  DemoLaunchResult,
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

/** MCP-powered external investigation context (Jira, GitHub, GitLab). */
export interface McpService {
  /** GET /api/v1/mcp/status — connectivity for phase-1 providers. */
  getStatus(): Promise<McpProviderStatus[]>;
  /** POST /api/v1/mcp/context/preview — aggregate context before RCA. */
  previewContext(input: McpPreviewContextInput): Promise<UnifiedInvestigationContext>;
  /** GET /api/v1/mcp/connections */
  getConnections(): Promise<McpConnectionsResult>;
  /** POST /api/v1/mcp/connections/{provider}/validate */
  validateConnection(provider: McpProviderId): Promise<McpConnection>;
  /** POST /api/v1/mcp/connections/validate-all */
  validateAllConnections(): Promise<McpConnectionsResult>;
}

/** Investigation graph visualization for job detail workspace. */
export interface InvestigationsService {
  /** GET /api/v1/investigations/{id}/graph */
  getGraph(investigationId: string): Promise<InvestigationGraph>;
  /** GET /api/v1/investigations/{id}/similar */
  getSimilarIncidents(investigationId: string): Promise<SimilarInvestigationsResult>;
  /** GET /api/v1/investigations/{id}/timeline */
  getTimeline(investigationId: string): Promise<InvestigationTimeline>;
  /** GET /api/v1/investigations/{id}/multi-agent */
  getMultiAgentReport(investigationId: string): Promise<MultiAgentInvestigationReport>;
  /** POST /api/v1/investigations/{id}/multi-agent/run */
  runMultiAgentInvestigation(
    investigationId: string
  ): Promise<MultiAgentInvestigationReport>;
  /** GET /api/v1/investigations/{id}/report */
  getInvestigationReport(investigationId: string): Promise<InvestigationReport>;
  /** POST /api/v1/investigations/{id}/report/refresh */
  refreshInvestigationReport(investigationId: string): Promise<InvestigationReport>;
}

/** RCA reviewer feedback — confirm, reject, or override outcomes. */
export interface RcaFeedbackService {
  /** GET /api/v1/jobs/{job_id}/rca/feedback */
  getFeedback(jobId: string): Promise<RcaFeedbackSummary>;
  /** POST /api/v1/jobs/{job_id}/rca/feedback */
  submitFeedback(jobId: string, input: RcaFeedbackSubmitInput): Promise<RcaFeedbackSummary>;
}

/** Demo Center — curated scenarios for guided investigation walkthroughs. */
export interface DemoService {
  /** GET /api/v1/demo/scenarios */
  listScenarios(): Promise<DemoScenario[]>;
  /** POST /api/v1/demo/scenarios/{id}/launch */
  launchScenario(scenarioId: string, input: DemoLaunchInput): Promise<DemoLaunchResult>;
}

/** RCA evaluation dashboard aggregates. */
export interface EvaluationService {
  /** GET /api/v1/evaluation/rca/summary */
  getRcaSummary(): Promise<RcaEvaluationSummary>;
  /** GET /api/v1/evaluation/rca/services */
  getRcaServices(): Promise<RcaServiceAccuracyResult>;
  /** GET /api/v1/evaluation/rca/confidence */
  getRcaConfidence(): Promise<RcaConfidenceEvaluation>;
  /** GET /api/v1/evaluation/rca/trends */
  getRcaTrends(): Promise<RcaEvaluationTrends>;
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
  mcp: McpService;
  investigations: InvestigationsService;
  rcaFeedback: RcaFeedbackService;
  evaluation: EvaluationService;
  demo: DemoService;
  users: UsersService;
  auth: AuthService;
}
