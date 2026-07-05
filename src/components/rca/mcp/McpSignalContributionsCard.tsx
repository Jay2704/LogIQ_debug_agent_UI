import { Activity } from "lucide-react";
import { MCP_SIGNAL_KEYS } from "@/types";
import type { RcaMcpInvestigationContext } from "@/types";
import { formatSignalScore, MCP_SIGNAL_LABELS } from "@/lib/mcpSignalLabels";
import { cn } from "@/lib/utils";

interface McpSignalContributionsCardProps {
  context: RcaMcpInvestigationContext;
  className?: string;
}

export function McpSignalContributionsCard({
  context,
  className,
}: McpSignalContributionsCardProps) {
  const rows = MCP_SIGNAL_KEYS.map((key) => ({
    key,
    label: MCP_SIGNAL_LABELS[key],
    score: context.signalScores[key],
  })).filter((row) => row.score !== undefined);

  const topKey = rows.reduce<(typeof rows)[number] | null>((best, row) => {
    if (row.score === undefined) return best;
    if (!best || row.score > (best.score ?? 0)) return row;
    return best;
  }, null);

  return (
    <article
      className={cn(
        "rounded-2xl border border-violet-500/25 bg-violet-500/[0.04] p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <Activity className="h-5 w-5 text-violet-300" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300/85">
            MCP signal contributions
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Why the top RCA candidate ranked highest — weighted MCP correlation signals.
          </p>
          {topKey ? (
            <p className="mt-2 text-xs text-slate-500">
              Strongest signal:{" "}
              <span className="font-semibold text-violet-200/95">{topKey.label}</span>{" "}
              <span className="font-mono tabular-nums text-violet-300">
                ({formatSignalScore(topKey.score!)})
              </span>
            </p>
          ) : null}
        </div>
      </div>

      {rows.length ? (
        <ul className="mt-5 space-y-3">
          {rows.map((row) => {
            const normalized =
              row.score! > 1 ? row.score! / 100 : Math.min(1, Math.max(0, row.score!));
            return (
              <li key={row.key}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-slate-300">{row.label}</span>
                  <span className="font-mono tabular-nums text-violet-200">
                    {formatSignalScore(row.score!)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/60 ring-1 ring-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-sky-400"
                    style={{ width: `${normalized * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No signal scores reported.</p>
      )}
    </article>
  );
}
