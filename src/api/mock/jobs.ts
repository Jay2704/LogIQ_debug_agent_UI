import type { JobsService } from "@/api/contracts";
import { getJobDetailBundle } from "@/data/mock/explanations";
import { mockJobs } from "@/data/mock/jobs";

/** Mock {@link JobsService} — backed by static fixtures only */
export const mockJobsService: JobsService = {
  async list() {
    return [...mockJobs];
  },
  async getDetailBundle(jobId: string) {
    return getJobDetailBundle(jobId);
  },
};
