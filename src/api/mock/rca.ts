import type { RcaService } from "@/api/contracts";
import { mockRcaByJobId } from "@/data/mock/rca";

export const mockRcaService: RcaService = {
  async getByJobIdMap() {
    return { ...mockRcaByJobId };
  },
};
