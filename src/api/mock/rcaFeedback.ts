import type { RcaFeedbackService } from "@/api/contracts";
import type { RcaFeedbackSubmitInput, RcaFeedbackSummary } from "@/types";
import {
  computeFeedbackRates,
} from "@/api/http/parseRcaFeedbackApi";

const feedbackByJob = new Map<string, RcaFeedbackSummary>();

function seedHistory(jobId: string): RcaFeedbackSummary {
  const history = [
    {
      id: `${jobId}-fb-1`,
      jobId,
      action: "confirm" as const,
      comment: "Ranked path matches on-call notes from last week's drill.",
      submittedAt: "2026-03-28T10:15:00.000Z",
      submittedBy: "sre.oncall",
    },
    {
      id: `${jobId}-fb-2`,
      jobId,
      action: "reject" as const,
      comment: "Confidence overstated — missing canary region in evidence.",
      submittedAt: "2026-03-27T16:40:00.000Z",
      submittedBy: "platform.lead",
    },
    {
      id: `${jobId}-fb-3`,
      jobId,
      action: "confirm" as const,
      submittedAt: "2026-03-26T09:05:00.000Z",
      submittedBy: "support.tier2",
    },
  ];

  const rates = computeFeedbackRates(history);
  return {
    jobId,
    history,
    confirmationRate: rates.confirmationRate,
    rejectionRate: rates.rejectionRate,
    totalCount: history.length,
  };
}

function getOrCreateSummary(jobId: string): RcaFeedbackSummary {
  const existing = feedbackByJob.get(jobId);
  if (existing) return existing;
  const seeded = seedHistory(jobId);
  feedbackByJob.set(jobId, seeded);
  return seeded;
}

export const mockRcaFeedbackService: RcaFeedbackService = {
  async getFeedback(jobId: string) {
    const id = jobId.trim();
    if (!id) {
      throw new Error("[LogIQ rcaFeedback] getFeedback: job id is required");
    }
    await new Promise((r) => setTimeout(r, 120));
    return { ...getOrCreateSummary(id), history: [...getOrCreateSummary(id).history] };
  },

  async submitFeedback(jobId: string, input: RcaFeedbackSubmitInput) {
    const id = jobId.trim();
    if (!id) {
      throw new Error("[LogIQ rcaFeedback] submitFeedback: job id is required");
    }

    const summary = getOrCreateSummary(id);
    const entry = {
      id: `${id}-fb-${Date.now()}`,
      jobId: id,
      action: input.action,
      comment: input.comment?.trim() || undefined,
      submittedAt: new Date().toISOString(),
      submittedBy: "current.user",
    };

    const history = [entry, ...summary.history];
    const rates = computeFeedbackRates(history);
    const next: RcaFeedbackSummary = {
      jobId: id,
      history,
      confirmationRate: rates.confirmationRate,
      rejectionRate: rates.rejectionRate,
      totalCount: history.length,
    };

    feedbackByJob.set(id, next);
    await new Promise((r) => setTimeout(r, 180));
    return { ...next, history: [...next.history] };
  },
};
