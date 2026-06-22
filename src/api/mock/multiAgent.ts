import type {
  AgentFinding,
  InvestigationAgentId,
  MultiAgentInvestigationReport,
  MultiAgentInvestigationSummary,
  MultiAgentPanel,
} from "@/types";
import {
  INVESTIGATION_AGENT_LABELS,
  INVESTIGATION_AGENT_ORDER,
} from "@/types/domain/multiAgent";

const runCache = new Map<string, MultiAgentInvestigationReport>();

function emptyPanel(agentId: InvestigationAgentId): MultiAgentPanel {
  return {
    agentId,
    label: INVESTIGATION_AGENT_LABELS[agentId],
    status: "idle",
    findings: [],
  };
}

function buildEmptyReport(investigationId: string): MultiAgentInvestigationReport {
  return {
    investigationId,
    status: "not_started",
    agents: INVESTIGATION_AGENT_ORDER.map(emptyPanel),
    summary: null,
    lastRunAt: null,
  };
}

function buildFindings(
  investigationId: string,
  agentId: InvestigationAgentId,
  rows: Omit<AgentFinding, "id">[]
): AgentFinding[] {
  return rows.map((row, index) => ({
    id: `${investigationId}-${agentId}-${index + 1}`,
    ...row,
  }));
}

function buildCompletedReport(investigationId: string): MultiAgentInvestigationReport {
  const agents: MultiAgentPanel[] = [
    {
      agentId: "timeline",
      label: INVESTIGATION_AGENT_LABELS.timeline,
      status: "completed",
      findings: buildFindings(investigationId, "timeline", [
        {
          summary:
            "Latency regression onset aligns with a 6-minute deploy overlap and a preceding auth timeout spike.",
          evidence: [
            "trace:chk-us1-8a2f · confirm_order span +340ms",
            "timeline:alert_fired @ 2026-03-29T14:18:00Z",
            "metric:checkout.p99 crossed 850ms for 5 minutes",
          ],
          confidence: 0.84,
        },
        {
          summary:
            "Incident escalation occurred 2 minutes after the first sustained breach window.",
          evidence: [
            "pagerduty:INC-1192 opened @ 2026-03-29T14:20:00Z",
            "timeline:rca_complete followed alert by 4 minutes",
          ],
          confidence: 0.79,
        },
      ]),
    },
    {
      agentId: "deployment",
      label: INVESTIGATION_AGENT_LABELS.deployment,
      status: "completed",
      findings: buildFindings(investigationId, "deployment", [
        {
          summary:
            "Production deploy v2.4.18 touched session validation paths used by checkout confirm flow.",
          evidence: [
            "github.actions:Deploy prod-us-east-1 @ 2026-03-28T17:42:00Z",
            "diff:api/auth/session_validator.py (+38/-12)",
            "build:#1842 platform-api success",
          ],
          confidence: 0.88,
        },
      ]),
    },
    {
      agentId: "infrastructure",
      label: INVESTIGATION_AGENT_LABELS.infrastructure,
      status: "completed",
      findings: buildFindings(investigationId, "infrastructure", [
        {
          summary:
            "Auth pod HPA scaled during promotion window; Redis session shard CPU peaked at 78%.",
          evidence: [
            "k8s:HPA auth-service 6→10 replicas",
            "redis:session-cluster CPU 78% during rotation window",
            "node:checkout pool nominal — not infra-bound",
          ],
          confidence: 0.76,
        },
      ]),
    },
    {
      agentId: "incident",
      label: INVESTIGATION_AGENT_LABELS.incident,
      status: "completed",
      findings: buildFindings(investigationId, "incident", [
        {
          summary:
            "Active incident correlates with checkout degradation and MFA timeout customer reports.",
          evidence: [
            "jira:LOG-482 MFA timeout spike (linked)",
            "incident:INC-1192 status active",
            "support:14 tickets tagged checkout-timeout in 20m window",
          ],
          confidence: 0.81,
        },
      ]),
    },
    {
      agentId: "knowledge",
      label: INVESTIGATION_AGENT_LABELS.knowledge,
      status: "completed",
      findings: buildFindings(investigationId, "knowledge", [
        {
          summary:
            "Runbook RB-AUTH-03 and prior dbg_2026_002 incident share session_validator failure mode.",
          evidence: [
            "runbook:RB-AUTH-03 MFA recovery",
            "historical:dbg_2026_002 root cause 91% similar",
            "kb:JWK rotation checklist step 4 missed on mobile clients",
          ],
          confidence: 0.73,
        },
      ]),
    },
    {
      agentId: "rca",
      label: INVESTIGATION_AGENT_LABELS.rca,
      status: "completed",
      findings: buildFindings(investigationId, "rca", [
        {
          summary:
            "Deterministic RCA ranks session_validator.py#L142 as primary root cause with strong trace alignment.",
          evidence: [
            "rca:src/handlers/checkout_handler.py#L142-L168 rank #1",
            "confidence:0.83 deterministic score",
            "evidence:deploy correlation + stack frame match",
          ],
          confidence: 0.83,
        },
        {
          summary:
            "Secondary candidate retry_manager.ts deprioritized — partner latency external to code regression.",
          evidence: [
            "rca:retry_manager.ts rank #3",
            "partner status: maintenance window overlap",
          ],
          confidence: 0.62,
        },
      ]),
    },
  ];

  const summary: MultiAgentInvestigationSummary = {
    headline: "Checkout latency driven by auth session validation regression after deploy",
    narrative:
      "Six specialist agents converged on a deploy-correlated auth session validation change as the primary driver of checkout confirm latency. Timeline and deployment agents established temporal alignment; infrastructure ruled out checkout pool saturation; incident and knowledge agents linked customer impact to a known JWK rotation pattern; RCA agent confirmed the deterministic file anchor.",
    primaryRootCause: "api/auth/session_validator.py#L88-L104",
    overallConfidence: 0.86,
    recommendedActions: [
      "Roll back or patch session_validator validation order for legacy mobile clients.",
      "Invalidate client JWK caches and verify refresh error rate returns to baseline.",
      "Add deploy guardrail: block promotion when auth refresh 401 rate exceeds SLO for 3 minutes.",
    ],
  };

  return {
    investigationId,
    status: "completed",
    agents,
    summary,
    lastRunAt: new Date().toISOString(),
  };
}

export async function getMockMultiAgentReport(
  investigationId: string
): Promise<MultiAgentInvestigationReport> {
  const id = investigationId.trim();
  await new Promise((r) => setTimeout(r, 160));
  return runCache.get(id) ?? buildEmptyReport(id);
}

export async function runMockMultiAgentInvestigation(
  investigationId: string
): Promise<MultiAgentInvestigationReport> {
  const id = investigationId.trim();
  if (!id) {
    throw new Error("[LogIQ investigations] runMultiAgentInvestigation: investigation id is required");
  }
  await new Promise((r) => setTimeout(r, 900));
  const report = buildCompletedReport(id);
  runCache.set(id, report);
  return report;
}
