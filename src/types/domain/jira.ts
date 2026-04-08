export interface JiraTicketSummary {
  key: string;
  summary: string;
  status: string;
  priority: string;
  labels: string[];
  cleanedDescription: string;
  extractedHints: string[];
}

/** Lightweight row returned by ticket search (GET search); full details come from getTicketSummary. */
export interface JiraTicketSearchHit {
  key: string;
  summary: string;
  status: string;
  priority: string;
  /** ISO-8601 timestamp when the issue was last updated, if the backend provides it. */
  updatedAt?: string;
}

export interface JiraRcaResult {
  rootCause: string;
  confidence?: number;
  evidenceSummary: string[];
  extractedLogSignals: string[];
  explanation?: string;
  remediationSuggestions?: string[];
}
