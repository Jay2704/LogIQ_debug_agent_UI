import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { Job } from "@/types";

export function useJobs() {
  const [data, setData] = useState<Job[] | null>(null);
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
    getApi()
      .jobs.list()
      .then((jobs) => {
        if (!cancelled) {
          setData(jobs);
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
  }, [refreshKey]);

  return { data, loading, error, refetch };
}
