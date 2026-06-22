import type { JobsService } from "@/api/contracts";
import { mapTriggerSource } from "@/api/http/parseApiJob";
import { getJobDetailBundle } from "@/data/mock/explanations";
import { mockJobs as seedJobs } from "@/data/mock/jobs";
import type { CreateJobInput, Job } from "@/types";

/** Session-only jobs appended in pure mock mode (in-memory; lost on refresh). */
const runtimeJobs: Job[] = [];

/** Demo launches: runtime job id → seed fixture id for rich detail bundles. */
const demoBundleSeeds = new Map<string, string>();

export function linkDemoJobToSeed(runtimeJobId: string, seedJobId: string): void {
  demoBundleSeeds.set(runtimeJobId, seedJobId);
}

function withCanonicalJobId(j: Job): Job {
  const id = j.jobId ?? j.id;
  return { ...j, id, jobId: id };
}

/** Mock {@link JobsService} — static fixtures plus optional session creates */
export const mockJobsService: JobsService = {
  async list() {
    return [...seedJobs, ...runtimeJobs].map(withCanonicalJobId);
  },
  async getDetailBundle(jobId: string) {
    const seedId = demoBundleSeeds.get(jobId);
    if (seedId) {
      const template = getJobDetailBundle(seedId);
      if (!template) return undefined;
      const runtimeJob = [...seedJobs, ...runtimeJobs]
        .map(withCanonicalJobId)
        .find((j) => j.id === jobId);
      if (!runtimeJob) return undefined;
      return {
        ...template,
        job: runtimeJob,
        rca: { ...template.rca, jobId: runtimeJob.id },
        jobRowSource: "mock" as const,
      };
    }
    const bundle = getJobDetailBundle(jobId);
    if (!bundle) return undefined;
    return { ...bundle, jobRowSource: "mock" as const };
  },
  async create(input: CreateJobInput) {
    const id = `dbg_${Date.now()}`;
    const job: Job = {
      jobId: id,
      id,
      jobType: input.jobType.trim(),
      anomalyId: input.anomalyId.trim(),
      status: "queued",
      trigger: mapTriggerSource(input.triggerSource),
      createdAt: new Date().toISOString(),
      triggeredByUserId: input.triggeredByUserId.trim(),
      triggerSource: input.triggerSource.trim(),
    };
    runtimeJobs.push(job);
    return job;
  },
};
