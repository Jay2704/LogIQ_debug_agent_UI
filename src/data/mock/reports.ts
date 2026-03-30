import type { ReportArtifact } from "@/types";

export const mockReports: ReportArtifact[] = [
  {
    id: "rpt-2026-0142",
    anomalyId: "anomaly_002",
    title: "Investigation Report — auth-service session refresh regression",
    summary:
      "Deterministic Root Cause: api/auth/session_validator.py after canary 2026.03.29-2. AI Explanation summarizes JWK cache interaction; remediation verified post-rollback.",
    generatedAt: "2026-03-29T13:45:00Z",
    status: "ready",
    formats: ["pdf", "markdown", "json"],
  },
  {
    id: "rpt-2026-0141",
    anomalyId: "anomaly_003",
    title: "Investigation Report — payment-gateway retry amplification",
    summary:
      "RCA centers on services/payment/retry_manager.ts vs PSP incident window. Evidence includes trace exemplars and partner maintenance timeline.",
    generatedAt: "2026-03-29T12:10:00Z",
    status: "ready",
    formats: ["pdf", "json"],
  },
  {
    id: "rpt-2026-0143",
    anomalyId: "anomaly_001",
    title: "Investigation Report — checkout-service confirm latency (draft)",
    summary:
      "Draft ties Evidence Highlights to src/handlers/checkout_handler.py; Confidence Score 0.83 pending final reporting step.",
    generatedAt: "2026-03-29T14:30:00Z",
    status: "generating",
    formats: ["markdown"],
  },
  {
    id: "rpt-2026-0138",
    anomalyId: "anomaly_008",
    title: "Investigation Report — checkout cart merge after catalog sync",
    summary:
      "Closed: handler retry path; Similar Incidents linked. Remediation: async invalidation queue (tracked in JIRA).",
    generatedAt: "2026-03-28T09:05:00Z",
    status: "ready",
    formats: ["pdf", "markdown", "json"],
  },
  {
    id: "rpt-2026-0135",
    anomalyId: "anomaly_004",
    title: "Investigation Report — user-profile-api read-after-write",
    summary:
      "Generation failed: insufficient closure between Dynamo consistency model and client timeouts for executive summary.",
    generatedAt: "2026-03-29T10:00:00Z",
    status: "failed",
    formats: ["json"],
  },
];

export function getReportByAnomalyId(
  anomalyId: string
): ReportArtifact | undefined {
  return mockReports.find((r) => r.anomalyId === anomalyId);
}
