import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Job } from "@/types";

export function useJobs() {
  const [data, setData] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.jobs
      .list()
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
  }, []);

  return { data, loading, error };
}
