/** Shared enums and unions for LogIQ domain models */

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
