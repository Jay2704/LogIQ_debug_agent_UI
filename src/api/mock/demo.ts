import type { DemoService } from "@/api/contracts";
import { DEMO_SCENARIOS } from "@/data/mock/demoScenarios";
import type { DemoLaunchInput, DemoScenario, Job } from "@/types";
import { linkDemoJobToSeed, mockJobsService } from "./jobs";

function findScenario(scenarioId: string): DemoScenario {
  const scenario = DEMO_SCENARIOS.find((row) => row.id === scenarioId);
  if (!scenario) {
    throw new Error(`[LogIQ API] Unknown demo scenario: ${scenarioId}`);
  }
  return scenario;
}

/** Mock {@link DemoService} — curated scenarios with fixture-backed detail bundles. */
export const mockDemoService: DemoService = {
  async listScenarios() {
    return [...DEMO_SCENARIOS];
  },
  async launchScenario(scenarioId: string, input: DemoLaunchInput) {
    const scenario = findScenario(scenarioId);
    const triggeredByUserId = input.triggeredByUserId.trim();
    if (!triggeredByUserId) {
      throw new Error("[LogIQ API] launchScenario: triggeredByUserId is required");
    }

    const created = await mockJobsService.create({
      jobType: "debug_investigation",
      anomalyId: scenario.anomalyId,
      runId: scenario.runId,
      triggeredByUserId,
      triggerSource: "demo",
    });

    linkDemoJobToSeed(created.id, scenario.seedJobId);

    const job: Job = {
      ...created,
      service: scenario.service,
      trigger: "manual",
    };

    return { job };
  },
};
