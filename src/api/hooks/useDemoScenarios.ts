import { useCallback, useEffect, useState } from "react";
import { getApi } from "@/api/client";
import type { DemoScenario, Job } from "@/types";

export function useDemoScenarios() {
  const [scenarios, setScenarios] = useState<DemoScenario[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [launchingId, setLaunchingId] = useState<string | null>(null);
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
      .demo.listScenarios()
      .then((rows) => {
        if (!cancelled) {
          setScenarios(rows);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setScenarios(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const launchScenario = useCallback(
    async (scenarioId: string, triggeredByUserId: string): Promise<Job> => {
      setLaunchingId(scenarioId);
      setError(null);
      try {
        const result = await getApi().demo.launchScenario(scenarioId, {
          triggeredByUserId,
        });
        return result.job;
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setLaunchingId(null);
      }
    },
    []
  );

  return {
    scenarios,
    loading,
    error,
    launchingId,
    refetch,
    launchScenario,
  };
}
