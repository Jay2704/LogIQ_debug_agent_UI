import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { utilityIconMap } from "@/lib/utilityIcons";
import { UTILITY_CATEGORY_LABELS } from "@/lib/utilityCategories";
import { cn } from "@/lib/utils";
import type { UtilityToolDefinition } from "@/types";

export function UtilityPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-surface-975/70 p-4 shadow-inner sm:p-5",
        className
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

interface UtilityToolLayoutProps {
  tool: UtilityToolDefinition;
  sidebar?: ReactNode;
  children: ReactNode;
}

export function UtilityToolLayout({ tool, sidebar, children }: UtilityToolLayoutProps) {
  const Icon = utilityIconMap[tool.iconKey];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8">
      <Link
        to="/utilities"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Utilities
      </Link>

      <header className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-surface-900/95 to-surface-975 p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-500/30">
            <Icon className="h-7 w-7 text-sky-300" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              {UTILITY_CATEGORY_LABELS[tool.category]}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              {tool.shortDescription}
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="min-w-0 space-y-6">{children}</div>
        {sidebar ? <aside className="min-w-0">{sidebar}</aside> : null}
      </div>
    </div>
  );
}
