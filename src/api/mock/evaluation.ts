import type { EvaluationService } from "@/api/contracts";
import type {
  RcaConfidenceEvaluation,
  RcaEvaluationSummary,
  RcaEvaluationTrends,
  RcaServiceAccuracyResult,
} from "@/types";

const MOCK_SUMMARY: RcaEvaluationSummary = {
  totalInvestigations: 248,
  totalFeedback: 186,
  confirmationRate: 0.62,
  rejectionRate: 0.24,
  overrideRate: 0.14,
  averageConfidence: 0.71,
  highConfidenceAccuracy: 0.84,
};

const MOCK_SERVICES: RcaServiceAccuracyResult = {
  services: [
    {
      service: "checkout-service",
      investigations: 54,
      accuracy: 0.81,
      confirmationRate: 0.68,
      rejectionRate: 0.22,
    },
    {
      service: "auth-service",
      investigations: 47,
      accuracy: 0.76,
      confirmationRate: 0.61,
      rejectionRate: 0.27,
    },
    {
      service: "payment-gateway",
      investigations: 39,
      accuracy: 0.69,
      confirmationRate: 0.55,
      rejectionRate: 0.31,
    },
    {
      service: "user-profile-api",
      investigations: 31,
      accuracy: 0.74,
      confirmationRate: 0.59,
      rejectionRate: 0.25,
    },
  ],
};

const MOCK_CONFIDENCE: RcaConfidenceEvaluation = {
  highConfidenceAccuracy: 0.84,
  byLevel: [
    { level: "high", label: "High (>80%)", accuracy: 0.84, count: 92 },
    { level: "medium", label: "Medium (50–80%)", accuracy: 0.67, count: 64 },
    { level: "low", label: "Low (<50%)", accuracy: 0.41, count: 30 },
  ],
};

const MOCK_TRENDS: RcaEvaluationTrends = {
  feedbackTrend: [
    { date: "2026-03-23", confirms: 8, rejects: 3, overrides: 2 },
    { date: "2026-03-24", confirms: 11, rejects: 4, overrides: 1 },
    { date: "2026-03-25", confirms: 9, rejects: 5, overrides: 3 },
    { date: "2026-03-26", confirms: 14, rejects: 4, overrides: 2 },
    { date: "2026-03-27", confirms: 12, rejects: 6, overrides: 2 },
    { date: "2026-03-28", confirms: 15, rejects: 5, overrides: 4 },
    { date: "2026-03-29", confirms: 13, rejects: 4, overrides: 3 },
  ],
  mostConfirmedCandidates: [
    {
      candidate: "session_validator.py:142 — MFA timeout handling",
      count: 18,
      service: "auth-service",
    },
    {
      candidate: "checkout_handler.go:88 — inventory hold race",
      count: 14,
      service: "checkout-service",
    },
    {
      candidate: "retry_manager.ts:201 — PSP backoff ceiling",
      count: 11,
      service: "payment-gateway",
    },
  ],
  mostRejectedCandidates: [
    {
      candidate: "cache/redis_pool.py:67 — connection saturation",
      count: 9,
      service: "checkout-service",
    },
    {
      candidate: "auth_middleware.go:54 — stale JWT signing key",
      count: 7,
      service: "auth-service",
    },
    {
      candidate: "ledger_reconcile.job — duplicate capture guard",
      count: 6,
      service: "payment-gateway",
    },
  ],
};

export const mockEvaluationService: EvaluationService = {
  async getRcaSummary() {
    await new Promise((r) => setTimeout(r, 120));
    return { ...MOCK_SUMMARY };
  },

  async getRcaServices() {
    await new Promise((r) => setTimeout(r, 100));
    return {
      services: MOCK_SERVICES.services.map((row) => ({ ...row })),
    };
  },

  async getRcaConfidence() {
    await new Promise((r) => setTimeout(r, 100));
    return {
      highConfidenceAccuracy: MOCK_CONFIDENCE.highConfidenceAccuracy,
      byLevel: MOCK_CONFIDENCE.byLevel.map((row) => ({ ...row })),
    };
  },

  async getRcaTrends() {
    await new Promise((r) => setTimeout(r, 100));
    return {
      feedbackTrend: MOCK_TRENDS.feedbackTrend.map((row) => ({ ...row })),
      mostConfirmedCandidates: MOCK_TRENDS.mostConfirmedCandidates.map((row) => ({
        ...row,
      })),
      mostRejectedCandidates: MOCK_TRENDS.mostRejectedCandidates.map((row) => ({
        ...row,
      })),
    };
  },
};
