import type { UtilitiesService } from "@/api/contracts";
import {
  utilityMostUsedIds,
  utilityRecentRuns,
  utilityTools,
} from "@/data/mock/utilities";

export const mockUtilitiesService: UtilitiesService = {
  async listTools() {
    return utilityTools.map((t) => ({ ...t }));
  },
  async getTool(id: string) {
    return utilityTools.find((t) => t.id === id) ?? undefined;
  },
  async getMostUsedToolIds() {
    return [...utilityMostUsedIds];
  },
  async getRecentRuns() {
    return utilityRecentRuns.map((r) => ({ ...r }));
  },
};
