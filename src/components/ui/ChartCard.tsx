import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-indigo-500/15 bg-gradient-to-b from-surface-850/85 via-surface-960 to-surface-975 p-5 shadow-card-premium",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div
        className={cn(
          "rounded-xl border border-blue-500/[0.08] bg-surface-975/90 p-3 shadow-inner",
          "[&_.recharts-cartesian-grid-horizontal_line]:stroke-slate-600/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-slate-600/40",
          "[&_.recharts-text]:fill-slate-400 [&_.recharts-legend-item-text]:!text-slate-400"
        )}
      >
        {children}
      </div>
    </div>
  );
}
