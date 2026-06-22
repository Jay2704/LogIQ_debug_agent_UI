import type { DemoScenario } from "@/types";

/** Static demo scenarios backed by existing mock investigation fixtures. */
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "checkout-latency",
    title: "Checkout latency regression",
    description:
      "p95 latency on POST /checkout/confirm regressed 2.4× with accelerated error-budget burn in us-east-1.",
    severity: "critical",
    rootCausePreview: "src/handlers/checkout_handler.py#L142-L168",
    confidence: 0.83,
    anomalyId: "anomaly_001",
    runId: "run_us1-8a2f3c1e",
    service: "checkout-service",
    seedJobId: "dbg_2026_001",
  },
  {
    id: "auth-session-refresh",
    title: "Auth session refresh spike",
    description:
      "401 responses on /v1/session/refresh climbed after a canary deploy introduced stricter JWK validation.",
    severity: "high",
    rootCausePreview: "api/auth/session_validator.py#L88-L104",
    confidence: 0.92,
    anomalyId: "anomaly_002",
    runId: "run_us1-9b3d4f2a",
    service: "auth-service",
    seedJobId: "dbg_2026_002",
  },
  {
    id: "payment-retry-amplification",
    title: "Payment retry amplification",
    description:
      "Capture path retries overlapped while PSP latency exceeded SLO, creating a feedback loop on the same id.",
    severity: "high",
    rootCausePreview: "services/payment/retry_manager.ts#L214-L238",
    confidence: 0.71,
    anomalyId: "anomaly_003",
    runId: "run_pay-eu1-4c1a",
    service: "payment-gateway",
    seedJobId: "dbg_2026_003",
  },
  {
    id: "profile-stale-read",
    title: "Profile stale read-after-write",
    description:
      "Profile updates occasionally read from replicas before write quorum visibility, surfacing stale display names.",
    severity: "medium",
    rootCausePreview: "user-profile-api/src/repositories/profile_store.py#L56-L78",
    confidence: 0.54,
    anomalyId: "anomaly_004",
    runId: "run_usw2-2d8e",
    service: "user-profile-api",
    seedJobId: "dbg_2026_004",
  },
  {
    id: "failover-idempotency",
    title: "Failover idempotency collision",
    description:
      "Regional failover drill replayed in-flight captures with duplicate idempotency keys; ledger rejected overlaps correctly.",
    severity: "high",
    rootCausePreview: "services/payment/idempotency_store.go#L112-L135",
    confidence: 0.88,
    anomalyId: "anomaly_006",
    runId: "run_pay-drill-7f1c",
    service: "payment-gateway",
    seedJobId: "dbg_2026_006",
  },
  {
    id: "cart-merge-contention",
    title: "Cart merge contention",
    description:
      "Catalog sync invalidated cart keys mid-request, causing short-lived merge retries on the checkout handler.",
    severity: "low",
    rootCausePreview: "src/handlers/checkout_handler.py#L201-L220",
    confidence: 0.86,
    anomalyId: "anomaly_008",
    runId: "run_us1-cart-3b9e",
    service: "checkout-service",
    seedJobId: "dbg_2026_008",
  },
];
