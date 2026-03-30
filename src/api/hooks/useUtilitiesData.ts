import { useEffect, useState } from "react";
import { api } from "@/api";
import type { UtilityRunRecord, UtilityToolDefinition } from "@/types";

export interface UtilitiesPageData {
  tools: UtilityToolDefinition[];
  mostUsedIds: string[];
  recentRuns: UtilityRunRecord[];
  loading: boolean;
  error: Error | null;
}

export function useUtilitiesData(): UtilitiesPageData {
  const [tools, setTools] = useState<UtilityToolDefinition[]>([]);
  const [mostUsedIds, setMostUsedIds] = useState<string[]>([]);
  const [recentRuns, setRecentRuns] = useState<UtilityRunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.utilities.listTools(),
      api.utilities.getMostUsedToolIds(),
      api.utilities.getRecentRuns(),
    ])
      .then(([t, m, r]) => {
        if (!cancelled) {
          setTools(t);
          setMostUsedIds(m);
          setRecentRuns(r);
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

  return { tools, mostUsedIds, recentRuns, loading, error };
}
