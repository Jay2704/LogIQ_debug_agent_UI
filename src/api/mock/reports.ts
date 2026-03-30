import type { ReportsService } from "@/api/contracts";
import { getReportByAnomalyId, mockReports } from "@/data/mock/reports";

export const mockReportsService: ReportsService = {
  async list() {
    return [...mockReports];
  },
  async getByAnomalyId(anomalyId: string) {
    return getReportByAnomalyId(anomalyId);
  },
};
