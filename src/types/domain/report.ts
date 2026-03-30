export type ReportStatus = "ready" | "generating" | "failed";

export interface ReportArtifact {
  id: string;
  anomalyId: string;
  title: string;
  summary: string;
  generatedAt: string;
  status: ReportStatus;
  formats: ("pdf" | "json" | "markdown")[];
}
