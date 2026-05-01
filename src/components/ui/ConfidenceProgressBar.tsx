import {
  CONFIDENCE_CONTEXT_RANKED,
  CONFIDENCE_CONTEXT_SIGNALS,
  confidenceTierBadgeClassName,
  interpretConfidence,
  type ConfidenceTier,
} from "@/lib/rcaConfidence";
import { cn } from "@/lib/utils";

interface ConfidenceProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  /** default = standard row; hero = large % + thick bar for RCA focal UI */
  variant?: "default" | "hero";
}

const tierBarClass: Record<ConfidenceTier, string> = {
  high: "from-emerald-400 to-emerald-500 shadow-[0_0_24px_-4px_rgba(52,211,153,0.45)]",
  medium:
    "from-amber-400 to-amber-500 shadow-[0_0_24px_-4px_rgba(245,158,11,0.35)]",
  low: "from-rose-400 to-orange-500 shadow-[0_0_24px_-4px_rgba(251,113,133,0.35)]",
} as const;

const tierPctClass: Record<ConfidenceTier, string> = {
  high: "text-emerald-400 drop-shadow-[0_0_24px_rgba(52,211,153,0.25)]",
  medium: "text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  low: "text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.2)]",
} as const;

export function ConfidenceProgressBar({
  value,
  className,
  showLabel = true,
  variant = "default",
}: ConfidenceProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const { tier, label: tierLabel } = interpretConfidence(value);
  const pctInt = Math.round(value * 100);

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-white/[0.1] bg-gradient-to-br from-black/[0.9] to-[#060a12] p-5 shadow-inner ring-1 ring-inset ring-white/[0.04]",
          className
        )}
        role="group"
        aria-label={`Deterministic confidence ${tierLabel}, ${pctInt} percent`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1 space-y-3">
            {showLabel ? (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Deterministic confidence
                </p>
                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.08] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-emerald-400/90">
                  Deterministic
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
                    confidenceTierBadgeClassName[tier]
                  )}
                >
                  {tierLabel}
                </span>
              </div>
            ) : null}
            <div className="space-y-1 text-xs leading-relaxed text-slate-500">
              <p>{CONFIDENCE_CONTEXT_RANKED}</p>
              <p className="text-slate-500">{CONFIDENCE_CONTEXT_SIGNALS}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-0.5 sm:items-end sm:text-right">
            <p
              className={cn(
                "font-mono text-5xl font-bold tabular-nums leading-none tracking-tight",
                tierPctClass[tier]
              )}
            >
              {pctInt}
            </p>
            <span className="font-mono text-sm font-semibold text-slate-500">
              / 100
            </span>
          </div>
        </div>
        <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/[0.08] bg-black/[0.9] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-[width] duration-500",
              tierBarClass[tier]
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
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-2 font-semibold text-slate-500">
            Confidence
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                confidenceTierBadgeClassName[tier]
              )}
            >
              {tierLabel}
            </span>
          </span>
          <span
            className={cn(
              "font-mono font-semibold tabular-nums",
              tierPctClass[tier]
            )}
          >
            {pctInt}%
          </span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full border border-white/[0.06] bg-black/[0.7] shadow-inner">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            tierBarClass[tier]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
