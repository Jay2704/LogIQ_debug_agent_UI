import type { Job } from "@/types";

/**
 * URL segment and GET /api/v1/jobs/{job_id} value — prefers backend `job_id` (`job.jobId`).
 */
export function getJobRouteId(job: Pick<Job, "id" | "jobId">): string {
  return job.jobId ?? job.id;
}
