import { getJobDetailBundle } from "@/data/mock/explanations";
import { mockJobsService } from "./jobs";
import { mockRcaFeedbackService } from "./rcaFeedback";
import { getMockMultiAgentReport } from "./multiAgent";
import { buildSampleTimeline } from "./investigations";
import type { InvestigationReport } from "@/types";

const reportCache = new Map<string, InvestigationReport>();

function formatPct(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(pct)}%`;
}

async function composeReport(investigationId: string): Promise<InvestigationReport> {
  const bundle =
    (await mockJobsService.getDetailBundle(investigationId)) ??
    getJobDetailBundle(investigationId);

  const timeline = buildSampleTimeline(investigationId);
  const feedback = await mockRcaFeedbackService.getFeedback(investigationId);
  const multiAgent = await getMockMultiAgentReport(investigationId);

  const timelineHighlights = timeline.events
    .slice(0, 5)
    .map((event) => `${event.timestamp}: ${event.title}`)
    .join("; ");

  const executiveSummary = bundle
    ? `${bundle.anomaly.summary} Deterministic RCA ranked ${bundle.rca.rootCausePath} with ${formatPct(bundle.rca.confidence)} confidence. ${bundle.explanation.slice(0, 220)}…`
    : `Investigation ${investigationId} synthesized from timeline, RCA, multi-agent, and reviewer feedback signals.`;

  const multiAgentFindings =
    multiAgent.status === "completed"
      ? multiAgent.agents.flatMap((panel) =>
          panel.findings.map((finding) => ({
            agent: panel.label,
            summary: finding.summary,
            confidence: finding.confidence,
          }))
        )
      : [];

  const recommendedActions =
    multiAgent.summary?.recommendedActions.length
      ? multiAgent.summary.recommendedActions
      : bundle?.remediation ?? [
          "Validate deploy correlation window against anomaly onset.",
          "Review ranked root cause with on-call before remediation.",
        ];

  return {
    investigationId,
    generatedAt: new Date().toISOString(),
    executiveSummary,
    timelineSummary:
      timelineHighlights ||
      "No timeline events indexed yet — run the investigation pipeline to populate temporal context.",
    rootCause: bundle?.rca.rootCausePath ?? "pending analysis",
    confidence: bundle?.rca.confidence ?? 0,
    confidenceNote: bundle?.confidenceNote,
    similarIncidents: (bundle?.similarIncidents ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      service: item.service,
      overlap: item.overlap,
    })),
    feedbackHistory: feedback.history.map((entry) => ({
      action: entry.action,
      comment: entry.comment,
      submittedAt: entry.submittedAt,
      submittedBy: entry.submittedBy,
    })),
    multiAgentFindings,
    runbooks: [
      {
        id: "RB-AUTH-03",
        title: "MFA recovery",
        summary: "Rotate JWK bundles, invalidate client caches, and verify refresh error rate.",
      },
      {
        id: "RB-CHK-12",
        title: "Checkout latency playbook",
        summary: "Compare deploy window to p99 breach, sample confirm_order traces, and gate promotion.",
      },
    ],
    recommendedActions,
  };
}

export async function getMockInvestigationReport(
  investigationId: string
): Promise<InvestigationReport> {
  const id = investigationId.trim();
  await new Promise((r) => setTimeout(r, 180));
  const cached = reportCache.get(id);
  if (cached) return cached;
  const report = await composeReport(id);
  reportCache.set(id, report);
  return report;
}

export async function refreshMockInvestigationReport(
  investigationId: string
): Promise<InvestigationReport> {
  const id = investigationId.trim();
  if (!id) {
    throw new Error("[LogIQ investigations] refreshInvestigationReport: investigation id is required");
  }
  await new Promise((r) => setTimeout(r, 320));
  const report = await composeReport(id);
  reportCache.set(id, report);
  return report;
}
