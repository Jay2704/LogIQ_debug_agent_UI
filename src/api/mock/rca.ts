import type { RcaService } from "@/api/contracts";
import { getMockExplanationTextForJob } from "@/data/mock/explanations";
import { mockJobs } from "@/data/mock/jobs";
import { mockRcaByJobId } from "@/data/mock/rca";
import type { RcaAssistiveExplanation } from "@/types";

export const mockRcaService: RcaService = {
  async getByJobIdMap() {
    return { ...mockRcaByJobId };
  },
  async getResultsByAnomalyId(_anomalyId: string, jobId: string) {
    return mockRcaByJobId[jobId] ?? null;
  },
  async run() {
    await new Promise((r) => setTimeout(r, 450));
  },
  async getExplanationByAnomalyId(anomalyId: string): Promise<RcaAssistiveExplanation> {
    const job = mockJobs.find((j) => j.anomalyId === anomalyId);
    const summary = job
      ? getMockExplanationTextForJob(job.id)
      : "";
    return {
      explanationSummary:
        summary ||
        "Mock mode: no bundled assistive narrative for this anomaly — enable HTTP API to load live explanations.",
      evidenceHighlights: summary
        ? ["Derived from local mock fixtures (develop-only)."]
        : [],
      confidenceAlignmentNote:
        "Assistive layer does not override deterministic RCA or confidence in the primary card.",
      limitations: "Mock data only; not representative of production LLM output.",
      remediationSteps: summary
        ? [
            "Reproduce using the ranked file anchor and evidence refs.",
            "Validate fix against the same anomaly class before rollout.",
          ]
        : [],
      patchDirection: summary
        ? "Prefer targeted changes along the deterministic path; avoid broad refactors in mock mode."
        : undefined,
      finalReportSummary: summary
        ? "Mock synthesis: use HTTP API for Ollama-backed narrative and remediation."
        : undefined,
    };
  },
};
