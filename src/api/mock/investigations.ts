import type { InvestigationsService } from "@/api/contracts";
import type { InvestigationGraph, SimilarHistoricalInvestigation } from "@/types";
import { sortSimilarInvestigations } from "@/api/http/parseSimilarInvestigationsApi";

function buildSampleGraph(investigationId: string): InvestigationGraph {
  const rootId = `inv-${investigationId}`;

  return {
    investigationId,
    nodes: [
      {
        id: rootId,
        type: "investigation",
        title: `Investigation ${investigationId}`,
        timestamp: "2026-03-29T14:22:11Z",
        metadata: { status: "running", service: "checkout-service" },
        position: { x: 360, y: 0 },
      },
      {
        id: `${rootId}-jira`,
        type: "jira",
        title: "LOG-482 · MFA timeout spike",
        timestamp: "2026-03-29T13:50:00Z",
        metadata: { key: "LOG-482", priority: "High" },
        position: { x: 120, y: 130 },
      },
      {
        id: `${rootId}-alert`,
        type: "alert",
        title: "P99 latency breach · checkout",
        timestamp: "2026-03-29T14:18:00Z",
        metadata: { severity: "critical", threshold: "850ms" },
        position: { x: 360, y: 130 },
      },
      {
        id: `${rootId}-incident`,
        type: "incident",
        title: "INC-1192 · Checkout degradation",
        timestamp: "2026-03-29T14:20:00Z",
        metadata: { status: "active" },
        position: { x: 600, y: 130 },
      },
      {
        id: `${rootId}-commit`,
        type: "commit",
        title: "a1b2c3d · fix(auth): session timeout",
        timestamp: "2026-03-28T16:40:00Z",
        metadata: { repository: "logiq/platform-api", author: "alex.chen" },
        position: { x: 0, y: 260 },
      },
      {
        id: `${rootId}-build`,
        type: "build",
        title: "Build #1842 · platform-api",
        timestamp: "2026-03-28T17:05:00Z",
        metadata: { result: "success", duration_sec: 312 },
        position: { x: 240, y: 260 },
      },
      {
        id: `${rootId}-deploy`,
        type: "deployment",
        title: "Deploy prod-us-east-1",
        timestamp: "2026-03-28T17:42:00Z",
        metadata: { environment: "production", revision: "v2.4.18" },
        position: { x: 480, y: 260 },
      },
      {
        id: `${rootId}-metric`,
        type: "metric",
        title: "auth.session.timeout_rate",
        timestamp: "2026-03-29T14:15:00Z",
        metadata: { value: 0.18, unit: "ratio" },
        position: { x: 240, y: 390 },
      },
      {
        id: `${rootId}-runbook`,
        type: "runbook",
        title: "RB-AUTH-03 · MFA recovery",
        timestamp: "2026-03-29T14:25:00Z",
        metadata: { owner: "platform-oncall" },
        position: { x: 600, y: 390 },
      },
    ],
    edges: [
      { id: "e1", source: rootId, target: `${rootId}-jira`, label: "linked ticket" },
      { id: "e2", source: rootId, target: `${rootId}-alert`, label: "triggered by" },
      { id: "e3", source: rootId, target: `${rootId}-incident`, label: "escalated" },
      { id: "e4", source: `${rootId}-commit`, target: `${rootId}-build`, label: "built" },
      { id: "e5", source: `${rootId}-build`, target: `${rootId}-deploy`, label: "deployed" },
      { id: "e6", source: `${rootId}-deploy`, target: rootId, label: "correlates" },
      { id: "e7", source: `${rootId}-alert`, target: `${rootId}-metric`, label: "observed" },
      { id: "e8", source: rootId, target: `${rootId}-runbook`, label: "remediation" },
      { id: "e9", source: `${rootId}-jira`, target: `${rootId}-commit`, label: "references" },
    ],
  };
}

function buildSampleSimilarIncidents(
  investigationId: string
): SimilarHistoricalInvestigation[] {
  return sortSimilarInvestigations([
    {
      investigationId: "dbg_2026_002",
      similarityScore: 0.91,
      rootCause: "Stale JWT signing keys after rotation — refresh token rejected",
      confidence: 0.87,
      matchedFactors: ["auth-service", "401 errors", "session_validator stack frame"],
      resolutionSummary:
        "Forced client cache invalidation and replayed key rotation with staged rollout. Incident closed after error rate returned to baseline within 22 minutes.",
    },
    {
      investigationId: "dbg_2026_003",
      similarityScore: 0.78,
      rootCause: "Retry storm against degraded payment partner endpoint",
      confidence: 0.72,
      matchedFactors: ["timeout burst", "retry_manager", "partner maintenance window"],
      resolutionSummary:
        "Enabled circuit breaker and capped retry budget during partner maintenance. Post-incident: added partner status webhook for proactive backoff.",
    },
    {
      investigationId: "dbg_2026_006",
      similarityScore: 0.64,
      rootCause: "Idempotency key collision during regional failover drill",
      confidence: 0.58,
      matchedFactors: ["payment-gateway", "duplicate charge guard", "failover replay"],
      resolutionSummary:
        "Replayed ledger reconciliation and patched idempotency boundary to include region shard. No customer impact after manual refund sweep.",
    },
  ].filter((row) => row.investigationId !== investigationId));
}

export const mockInvestigationsService: InvestigationsService = {
  async getGraph(investigationId: string) {
    const id = investigationId.trim();
    if (!id) {
      throw new Error("[LogIQ investigations] getGraph: investigation id is required");
    }
    await new Promise((r) => setTimeout(r, 200));
    return buildSampleGraph(id);
  },

  async getSimilarIncidents(investigationId: string) {
    const id = investigationId.trim();
    if (!id) {
      throw new Error("[LogIQ investigations] getSimilarIncidents: investigation id is required");
    }
    await new Promise((r) => setTimeout(r, 180));
    return {
      investigationId: id,
      incidents: buildSampleSimilarIncidents(id),
    };
  },
};
