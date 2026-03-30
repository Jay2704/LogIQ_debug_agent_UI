import { useEffect, useState } from "react";
import { api } from "@/api";
import type { AnomalyActivityPoint, TopRootCauseFileRow } from "@/types";

export function useDashboardWidgets() {
  const [activity, setActivity] = useState<AnomalyActivityPoint[] | null>(
    null
  );
  const [topFiles, setTopFiles] = useState<TopRootCauseFileRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.dashboard.getAnomalyActivity(),
      api.dashboard.getTopRootCauseFiles(),
    ])
      .then(([a, f]) => {
        if (!cancelled) {
          setActivity(a);
          setTopFiles(f);
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

  return { activity, topFiles, loading, error };
}
