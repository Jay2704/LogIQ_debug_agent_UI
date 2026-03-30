/**
 * Types used by the API layer — re-exported for consumers that prefer `@/api/types`.
 * Domain definitions live under `src/types/domain/`; the barrel is `@/types`.
 */
export type {
  JobStatus,
  TriggerType,
  AnomalySeverity,
  AnomalyStatus,
  Job,
  CreateJobInput,
  Anomaly,
  RcaResult,
  JobExplanation,
  EvidenceItem,
  SimilarIncident,
  JobDetailBundle,
  ReportStatus,
  ReportArtifact,
  RecurringIncidentSignal,
  InsightMetrics,
  AnomalyActivityPoint,
  TopRootCauseFileRow,
  UtilityCategory,
  UtilityIconKey,
  UtilityToolDefinition,
  UtilityRunRecord,
} from "@/types";

/** Future: pagination envelope from the backend */
export interface Paginated<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}
