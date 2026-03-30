import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "blue" | "violet" | "green" | "amber" | "red";
}

const variantStyles: Record<
  NonNullable<KpiCardProps["variant"]>,
  string
> = {
  default:
    "from-surface-800/80 to-surface-900/90 border-white/[0.06] shadow-card",
  blue: "from-blue-500/10 via-surface-850 to-surface-900 border-blue-500/20 shadow-glow-blue",
  violet:
    "from-violet-500/10 via-surface-850 to-surface-900 border-violet-500/20 shadow-glow-violet",
  green:
    "from-emerald-500/10 via-surface-850 to-surface-900 border-emerald-500/20",
  amber:
    "from-amber-500/10 via-surface-850 to-surface-900 border-amber-500/20",
  red: "from-red-500/10 via-surface-850 to-surface-900 border-red-500/20",
};

const iconWrap: Record<NonNullable<KpiCardProps["variant"]>, string> = {
  default: "bg-surface-700/80 text-slate-300",
  blue: "bg-blue-500/15 text-blue-400",
  violet: "bg-violet-500/15 text-violet-400",
  green: "bg-emerald-500/15 text-emerald-400",
  amber: "bg-amber-500/15 text-amber-400",
  red: "bg-red-500/15 text-red-400",
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border bg-gradient-to-br p-5",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            iconWrap[variant]
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
