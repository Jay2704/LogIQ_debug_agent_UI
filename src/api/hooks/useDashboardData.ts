import { useCallback, useEffect, useState } from "react";
import { api } from "@/api";
import type { Anomaly, Job, RcaResult } from "@/types";

/** Live workspace jobs — GET /api/v1/jobs when HTTP mode is enabled. */
export interface DashboardJobsState {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/** Mock-backed context for anomaly copy + RCA map (not on backend yet). Fails soft. */
export interface DashboardEnrichmentState {
  anomalies: Anomaly[];
  rcaByJobId: Record<string, RcaResult>;
  loading: boolean;
}

export function useDashboardJobs(): DashboardJobsState {
  const [jobs, setJobs] = useState<Job[]>([]);
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
    api.jobs
      .list()
      .then((next) => {
        if (!cancelled) {
          setJobs(next);
          setLoading(false);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setJobs([]);
          setLoading(false);
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { jobs, loading, error, refetch };
}

/**
 * Anomalies list + RCA-by-job map from mock fixtures (hybrid API).
 * Does not block KPIs — used for investigation card blurbs and mean confidence only.
 */
export function useDashboardEnrichment(): DashboardEnrichmentState {
  const [state, setState] = useState<DashboardEnrichmentState>({
    anomalies: [],
    rcaByJobId: {},
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([api.anomalies.list(), api.rca.getByJobIdMap()]).then(
      (results) => {
        if (cancelled) return;
        const anomalies =
          results[0].status === "fulfilled" ? results[0].value : [];
        const rcaByJobId =
          results[1].status === "fulfilled" ? results[1].value : {};
        setState({ anomalies, rcaByJobId, loading: false });
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
