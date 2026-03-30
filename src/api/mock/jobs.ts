import type { JobsService } from "@/api/contracts";
import { mapTriggerSource } from "@/api/http/parseApiJob";
import { getJobDetailBundle } from "@/data/mock/explanations";
import { mockJobs as seedJobs } from "@/data/mock/jobs";
import type { CreateJobInput, Job } from "@/types";

/** Session-only jobs appended in pure mock mode (in-memory; lost on refresh). */
const runtimeJobs: Job[] = [];

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
