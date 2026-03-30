import { cn } from "@/lib/utils";

interface ConfidenceProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  /** default = standard row; hero = large % + thick bar for RCA focal UI */
  variant?: "default" | "hero";
}

export function ConfidenceProgressBar({
  value,
  className,
  showLabel = true,
  variant = "default",
}: ConfidenceProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const barColor =
    pct >= 85
      ? "from-emerald-400 to-emerald-500"
      : pct >= 65
        ? "from-sky-400 to-blue-500"
        : pct >= 45
          ? "from-amber-400 to-amber-500"
          : "from-red-400 to-orange-500";

  const pctColor =
    pct >= 85
      ? "text-emerald-400"
      : pct >= 65
        ? "text-sky-400"
        : pct >= 45
          ? "text-amber-400"
          : "text-red-400";

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "rounded-xl border border-white/[0.08] bg-surface-975/90 p-4 shadow-inner",
          className
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            {showLabel ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Confidence Score
              </p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">
              Model certainty for this Deterministic Root Cause ranking
            </p>
          </div>
          <p
            className={cn(
              "font-mono text-4xl font-bold tabular-nums leading-none tracking-tight",
              pctColor
            )}
          >
            {(value * 100).toFixed(0)}
            <span className="text-2xl font-semibold text-slate-500">%</span>
          </p>
        </div>
        <div className="mt-4 h-3.5 overflow-hidden rounded-full border border-white/[0.06] bg-surface-900 shadow-inner">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r shadow-[0_0_24px_-4px_rgba(56,189,248,0.45)]",
              barColor
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Confidence Score</span>
          <span className="font-mono tabular-nums font-semibold text-slate-100">
            {(value * 100).toFixed(0)}%
          </span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full border border-white/[0.06] bg-surface-800/90 shadow-inner">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
