import { useMemo, useState } from "react";
import { History, Search, SlidersHorizontal } from "lucide-react";
import { UtilityCard } from "@/components/utilities/UtilityCard";
import { PageLoading } from "@/components/ui/PageLoading";
import { SearchInput } from "@/components/ui/SearchInput";
import { useUtilitiesData } from "@/api/hooks/useUtilitiesData";
import { UTILITY_CATEGORY_LABELS, UTILITY_CATEGORY_ORDER } from "@/lib/utilityCategories";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { UtilityCategory } from "@/types";

const ALL = "all" as const;

export function Utilities() {
  const { tools, mostUsedIds, recentRuns, loading, error } = useUtilitiesData();
  const [category, setCategory] = useState<typeof ALL | UtilityCategory>(ALL);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const catOk = category === ALL || t.category === category;
      const textOk =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [tools, category, query]);

  const mostUsedTools = useMemo(() => {
    const set = new Set(mostUsedIds);
    return filtered.filter((t) => set.has(t.id));
  }, [filtered, mostUsedIds]);

  /** Avoid duplicating “most used” cards in the main grid when no filters active */
  const browseList = useMemo(() => {
    if (category !== ALL || query.trim()) return filtered;
    const mu = new Set(mostUsedIds);
    return filtered.filter((t) => !mu.has(t.id));
  }, [filtered, category, query, mostUsedIds]);

  if (loading) {
    return <PageLoading message="Loading utilities…" />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="ui-section-eyebrow">Tools</p>
        <h1 className="ui-page-title">Utilities</h1>
        <p className="ui-page-desc">
          Standalone tools for focused log inspection and debugging workflows — separate
          from the main RCA investigation pipeline.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-surface-975/50 p-4 shadow-inner sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search tools
            </label>
            <SearchInput
              variant="panel"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name or description…"
              aria-label="Search utilities"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Category
            </span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as typeof ALL | UtilityCategory)
              }
              className="rounded-xl border border-white/[0.08] bg-surface-975/80 px-3 py-2 text-sm text-slate-200 shadow-inner outline-none focus:border-sky-500/45 focus:ring-0"
            >
              <option value={ALL}>All categories</option>
              {UTILITY_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {UTILITY_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {mostUsedTools.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-sky-500/80" />
            <h2 className="text-lg font-bold text-white">Most used tools</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mostUsedTools.map((t) => (
              <UtilityCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Browse tools</h2>
        {filtered.length === 0 ? (
          <p className="ui-empty-shell px-6 py-12 text-center text-sm text-slate-500">
            No tools match your filters.
          </p>
        ) : browseList.length === 0 ? (
          <p className="text-sm text-slate-500">
            All matching tools are shown in “Most used” above.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {browseList.map((t) => (
              <UtilityCard key={t.id} tool={t} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-violet-400/90" />
          <h2 className="text-lg font-bold text-white">Recent utility runs</h2>
        </div>
        <p className="text-sm text-slate-500">
          Mock history — connect telemetry to populate from your workspace.
        </p>
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-975/60 shadow-inner">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {recentRuns.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {r.toolName}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums">
                    {formatDateTime(r.startedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-xs font-semibold",
                        r.status === "completed" &&
                          "bg-emerald-500/15 text-emerald-300",
                        r.status === "failed" && "bg-red-500/15 text-red-300",
                        r.status === "running" && "bg-amber-500/15 text-amber-300"
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
