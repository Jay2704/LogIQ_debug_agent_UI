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
          "rounded-2xl border border-white/[0.1] bg-gradient-to-br from-surface-950/95 to-[#060a12] p-5 shadow-inner",
          className
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            {showLabel ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Confidence score
              </p>
            ) : null}
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Deterministic match strength for this ranked file — not LLM
              confidence.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <p
              className={cn(
                "font-mono text-5xl font-bold tabular-nums leading-none tracking-tight",
                "drop-shadow-[0_0_24px_rgba(56,189,248,0.25)]",
                pctColor
              )}
            >
              {(value * 100).toFixed(0)}
            </p>
            <span className="mt-2 font-mono text-sm font-semibold text-slate-500">
              / 100
            </span>
          </div>
        </div>
        <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/[0.08] bg-surface-950 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r shadow-[0_0_28px_-4px_rgba(56,189,248,0.55)]",
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
          <span className="font-mono font-semibold tabular-nums text-slate-100">
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
