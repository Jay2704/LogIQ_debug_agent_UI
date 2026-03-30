import type { EvidenceItem, SimilarIncident } from "@/types";
import { mockAnomalies } from "./anomalies";
import { mockJobs } from "./jobs";
import { mockRcaByJobId } from "./rca";

const explanations: Record<string, string> = {
  dbg_2026_001: `Hot path analysis shows request time concentrated in \`confirm_order\` after the cart totalizer returned. CPU on checkout pods is nominal; wall time aligns with downstream inventory holds and synchronous fraud scoring. The deterministic file anchor matches the top stack frame from sampled traces. Redis and session layers are secondary contributors in this window.`,

  dbg_2026_002: `Session refresh failures cluster on clients that cached the previous JWK set. The canary introduced stricter validation in \`session_validator\`; clients without the rotated keys failed until caches expired. Rollback restored prior validation order while identity distributes updated bundles.`,

  dbg_2026_003: `Retry manager doubled attempts while PSP p99 latency stayed above the backoff ceiling, causing a feedback loop of overlapping retries on the same capture id. Circuit breaker thresholds were unchanged from last week; the spike is tied to partner maintenance, not a code path regression in isolation.`,

  dbg_2026_004: `Profile reads occasionally hit replicas before the write quorum was visible to the routing layer. Clients using short read timeouts observe stale display names; strongly consistent reads or client-side retry-on-mismatch would mask the symptom. Root ranking favors repository merge logic over Dynamo itself.`,

  dbg_2026_005: `Job is queued behind two regional Sev-2 investigations. Initial triage points to webhook consumer saturation during a marketing send, but RCA has not started.`,

  dbg_2026_006: `During failover drill, replay reused idempotency keys that referenced in-flight captures from the primary region. Ledger rejected duplicates correctly; no money movement after reconciliation. Hardening replay ordering removes ambiguity for the next exercise.`,

  dbg_2026_007: `MFA path latency tracks Redis CPU on the auth session cluster during bulk password rotation. Session cache evictions increased round-trips to the identity store; scaling read replicas for the cache tier reduced p95 under the same load test.`,

  dbg_2026_008: `Cart merge endpoint saw contention when catalog sync invalidated keys mid-request. Handler-level merge logic retried once and succeeded; impact was limited to a narrow time window and did not affect paid orders.`,

};

const evidenceByJob: Record<string, EvidenceItem[]> = {
  dbg_2026_001: [
    {
      id: "e1",
      label: "Top stack frame",
      detail:
        "Hottest samples in flame graphs point to checkout_handler.confirm_order — matches deterministic RCA file anchor.",
      source: "APM",
    },
    {
      id: "e2",
      label: "Deploy correlation",
      detail:
        "Release 2026.03.28-14 touched services/payment/retry_manager.ts; deploy window overlaps latency onset by 6 minutes.",
      source: "CI/CD",
    },
    {
      id: "e3",
      label: "Historical pattern",
      detail:
        "Repeated anomaly pattern in checkout-service over last 7 days: 4 incidents with same golden-signal fingerprint (latency + 5xx on /checkout/confirm).",
      source: "Incident DB",
    },
    {
      id: "e4",
      label: "Trace exemplar",
      detail:
        "Exemplar trace chk-us1-8a2f shows 1.8s in handler before downstream PSP call; child spans for inventory hold add 340ms.",
      source: "Tracing",
    },
  ],
  dbg_2026_002: [
    {
      id: "e1",
      label: "Auth logs",
      detail:
        "401 rate on /v1/session/refresh correlates with deploy auth-service@2026.03.29-2; commit touches session_validator.",
      source: "Logs",
    },
    {
      id: "e2",
      label: "JWK rotation",
      detail: "Key rotation timestamp matches first error minute for legacy mobile build 4.8.x.",
      source: "Secrets",
    },
  ],
  dbg_2026_003: [
    {
      id: "e1",
      label: "Retry loop",
      detail:
        "retry_manager issued overlapping retries while PSP p99 > 4s; backoff cap exceeded 12× in 10 minutes.",
      source: "Traces",
    },
    {
      id: "e2",
      label: "PSP status",
      detail: "Partner status page shows maintenance on capture API during incident window.",
      source: "External",
    },
  ],
  dbg_2026_004: [
    {
      id: "e1",
      label: "Read-after-write",
      detail:
        "Consistent read off primary resolves stale profile in repro; default route uses replica set ap-south-1b.",
      source: "DynamoDB",
    },
  ],
  dbg_2026_005: [],
  dbg_2026_006: [
    {
      id: "e1",
      label: "Idempotency audit",
      detail:
        "Collision window shows two capture intents sharing key cap_9f2a within failover boundary; ledger holds are consistent post-audit.",
      source: "Ledger",
    },
  ],
  dbg_2026_007: [
    {
      id: "e1",
      label: "Redis saturation",
      detail: "auth-session-use1 maxed CPU at 94% during rotation campaign; hot key on session:* prefix.",
      source: "Redis",
    },
  ],
  dbg_2026_008: [
    {
      id: "e1",
      label: "Catalog sync",
      detail:
        "catalog-sync-26c job invalidated cart keys during merge; merge handler retry cleared conflicts.",
      source: "Logs",
    },
  ],
};

const remediationByJob: Record<string, string[]> = {
  dbg_2026_001: [
    "Add budgeted timeout around inventory hold in checkout_handler.confirm_order; fail fast to user-visible retry.",
    "Coordinate with payments to gate retry_manager backoff when PSP latency > 2× baseline (feature flag pay-retry-tighten).",
    "Schedule load test on /checkout/confirm with 2026.03.28-14 build to validate fix before broad rollout.",
  ],
  dbg_2026_002: [
    "Hold canary until JWK bundle reaches 99% of active app versions; expand phased rollout.",
    "Add client-side key refresh probe on 401 from /v1/session/refresh for legacy SDKs.",
  ],
  dbg_2026_003: [
    "Lower max retry count when PSP error class is TIMEOUT vs DECLINE; ship config change in retry_manager.",
    "Page payments on-call when overlapping retries exceed 3 per capture id in a 5-minute window.",
  ],
  dbg_2026_004: [
    "Route profile GET by user id through strongly consistent read for 60s after profile PUT.",
    "Document client contract: minimum 150ms backoff before second read after update.",
  ],
  dbg_2026_005: [
    "Drain DLQ after consumer scale-out; verify webhook signing secret rotation is complete.",
  ],
  dbg_2026_006: [
    "Require monotonic region sequence on idempotency replay before second capture attempt.",
    "Add integration test for failover drill covering idempotency key reuse.",
  ],
  dbg_2026_007: [
    "Scale Redis read replicas for auth-session cluster during rotation windows.",
    "Shard hot session prefix to reduce single-node CPU skew.",
  ],
  dbg_2026_008: [
    "Defer catalog invalidation until after open cart merge completes (async invalidation queue).",
  ],
};

const similarByJob: Record<string, SimilarIncident[]> = {
  dbg_2026_001: [
    {
      id: "sim-2026-014",
      service: "checkout-service",
      title: "Confirm path latency spike (Jan 2026)",
      occurredAt: "2026-01-14T16:22:00Z",
      overlap: "Same handler hot frame; inventory hold added after pricing change",
    },
    {
      id: "sim-2025-112",
      service: "checkout-service",
      title: "Redis timeout burst under promotion (Nov 2025)",
      occurredAt: "2025-11-22T09:10:00Z",
      overlap: "Session/cart pressure under promotion traffic",
    },
  ],
  dbg_2026_002: [
    {
      id: "sim-2025-09-aa",
      service: "auth-service",
      title: "Refresh 401 after key rotation",
      occurredAt: "2025-09-14T11:02:00Z",
      overlap: "session_validator path; client cache stale JWK",
    },
  ],
  dbg_2026_003: [
    {
      id: "sim-2026-02-pg",
      service: "payment-gateway",
      title: "PSP maintenance retry storm",
      occurredAt: "2026-02-03T04:18:00Z",
      overlap: "retry_manager backoff; partner incident",
    },
  ],
  dbg_2026_004: [],
  dbg_2026_005: [],
  dbg_2026_006: [
    {
      id: "sim-2025-10-dr",
      service: "payment-gateway",
      title: "Idempotency boundary during failover drill",
      occurredAt: "2025-10-22T16:40:00Z",
      overlap: "Failover replay boundary; ledger audit",
    },
  ],
  dbg_2026_007: [
    {
      id: "sim-2026-01-mfa",
      service: "auth-service",
      title: "MFA latency during password campaign",
      occurredAt: "2026-01-08T19:15:00Z",
      overlap: "Redis session cluster CPU; rotation event",
    },
  ],
  dbg_2026_008: [
    {
      id: "sim-2025-12-cart",
      service: "checkout-service",
      title: "Merge conflict after catalog sync job",
      occurredAt: "2025-12-01T07:45:00Z",
      overlap: "checkout_handler merge; catalog invalidation",
    },
  ],
};

const confidenceNotes: Record<string, string> = {
  dbg_2026_001:
    "0.83 confidence: strong trace alignment to checkout_handler; residual uncertainty from overlapping deploy to payment retry module.",
  dbg_2026_002:
    "0.92 confidence: deploy diff, log correlation, and rollback outcome all align on session_validator.",
  dbg_2026_003:
    "0.71 confidence: retry_manager is primary ranked cause; PSP incident explains variance but partner root is external.",
  dbg_2026_004:
    "Moderate confidence: consistency model matches symptoms; client behavior may mask full blast radius.",
  dbg_2026_005: "Investigation not started; confidence not computed.",
  dbg_2026_006:
    "High confidence from ledger replay and idempotency key timeline; drill-specific edge case.",
  dbg_2026_007:
    "0.79 confidence: Redis metrics and campaign timing correlate; less certainty on long-term shard strategy without capacity model.",
  dbg_2026_008:
    "0.86 confidence: narrow window and clear log correlation to catalog sync job.",
};

const limitationsNotes: Record<string, string> = {
  dbg_2026_001:
    "Mobile WebView clients not fully sampled; assumes server-side traces represent majority of user journeys.",
  dbg_2026_002:
    "Third-party mobile SDK versions estimated from crash reports; not exhaustive.",
  dbg_2026_003:
    "PSP internal queue depth not visible; external status page used as ground truth.",
  dbg_2026_004:
    "Does not model client-side caches outside API gateway.",
  dbg_2026_005: "No traces attached until job leaves queue.",
  dbg_2026_006:
    "Financial impact excluded pending finance sign-off on replay classification.",
  dbg_2026_007:
    "Cross-region auth traffic not in scope for this single-region RCA.",
  dbg_2026_008:
    "Search ranking and recommendation side effects not evaluated.",
};

/** Mock assistive text keyed by job id (fixtures). */
export function getMockExplanationTextForJob(jobId: string): string {
  return explanations[jobId] ?? "";
}

export function getJobDetailBundle(jobId: string) {
  const job = mockJobs.find((j) => j.id === jobId);
  if (!job) return undefined;
  const anomaly = mockAnomalies.find((a) => a.id === job.anomalyId);
  const rca = mockRcaByJobId[jobId];
  if (!anomaly || !rca) return undefined;

  return {
    job,
    anomaly,
    rca,
    explanation: explanations[jobId] ?? "",
    evidence: evidenceByJob[jobId] ?? [],
    remediation: remediationByJob[jobId] ?? [],
    similarIncidents: similarByJob[jobId] ?? [],
    confidenceNote: confidenceNotes[jobId] ?? "",
    limitationsNote: limitationsNotes[jobId] ?? "",
  };
}

