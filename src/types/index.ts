/**
 * Public domain model exports — single import surface for app + API contracts.
 * Implementation details stay in {@link import('@/data/mock')} and {@link import('@/api')}.
 */
export type {
  JobStatus,
  TriggerType,
  AnomalySeverity,
  AnomalyStatus,
} from "./domain/common";
export type { Job, CreateJobInput } from "./domain/job";
export type { Anomaly } from "./domain/anomaly";
export type { RcaResult } from "./domain/rca";
export type {
  JobExplanation,
  EvidenceItem,
  AssistiveSourceHint,
  RcaAssistiveExplanation,
} from "./domain/explanation";
export type {
  SimilarIncident,
  JobDetailBundle,
} from "./domain/bundle";
export type { ReportStatus, ReportArtifact } from "./domain/report";
export type { RecurringIncidentSignal, InsightMetrics } from "./domain/insights";
export type {
  AnomalyActivityPoint,
  TopRootCauseFileRow,
} from "./domain/dashboard";
export type {
  UtilityCategory,
  UtilityIconKey,
  UtilityToolDefinition,
  UtilityRunRecord,
} from "./domain/utilities";
export type {
  JiraTicketSummary,
  JiraRcaResult,
  JiraTicketSearchHit,
} from "./domain/jira";
export type {
  McpProviderId,
  McpProviderStatus,
  CommitEvent,
  PullRequestEvent,
  MergeRequestEvent,
  UnifiedInvestigationContext,
  McpPreviewContextInput,
  McpConnection,
  McpConnectionStatus,
  McpConnectionsResult,
} from "./domain/mcp";
export { resolveMcpConnectionStatus } from "./domain/mcp";
export type {
  InvestigationGraphNodeType,
  InvestigationGraphNode,
  InvestigationGraphEdge,
  InvestigationGraph,
} from "./domain/investigationGraph";
export type {
  TimelineEventGroup,
  TimelineEventSeverity,
  InvestigationTimelineEvent,
  InvestigationTimeline,
  TimelineFilters,
} from "./domain/investigationTimeline";
export type {
  InvestigationAgentId,
  MultiAgentRunStatus,
  AgentRunStatus,
  AgentFinding,
  MultiAgentPanel,
  MultiAgentInvestigationSummary,
  MultiAgentInvestigationReport,
} from "./domain/multiAgent";
export {
  INVESTIGATION_AGENT_LABELS,
  INVESTIGATION_AGENT_ORDER,
} from "./domain/multiAgent";
export type {
  InvestigationReplay,
  InvestigationReplayEvent,
  ReplaySpeed,
} from "./domain/investigationReplay";
export {
  REPLAY_SPEED_OPTIONS,
  REPLAY_STEP_MS,
} from "./domain/investigationReplay";
export type {
  EvidenceCoverage,
  EvidenceCoverageLevel,
} from "./domain/evidenceCoverage";
export { EVIDENCE_COVERAGE_LEVEL_LABELS } from "./domain/evidenceCoverage";
export type {
  InvestigationReport,
  InvestigationReportSimilarIncident,
  InvestigationReportFeedbackEntry,
  InvestigationReportMultiAgentFinding,
  InvestigationReportRunbook,
} from "./domain/investigationReport";
export type {
  SimilarHistoricalInvestigation,
  SimilarInvestigationsResult,
} from "./domain/similarInvestigation";
export type {
  RcaFeedbackAction,
  RcaFeedbackEntry,
  RcaFeedbackSummary,
  RcaFeedbackSubmitInput,
} from "./domain/rcaFeedback";
export type {
  RcaEvaluationSummary,
  RcaServiceAccuracyRow,
  RcaServiceAccuracyResult,
  RcaConfidenceAccuracyRow,
  RcaConfidenceEvaluation,
  RcaFeedbackTrendPoint,
  RcaCandidateRow,
  RcaEvaluationTrends,
} from "./domain/rcaEvaluation";
export type {
  DemoScenario,
  DemoLaunchInput,
  DemoLaunchResult,
} from "./domain/demo";
export type { UserRole, User, CreateUserInput } from "./domain/user";
export { SIGNUP_ROLE_OPTIONS } from "./domain/user";
export type {
  IntegrationProvider,
  IntegrationValidationStatus,
  IntegrationConnection,
  JiraIntegrationConnection,
  GitHubIntegrationConnection,
  CreateIntegrationConnectionInput,
  CreateJiraConnectionInput,
  CreateGitHubConnectionInput,
  UpdateIntegrationConnectionInput,
  UpdateJiraConnectionInput,
  UpdateGitHubConnectionInput,
  ValidateIntegrationConnectionResult,
} from "./domain/integration";
export type { RcaRunInput } from "./domain/rcaRun";
export type {
  McpSignalKey,
  McpJiraArtifactRef,
  McpGitHubArtifactRef,
  McpArtifactRefs,
  McpContextSummary,
  RcaMcpInvestigationContext,
} from "./domain/rcaMcpSignals";
export { MCP_SIGNAL_KEYS } from "./domain/rcaMcpSignals";

export type {
  LoginInput,
  LoginFormValues,
  LoginSubmitResult,
  LoginLookupResult,
  SignupFormValues,
  AuthSubmitStatus,
  AuthSubmitResult,
} from "./auth";
