import { useEffect, useState } from "react";
import { api } from "@/api";
import type { InsightMetrics } from "@/types";

export function useInsightMetrics() {
  const [data, setData] = useState<InsightMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.insights
      .getMetrics()
      .then((m) => {
        if (!cancelled) {
          setData(m);
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

  return { data, loading, error };
}
