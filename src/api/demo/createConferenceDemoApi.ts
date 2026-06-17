import type { LogIQApi } from "@/api/contracts";
import { createMockApi } from "@/api/mock/mockApi";
import {
  conferenceAnomaliesService,
  conferenceDashboardService,
  conferenceInsightsService,
  conferenceJobsService,
  conferenceJiraService,
  conferenceRcaService,
} from "./conferenceDemoServices";

/**
 * Conference demo API — always succeeds with realistic fixtures.
 * Used when {@link DEMO_MODE} is enabled regardless of HTTP env flags.
 */
export function createConferenceDemoApi(): LogIQApi {
  const base = createMockApi();
  return {
    ...base,
    jobs: conferenceJobsService,
    anomalies: conferenceAnomaliesService,
    rca: conferenceRcaService,
    jira: conferenceJiraService,
    insights: conferenceInsightsService,
    dashboard: conferenceDashboardService,
  };
}
