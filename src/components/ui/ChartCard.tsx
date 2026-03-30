import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Small label above title (e.g. “Volume”) */
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Extra classes on the inner chart panel */
  chartClassName?: string;
}

export function ChartCard({
  title,
  subtitle,
  eyebrow,
  action,
  children,
  className,
  chartClassName,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.1] bg-gradient-to-b from-surface-850/90 via-surface-960 to-surface-975 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_20px_50px_-28px_rgba(0,0,0,0.55)]",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="ui-section-eyebrow">{eyebrow}</p>
          ) : null}
          <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div
        className={cn(
          "rounded-xl border border-blue-500/[0.1] bg-[#060a12]/80 p-4 shadow-inner",
          "[&_.recharts-cartesian-grid-horizontal_line]:stroke-slate-600/45 [&_.recharts-cartesian-grid-vertical_line]:stroke-slate-700/35",
          "[&_.recharts-text]:fill-slate-400 [&_.recharts-legend-item-text]:!text-slate-400",
          chartClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
