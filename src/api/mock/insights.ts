import type { InsightsService } from "@/api/contracts";
import { mockInsightMetrics } from "@/data/mock/insights";

export const mockInsightsService: InsightsService = {
  async getMetrics() {
    return { ...mockInsightMetrics };
  },
};
