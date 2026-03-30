import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { api } from "@/api";
import { utilityIconMap } from "@/lib/utilityIcons";
import { UTILITY_CATEGORY_LABELS } from "@/lib/utilityCategories";
import { PageLoading } from "@/components/ui/PageLoading";
import type { UtilityToolDefinition } from "@/types";

export function UtilityDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<UtilityToolDefinition | undefined>();
  const [error, setError] = useState<Error | null>(null);

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

  const Icon = utilityIconMap[tool.iconKey];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        to="/utilities"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Utilities
      </Link>

      <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-surface-900/95 to-surface-975 p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-500/30">
              <Icon className="h-7 w-7 text-sky-300" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {UTILITY_CATEGORY_LABELS[tool.category]}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {tool.name}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {tool.shortDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
          <div className="flex items-start gap-3">
            <Construction className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-200/95">
                Tool workspace (placeholder)
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This screen will host the interactive tool UI (inputs, log preview,
                results) when wired to your backend. No execution or storage occurs
                in the mock client.
              </p>
              <p className="mt-3 font-mono text-[11px] text-slate-600">
                tool_id · {tool.id}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="rounded-xl border border-white/[0.08] bg-surface-975/80 px-5 py-2.5 text-sm font-semibold text-slate-500"
          >
            Run tool (requires backend)
          </button>
        </div>
      </div>
    </div>
  );
}
