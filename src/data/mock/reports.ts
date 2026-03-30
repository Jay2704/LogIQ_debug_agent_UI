import type { ReportArtifact } from "@/types";

export const mockReports: ReportArtifact[] = [
  {
    id: "rpt-001",
    anomalyId: "anom-m3pq",
    title: "Investigation Report — Auth refresh 401 spike",
    summary:
      "Deterministic Root Cause tied to JWK validation after v2.14.2; rollback verified. AI Explanation covers client cache interaction.",
    generatedAt: "2026-03-29T13:45:00Z",
    status: "ready",
    formats: ["pdf", "markdown", "json"],
  },
  {
    id: "rpt-002",
    anomalyId: "anom-r7nw",
    title: "Investigation Report — Payments consumer lag",
    summary:
      "RCA links lag to primary DB load during vacuum; Evidence Highlights include partition metrics and query plans.",
    generatedAt: "2026-03-29T12:10:00Z",
    status: "ready",
    formats: ["pdf", "json"],
  },
  {
    id: "rpt-003",
    anomalyId: "anom-k9x1",
    title: "Investigation Report — Checkout latency (in progress)",
    summary:
      "Draft includes Redis timeout Evidence Highlights; final Confidence Score pending end of RCA step.",
    generatedAt: "2026-03-29T14:30:00Z",
    status: "generating",
    formats: ["markdown"],
  },
  {
    id: "rpt-004",
    anomalyId: "anom-f1qs",
    title: "Investigation Report — Edge DNS mismatch",
    summary:
      "Full artifact with Remediation Steps for TTL alignment and Similar Incidents cross-linked.",
    generatedAt: "2026-03-28T09:05:00Z",
    status: "ready",
    formats: ["pdf", "markdown", "json"],
  },
  {
    id: "rpt-005",
    anomalyId: "anom-j2lm",
    title: "Investigation Report — Inventory shard drift",
    summary:
      "Report generation failed: insufficient evidence closure for Deterministic Root Cause.",
    generatedAt: "2026-03-29T10:00:00Z",
    status: "failed",
    formats: ["json"],
  },
];
