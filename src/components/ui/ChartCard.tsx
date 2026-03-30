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
        "rounded-card border border-white/[0.06] bg-surface-900/50 p-5 shadow-card",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="text-slate-300 [&_.recharts-cartesian-grid-horizontal_line]:stroke-slate-700/50 [&_.recharts-cartesian-grid-vertical_line]:stroke-slate-700/50 [&_.recharts-text]:fill-slate-500 [&_.recharts-legend-item-text]:!text-slate-400">
        {children}
      </div>
    </div>
  );
}
