/**
 * Static demo fixtures for pages not yet backed by HTTP (`createHttpApi` delegates here for
 * anomalies, reports, insights, dashboard, utilities). Do not import these from UI — use `api`
 * from `@/api` only.
 */
export { mockJobs } from "./jobs";
export { mockAnomalies } from "./anomalies";
export { mockRcaByJobId } from "./rca";
export { getJobDetailBundle } from "./explanations";
export { mockInsightMetrics } from "./insights";
export { mockReports, getReportByAnomalyId } from "./reports";
export {
  mockAnomalyActivity,
  mockTopRootCauseFiles,
} from "./dashboard";
export {
  utilityTools,
  utilityMostUsedIds,
  utilityRecentRuns,
} from "./utilities";
