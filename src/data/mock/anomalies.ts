import type { Anomaly } from "@/types";

export const mockAnomalies: Anomaly[] = [
  {
    id: "anomaly_001",
    service: "checkout-service",
    severity: "critical",
    status: "investigating",
    detectedAt: "2026-03-29T14:21:03Z",
    summary:
      "p95 latency on POST /checkout/confirm regressed 2.4×; error budget burn accelerated in us-east-1.",
    signalType: "APM + distributed traces",
  },
  {
    id: "anomaly_002",
    service: "auth-service",
    severity: "high",
    status: "resolved",
    detectedAt: "2026-03-29T13:02:18Z",
    summary:
      "Spike in 401 responses on /v1/session/refresh after canary deploy 2026.03.29-2; rolled back.",
    signalType: "HTTP logs + auth metrics",
  },
  {
    id: "anomaly_003",
    service: "payment-gateway",
    severity: "high",
    status: "mitigated",
    detectedAt: "2026-03-29T11:15:40Z",
    summary:
      "Retry amplification on capture path; downstream PSP latency exceeded SLO for 11 minutes.",
    signalType: "Synthetic + payment traces",
  },
  {
    id: "anomaly_004",
    service: "user-profile-api",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-29T09:38:22Z",
    summary:
      "Stale read-after-write on profile updates; DynamoDB eventual consistency window wider than client timeout.",
    signalType: "DB + API golden signals",
  },
  {
    id: "anomaly_005",
    service: "notification-service",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-28T19:30:55Z",
    summary:
      "Provider webhook backlog; DLQ growth while primary queue drained slower than ingest.",
    signalType: "Queue depth + webhooks",
  },
  {
    id: "anomaly_006",
    service: "payment-gateway",
    severity: "high",
    status: "resolved",
    detectedAt: "2026-03-28T16:00:02Z",
    summary:
      "Idempotency key collision window during regional failover exercise; no settled duplicates after replay audit.",
    signalType: "Ledger audit + traces",
  },
  {
    id: "anomaly_007",
    service: "auth-service",
    severity: "medium",
    status: "resolved",
    detectedAt: "2026-03-27T22:40:12Z",
    summary:
      "Elevated MFA challenge latency; Redis session store hot shard during password rotation campaign.",
    signalType: "Logs + Redis metrics",
  },
  {
    id: "anomaly_008",
    service: "checkout-service",
    severity: "low",
    status: "resolved",
    detectedAt: "2026-03-26T10:05:00Z",
    summary:
      "Brief cart merge conflicts after catalog sync; self-healed after cache invalidation sweep.",
    signalType: "APM",
  },
];
