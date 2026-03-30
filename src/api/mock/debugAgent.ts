import type { DebugAgentService } from "@/api/contracts";

export const mockDebugAgentService: DebugAgentService = {
  async run() {
    await new Promise((r) => setTimeout(r, 450));
  },
};
