/**
 * Composes mock service implementations into `LogIQApi`.
 *
 * **Live vs mock split:** `createHttpApi` delegates anomalies, reports, insights, dashboard,
 * and utilities to this same mock layer until those backends exist — so demo pages stay
 * polished without stubbing each route in the HTTP client. Jobs / RCA use real `fetch` when
 * `VITE_USE_HTTP=true`.
 */
import type { LogIQApi } from "@/api/contracts";
import { mockAnomaliesService } from "./anomalies";
import { mockDashboardService } from "./dashboard";
import { mockInsightsService } from "./insights";
import { mockJobsService } from "./jobs";
import { mockRcaService } from "./rca";
import { mockReportsService } from "./reports";
import { mockUtilitiesService } from "./utilitiesTools";
import { mockJiraService } from "./jira";
import { mockMcpService } from "./mcp";
import { mockAuthService, mockUsersService } from "./users";

export function createMockApi(): LogIQApi {
  return {
    jobs: mockJobsService,
    anomalies: mockAnomaliesService,
    rca: mockRcaService,
    reports: mockReportsService,
    insights: mockInsightsService,
    dashboard: mockDashboardService,
    utilities: mockUtilitiesService,
    jira: mockJiraService,
    mcp: mockMcpService,
    users: mockUsersService,
    auth: mockAuthService,
  };
}
