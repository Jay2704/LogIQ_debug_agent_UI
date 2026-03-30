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
export type { Job } from "./domain/job";
export type { Anomaly } from "./domain/anomaly";
export type { RcaResult } from "./domain/rca";
export type { JobExplanation, EvidenceItem } from "./domain/explanation";
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
