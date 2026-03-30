import type { JobStatus, TriggerType } from "./common";

/** Debug investigation job (links anomaly → RCA pipeline) */
export interface Job {
  /**
   * Backend `job_id` — use for routing (`/jobs/:jobId`) and job detail API paths.
   * When present, prefer this over {@link id} (some APIs expose both `id` and `job_id`).
   */
  jobId?: string;
  id: string;
  anomalyId: string;
  /** Backend `job_type` when provided */
  jobType?: string;
  status: JobStatus;
  trigger: TriggerType;
  createdAt: string;
  service?: string;
  /** From API `triggered_by_user_id` when present */
  triggeredByUserId?: string;
  /** Raw `trigger_source` from API (display when set; may differ from mapped `trigger`) */
  triggerSource?: string;
  /** Optional user-facing summary from API */
  userSummary?: string;
}

/** POST /api/v1/jobs body — camelCase in app code; serialized snake_case for HTTP. */
export interface CreateJobInput {
  jobType: string;
  anomalyId: string;
  runId: string;
  triggeredByUserId: string;
  triggerSource: string;
}
