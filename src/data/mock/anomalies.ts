import type { Anomaly } from "@/types";

export const mockAnomalies: Anomaly[] = [
  {
    id: "anom-k9x1",
    service: "checkout-api",
    severity: "critical",
    status: "investigating",
    detectedAt: "2026-03-29T14:21:03Z",
    summary:
      "p95 latency spike on POST /v2/orders correlated with cart Redis timeouts in us-east-1.",
    signalType: "APM + traces",
  },
  {
    id: "anom-m3pq",
    service: "auth-service",
    severity: "high",
    status: "resolved",
    detectedAt: "2026-03-29T13:02:18Z",
    summary:
      "Elevated 401 rate on token refresh after deploy v2.14.2; mitigated by rollback.",
    signalType: "Logs + metrics",
  },
  {
    id: "anom-r7nw",
    service: "payments-worker",
    severity: "high",
    status: "mitigated",
    detectedAt: "2026-03-29T11:15:40Z",
    summary:
      "Kafka consumer lag on topic payments.events exceeded SLO for 12 minutes.",
    signalType: "Streaming lag",
  },
  {
    id: "anom-j2lm",
    service: "inventory-svc",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-29T09:38:22Z",
    summary:
      "Stale stock counts in shard inv-03 after partial bulk import failure.",
    signalType: "DB checks",
  },
  {
    id: "anom-h8vx",
    service: "search-indexer",
    severity: "low",
    status: "resolved",
    detectedAt: "2026-03-28T22:05:11Z",
    summary:
      "Indexing backlog during nightly reindex; cleared after autoscaler added nodes.",
    signalType: "Queue depth",
  },
  {
    id: "anom-b4yt",
    service: "notifications",
    severity: "medium",
    status: "open",
    detectedAt: "2026-03-28T19:30:55Z",
    summary:
      "SMS provider error rate above baseline; retries masking user-visible failures.",
    signalType: "Synthetic + webhooks",
  },
  {
    id: "anom-c6zd",
    service: "billing-ledger",
    severity: "high",
    status: "resolved",
    detectedAt: "2026-03-28T16:00:02Z",
    summary:
      "Double-charge risk flagged on idempotency key collision during failover drill.",
    signalType: "Audit trail",
  },
  {
    id: "anom-f1qs",
    service: "edge-gateway",
    severity: "critical",
    status: "resolved",
    detectedAt: "2026-03-28T08:12:33Z",
    summary:
      "Regional 503 burst on health checks after upstream DNS TTL mismatch.",
    signalType: "Synthetic probes",
  },
];
