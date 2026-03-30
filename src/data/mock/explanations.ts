import type { EvidenceItem, Job, SimilarIncident } from "@/types";
import { mockAnomalies } from "./anomalies";
import { mockJobs } from "./jobs";
import { mockRcaByJobId } from "./rca";

const explanations: Record<string, string> = {
  "job-8f2a": `The spike aligns with Redis command timeouts on the cart cluster during a hot-key burst on SKU bundles. Traces show checkout threads blocking on \`GET cart:*\` while connection pool saturation increased round-trip time. No deploy occurred in the window; cache pressure is the primary driver versus code regression.`,
  "job-7d41": `Refresh failures concentrated on clients still holding rotated signing keys from the prior release. The new middleware tightened JWK validation; clients without the updated key bundle received 401s until caches expired. Rollback restored prior behavior while key distribution catches up.`,
  "job-6c90": `Consumer group lag grew when downstream batch writes to Postgres slowed due to a vacuum-heavy window on the ledger table. Partition assignment remained healthy; throughput recovered after read replicas took analytics queries off the primary.`,
  "job-5b33": `Import job partially wrote to shard inv-03 while a repair job was mid-flight, leaving quantity deltas inconsistent with the canonical warehouse feed. Automated reconciliation has not completed; manual shard repair is required.`,
  "job-4a12": `Nightly reindex increased CPU on indexer nodes beyond the steady-state autoscaler policy. Backlog cleared once additional nodes joined; no data loss detected in index snapshots.`,
  "job-391f": `Investigation queued behind higher-severity regional incidents. Initial signals point to upstream SMS provider 5xx responses during a carrier maintenance window.`,
  "job-280e": `Idempotency collisions occurred when failover replayed partially committed ledger entries. Keys matched within the dedupe window but referenced different charge intents. Safeguards now reject ambiguous replays until ledger state converges.`,
  "job-170d": `Health check failures traced to stale A records at the edge after DNS TTL mismatch between primary and failover targets. Traffic shifted to healthy pools once TTLs aligned and caches flushed.`,
};

const evidenceByJob: Record<string, EvidenceItem[]> = {
  "job-8f2a": [
    {
      id: "e1",
      label: "Trace hot path",
      detail:
        "p95 on orderCreate spans increased 3.1× vs prior hour; Redis spans dominate.",
      source: "APM",
    },
    {
      id: "e2",
      label: "Redis metrics",
      detail: "instantaneous_ops_per_sec maxed; timeout count +420 in 10m window.",
      source: "Infra",
    },
    {
      id: "e3",
      label: "Deploy correlation",
      detail: "No production deploy in ±45m; rules out new binary regression.",
      source: "CI/CD",
    },
  ],
  "job-7d41": [
    {
      id: "e1",
      label: "Auth logs",
      detail:
        "401 spike on /oauth/token correlates with middleware commit hash ab91c2.",
      source: "Logs",
    },
    {
      id: "e2",
      label: "Key rotation",
      detail: "JWK set rotation timestamp matches error onset for legacy clients.",
      source: "Secrets",
    },
  ],
  "job-6c90": [
    {
      id: "e1",
      label: "Kafka lag",
      detail: "Max lag 1.8M messages on partition 4; others nominal.",
      source: "Streaming",
    },
    {
      id: "e2",
      label: "DB load",
      detail: "Primary CPU 94% with long-running vacuum on ledger_txn.",
      source: "Postgres",
    },
  ],
  "job-5b33": [
    {
      id: "e1",
      label: "Shard checksum",
      detail: "inv-03 counts diverge 2.4% from warehouse feed snapshot.",
      source: "DB",
    },
  ],
  "job-4a12": [
    {
      id: "e1",
      label: "Queue depth",
      detail: "Indexer backlog peaked at 2.1M docs; autoscaler added 4 nodes.",
      source: "Orchestration",
    },
  ],
  "job-391f": [],
  "job-280e": [
    {
      id: "e1",
      label: "Audit trail",
      detail: "Duplicate idempotency key observed across failover boundary.",
      source: "Ledger",
    },
  ],
  "job-170d": [
    {
      id: "e1",
      label: "DNS probe",
      detail: "Edge resolver returned mixed A records vs control plane intent.",
      source: "DNS",
    },
  ],
};

const remediationByJob: Record<string, string[]> = {
  "job-8f2a": [
    "Increase cart Redis connection pool ceiling for checkout-api in us-east-1.",
    "Enable request coalescing for hot SKU bundle reads (feature flag cart-coalesce).",
    "Add circuit breaker metrics dashboard for Redis sub-50ms SLO.",
  ],
  "job-7d41": [
    "Keep rollback until JWK distribution reaches 99% of active clients.",
    "Shorten key cache TTL for mobile clients on the next release train.",
  ],
  "job-6c90": [
    "Move analytics queries to replica during nightly batch windows.",
    "Tune consumer fetch size to reduce write batch pressure on primary.",
  ],
  "job-5b33": [
    "Pause imports on shard inv-03 until repair completes.",
    "Run manual reconciliation script with warehouse feed checksum.",
  ],
  "job-4a12": [
    "Raise indexer autoscaler max nodes during nightly reindex.",
  ],
  "job-391f": [
    "Fail over SMS traffic to secondary provider if error rate persists >5m.",
  ],
  "job-280e": [
    "Harden idempotency replay to require monotonic ledger sequence match.",
  ],
  "job-170d": [
    "Align DNS TTLs between edge and failover targets; add pre-deploy validation.",
  ],
};

const similarByJob: Record<string, SimilarIncident[]> = {
  "job-8f2a": [
    {
      id: "sim-1",
      title: "Cart Redis saturation — Black Friday prep",
      occurredAt: "2025-11-20T18:10:00Z",
      overlap: "Same service, Redis timeouts under burst traffic",
    },
    {
      id: "sim-2",
      title: "Checkout latency — bundle promotion",
      occurredAt: "2026-01-08T09:44:00Z",
      overlap: "Hot-key pattern on promotional SKUs",
    },
  ],
  "job-7d41": [
    {
      id: "sim-1",
      title: "OAuth refresh 401 after cert rotation",
      occurredAt: "2025-09-14T11:02:00Z",
      overlap: "Key rotation window vs client cache",
    },
  ],
  "job-6c90": [
    {
      id: "sim-1",
      title: "Ledger vacuum contention",
      occurredAt: "2025-12-03T04:18:00Z",
      overlap: "Primary CPU during batch + consumer lag",
    },
  ],
  "job-5b33": [],
  "job-4a12": [
    {
      id: "sim-1",
      title: "Indexer backlog during catalog import",
      occurredAt: "2026-02-11T03:55:00Z",
      overlap: "Nightly job CPU saturation",
    },
  ],
  "job-391f": [],
  "job-280e": [
    {
      id: "sim-1",
      title: "Idempotency collision — regional failover test",
      occurredAt: "2025-10-22T16:40:00Z",
      overlap: "Replay boundary on ledger",
    },
  ],
  "job-170d": [
    {
      id: "sim-1",
      title: "Edge 503 during DNS cutover",
      occurredAt: "2025-07-19T07:12:00Z",
      overlap: "TTL mismatch at edge",
    },
  ],
};

const confidenceNotes: Record<string, string> = {
  "job-8f2a":
    "Confidence is high for Redis pressure as root contributor; lower certainty on long-term fix sizing without load test.",
  "job-7d41":
    "High confidence: deploy diff and log correlation are direct; client telemetry confirms recovery post-rollback.",
  "job-6c90":
    "Strong signal from lag and DB metrics; partial uncertainty on whether vacuum schedule alone prevents recurrence.",
  "job-5b33":
    "Low confidence: shard state inconsistent; needs manual validation before accepting automated RCA output.",
  "job-4a12":
    "Moderate confidence: autoscaler resolved symptoms; root cause is capacity policy rather than code defect.",
  "job-391f":
    "Investigation not complete; confidence not yet computed.",
  "job-280e":
    "High confidence from audit replay and idempotency key analysis.",
  "job-170d":
    "High confidence from probe data and DNS record comparison.",
};

const limitationsNotes: Record<string, string> = {
  "job-8f2a":
    "Does not include mobile client-side latency; assumes server-side tracing is representative.",
  "job-7d41":
    "Third-party SDK behavior outside our org is inferred from sampled clients only.",
  "job-6c90":
    "Cross-region replication not modeled; single-region RCA scope.",
  "job-5b33":
    "Automated analysis cannot verify physical inventory; warehouse feed taken as ground truth.",
  "job-4a12":
    "Search ranking quality impact not quantified in this RCA.",
  "job-391f": "Limited to provider status pages and outbound webhook samples.",
  "job-280e":
    "Financial impact estimate excluded pending finance review.",
  "job-170d":
    "Client DNS caching variability may extend recovery beyond infra fix time.",
};

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

export function getInsightSummary(jobs: Job[]) {
  const total = jobs.length;
  const running = jobs.filter((j) => j.status === "running").length;
  const completed = jobs.filter((j) => j.status === "completed").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  return { total, running, completed, failed };
}
