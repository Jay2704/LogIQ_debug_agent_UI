import { cn } from "@/lib/utils";

interface ConfidenceProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceProgressBar({
  value,
  className,
  showLabel = true,
}: ConfidenceProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const barColor =
    pct >= 85
      ? "from-emerald-500 to-emerald-400"
      : pct >= 65
        ? "from-blue-500 to-cyan-400"
        : pct >= 45
          ? "from-amber-500 to-amber-400"
          : "from-red-500 to-orange-400";

  return (
    <div className={cn("w-full", className)}>
      {showLabel ? (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Confidence Score</span>
          <span className="font-mono tabular-nums text-slate-200">
            {(value * 100).toFixed(0)}%
          </span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-surface-700/80">
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
