import type { JobStatus, TriggerType } from "./common";

/** Debug investigation job (links anomaly → RCA pipeline) */
export interface Job {
  id: string;
  anomalyId: string;
  status: JobStatus;
  trigger: TriggerType;
  createdAt: string;
  service?: string;
}
