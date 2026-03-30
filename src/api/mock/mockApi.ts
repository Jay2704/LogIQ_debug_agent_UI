/**
 * Mock implementation of LogIQApi — reads static fixtures from @/data/mock only.
 * Replace with httpApi.ts (or similar) when backend is ready; UI stays the same.
 */
import type { LogIQApi } from "@/api/contracts";
import { getJobDetailBundle } from "@/data/mock/explanations";
import { mockInsightMetrics } from "@/data/mock/insights";
import { mockJobs } from "@/data/mock/jobs";
import { mockAnomalies } from "@/data/mock/anomalies";
import { mockRcaByJobId } from "@/data/mock/rca";
import { getReportByAnomalyId, mockReports } from "@/data/mock/reports";

export function createMockApi(): LogIQApi {
  return {
    jobs: {
      async list() {
        return [...mockJobs];
      },
      async getDetailBundle(jobId: string) {
        return getJobDetailBundle(jobId);
      },
    },
    anomalies: {
      async list() {
        return [...mockAnomalies];
      },
    },
    rca: {
      async getByJobIdMap() {
        return { ...mockRcaByJobId };
      },
    },
    reports: {
      async list() {
        return [...mockReports];
      },
      async getByAnomalyId(anomalyId: string) {
        return getReportByAnomalyId(anomalyId);
      },
    },
    insights: {
      async getMetrics() {
        return { ...mockInsightMetrics };
      },
    },
  };
}
