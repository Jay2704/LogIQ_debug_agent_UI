/** Row returned by GET /api/v1/investigations/{id}/similar */
export interface SimilarHistoricalInvestigation {
  investigationId: string;
  similarityScore: number;
  rootCause: string;
  confidence?: number;
  matchedFactors: string[];
  resolutionSummary: string;
}

export interface SimilarInvestigationsResult {
  investigationId: string;
  incidents: SimilarHistoricalInvestigation[];
}
