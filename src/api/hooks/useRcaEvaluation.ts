import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type {
  RcaConfidenceEvaluation,
  RcaEvaluationSummary,
  RcaEvaluationTrends,
  RcaServiceAccuracyResult,
} from "@/types";

export interface RcaEvaluationData {
  summary: RcaEvaluationSummary;
  services: RcaServiceAccuracyResult;
  confidence: RcaConfidenceEvaluation;
  trends: RcaEvaluationTrends;
}

export function useRcaEvaluation() {
  const [data, setData] = useState<RcaEvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const api = getApi();
    Promise.all([
      api.evaluation.getRcaSummary(),
      api.evaluation.getRcaServices(),
      api.evaluation.getRcaConfidence(),
      api.evaluation.getRcaTrends(),
    ])
      .then(([summary, services, confidence, trends]) => {
        if (!cancelled) {
          setData({ summary, services, confidence, trends });
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { data, loading, error, refetch };
}
