import type { DashboardService } from "@/api/contracts";
import {
  mockAnomalyActivity,
  mockTopRootCauseFiles,
} from "@/data/mock/dashboard";

export const mockDashboardService: DashboardService = {
  async getAnomalyActivity() {
    return mockAnomalyActivity.map((p) => ({ ...p }));
  },
  async getTopRootCauseFiles() {
    return mockTopRootCauseFiles.map((r) => ({ ...r }));
  },
};
