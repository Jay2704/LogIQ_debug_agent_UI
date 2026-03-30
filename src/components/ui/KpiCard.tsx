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
    "border-blue-500/[0.1] from-surface-825/90 via-surface-925 to-surface-960 shadow-card",
  blue:
    "border-blue-500/25 from-blue-500/[0.12] via-surface-900/95 to-surface-960 shadow-glow-blue",
  violet:
    "border-violet-500/25 from-violet-500/[0.12] via-surface-900/95 to-surface-960 shadow-glow-violet",
  green:
    "border-emerald-500/20 from-emerald-500/[0.1] via-surface-900/95 to-surface-960 shadow-[0_0_40px_-16px_rgba(16,185,129,0.2)]",
  amber:
    "border-amber-500/25 from-amber-500/[0.1] via-surface-900/95 to-surface-960 shadow-[0_0_40px_-16px_rgba(245,158,11,0.2)]",
  red:
    "border-red-500/20 from-red-500/[0.08] via-surface-900/95 to-surface-960 shadow-[0_0_40px_-16px_rgba(239,68,68,0.15)]",
};

const iconWrap: Record<NonNullable<KpiCardProps["variant"]>, string> = {
  default: "bg-surface-800/90 text-slate-300 ring-1 ring-white/[0.06]",
  blue: "bg-blue-500/20 text-sky-300 ring-1 ring-blue-400/25",
  violet: "bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/25",
  green: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/25",
  amber: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/25",
  red: "bg-red-500/20 text-red-300 ring-1 ring-red-400/25",
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">
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
