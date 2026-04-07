export interface JiraTicketSummary {
  key: string;
  summary: string;
  status: string;
  priority: string;
  labels: string[];
  cleanedDescription: string;
  extractedHints: string[];
}

export interface JiraRcaResult {
  rootCause: string;
  evidenceSummary: string[];
  extractedLogSignals: string[];
  explanation?: string;
}
