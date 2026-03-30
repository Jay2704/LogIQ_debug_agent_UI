import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api";
import { UtilityToolLayout } from "@/components/utilities/UtilityToolLayout";
import { UtilityToolSidebar } from "@/components/utilities/UtilityToolSidebar";
import { UtilityWorkspaceView } from "@/components/utilities/UtilityWorkspaceView";
import { PageLoading } from "@/components/ui/PageLoading";
import type { UtilityRunRecord, UtilityToolDefinition } from "@/types";

export function UtilityDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<UtilityToolDefinition | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [recentRuns, setRecentRuns] = useState<UtilityRunRecord[]>([]);

  useEffect(() => {
    if (!toolId) {
      setLoading(false);
      setTool(undefined);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.utilities
      .getTool(toolId)
      .then((t) => {
        if (!cancelled) {
          setTool(t);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setTool(undefined);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [toolId]);

  useEffect(() => {
    let cancelled = false;
    api.utilities
      .getRecentRuns()
      .then((r) => {
        if (!cancelled) setRecentRuns(r);
      })
      .catch(() => {
        if (!cancelled) setRecentRuns([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <PageLoading message="Loading tool…" />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="ui-empty-shell px-8 py-12 text-center">
        <p className="text-slate-400">Tool not found.</p>
        <Link
          to="/utilities"
          className="mt-4 inline-block text-sm font-semibold text-sky-400 hover:text-sky-300"
        >
          ← Back to utilities
        </Link>
      </div>
    );
  }

  return (
    <UtilityToolLayout
      tool={tool}
      sidebar={<UtilityToolSidebar toolId={tool.id} recentRuns={recentRuns} />}
    >
      <UtilityWorkspaceView tool={tool} />
    </UtilityToolLayout>
  );
}
