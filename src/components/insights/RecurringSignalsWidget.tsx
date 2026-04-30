import { Radio, TrendingDown, TrendingUp } from "lucide-react";
import type { RecurringIncidentSignal } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

interface RecurringSignalsWidgetProps {
  signals: RecurringIncidentSignal[];
  className?: string;
}

export function RecurringSignalsWidget({
  signals,
  className,
}: RecurringSignalsWidgetProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] via-black/[0.92] to-black/[0.96] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_50px_-28px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      <div className="border-b border-white/[0.06] pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400/90">
          Patterns
        </p>
        <h3 className="mt-1 text-base font-bold tracking-tight text-white">
          Recurring incident signals
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Fingerprints that fired multiple times in the last 30 days — prioritize
          platform fixes.
        </p>
      </div>
      <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {signals.map((s) => (
          <li
            key={s.id}
            className="rounded-xl border border-white/[0.06] bg-black/[0.94] p-3 transition hover:border-amber-500/25 hover:bg-black/[0.96]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-sky-400/90">
                  {s.service}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-slate-200">
                  {s.label}
                </p>
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums",
                  s.trendPct > 0
                    ? "bg-red-500/15 text-red-300"
                    : s.trendPct < 0
                      ? "bg-emerald-500/12 text-emerald-300"
                      : "bg-slate-700/50 text-slate-400"
                )}
                title="vs prior 30d window"
              >
                {s.trendPct > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : s.trendPct < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {s.trendPct === 0 ? "—" : `${s.trendPct > 0 ? "+" : ""}${s.trendPct}%`}
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Radio className="h-3 w-3 text-amber-500/80" />
                {s.occurrences} hits / 30d
              </span>
              <span className="text-slate-600">·</span>
              <time className="font-mono tabular-nums" dateTime={s.lastSeen}>
                last {formatDateTime(s.lastSeen)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
