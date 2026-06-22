export interface InvestigationReportSimilarIncident {
  id: string;
  title: string;
  service: string;
  overlap: string;
}

export interface InvestigationReportFeedbackEntry {
  action: string;
  comment?: string;
  submittedAt: string;
  submittedBy?: string;
}

export interface InvestigationReportMultiAgentFinding {
  agent: string;
  summary: string;
  confidence: number;
}

export interface InvestigationReportRunbook {
  id: string;
  title: string;
  summary: string;
}

/** Aggregated investigation report for the Report Center workspace. */
export interface InvestigationReport {
  investigationId: string;
  generatedAt: string;
  executiveSummary: string;
  timelineSummary: string;
  rootCause: string;
  confidence: number;
  confidenceNote?: string;
  similarIncidents: InvestigationReportSimilarIncident[];
  feedbackHistory: InvestigationReportFeedbackEntry[];
  multiAgentFindings: InvestigationReportMultiAgentFinding[];
  runbooks: InvestigationReportRunbook[];
  recommendedActions: string[];
}
