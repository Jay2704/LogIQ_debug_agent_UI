import type { AnomaliesService } from "@/api/contracts";
import { mockAnomalies } from "@/data/mock/anomalies";

export const mockAnomaliesService: AnomaliesService = {
  async list() {
    return [...mockAnomalies];
  },
};
