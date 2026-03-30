import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Anomaly, Job } from "@/types";

export function useAnomaliesData() {
  const [anomalies, setAnomalies] = useState<Anomaly[] | null>(null);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.anomalies.list(), api.jobs.list()])
      .then(([a, j]) => {
        if (!cancelled) {
          setAnomalies(a);
          setJobs(j);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { anomalies, jobs, loading, error };
}
