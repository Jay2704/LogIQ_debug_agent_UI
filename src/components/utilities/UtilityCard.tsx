import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { UtilityToolDefinition } from "@/types";
import { utilityIconMap } from "@/lib/utilityIcons";
import { UTILITY_CATEGORY_LABELS } from "@/lib/utilityCategories";
import { cn } from "@/lib/utils";

interface UtilityCardProps {
  tool: UtilityToolDefinition;
  className?: string;
}

export function UtilityCard({ tool, className }: UtilityCardProps) {
  const Icon = utilityIconMap[tool.iconKey];
  const categoryLabel = UTILITY_CATEGORY_LABELS[tool.category];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-black/[0.75] via-black/[0.92] to-black/[0.96] p-5 shadow-card transition-all duration-200",
        "hover:border-sky-500/25 hover:shadow-[0_12px_48px_-24px_rgba(56,189,248,0.15)]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sky-500/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/25">
          <Icon className="h-5 w-5 text-sky-300" strokeWidth={1.75} />
        </div>
        <span className="rounded-lg border border-white/[0.06] bg-black/[0.94] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {categoryLabel}
        </span>
      </div>
      <h3 className="relative mt-4 text-base font-bold tracking-tight text-white">
        {tool.name}
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-500">
        {tool.shortDescription}
      </p>
      <Link
        to={`/utilities/${tool.id}`}
        className={cn(
          "relative mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-300 transition",
          "hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500/60"
        )}
      >
        Open tool
        <ArrowUpRight className="h-4 w-4 opacity-80" />
      </Link>
    </div>
  );
}
