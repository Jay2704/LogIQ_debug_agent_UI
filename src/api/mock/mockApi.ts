/**
 * Composes mock service implementations into {@link import('@/api/contracts').LogIQApi}.
 * Replace with {@link import('@/api/http/createHttpApi').createHttpApi} when integrating.
 */
import type { LogIQApi } from "@/api/contracts";
import { mockAnomaliesService } from "./anomalies";
import { mockDashboardService } from "./dashboard";
import { mockInsightsService } from "./insights";
import { mockJobsService } from "./jobs";
import { mockRcaService } from "./rca";
import { mockReportsService } from "./reports";

export function createMockApi(): LogIQApi {
  return {
    jobs: mockJobsService,
    anomalies: mockAnomaliesService,
    rca: mockRcaService,
    reports: mockReportsService,
    insights: mockInsightsService,
    dashboard: mockDashboardService,
  };
}
