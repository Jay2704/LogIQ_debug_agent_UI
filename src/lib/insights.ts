import type { Job } from "@/types";

/** Pure KPI derivation from job list — usable with API or mock data. */
export function computeJobStatusSummary(jobs: Job[]) {
  const total = jobs.length;
  const running = jobs.filter((j) => j.status === "running").length;
  const completed = jobs.filter((j) => j.status === "completed").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  return { total, running, completed, failed };
}
