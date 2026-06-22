import type { AnomalySeverity } from "./common";
import type { Job } from "./job";

/** Curated investigation scenario for the Demo Center workspace. */
export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  severity: AnomalySeverity;
  rootCausePreview: string;
  /** Deterministic RCA confidence (0–1). */
  confidence: number;
  anomalyId: string;
  runId: string;
  service: string;
  /** Seed fixture used to hydrate job detail in mock mode. */
  seedJobId: string;
}

export interface DemoLaunchInput {
  triggeredByUserId: string;
}

export interface DemoLaunchResult {
  job: Job;
}
