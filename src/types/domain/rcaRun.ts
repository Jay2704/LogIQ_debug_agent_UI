/** Context sent with POST /api/v1/rca/run. */
export interface RcaRunInput {
  anomalyId: string;
  workspaceId: string;
  repoName?: string;
}
