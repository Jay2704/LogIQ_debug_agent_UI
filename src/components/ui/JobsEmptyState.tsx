import { FilterX, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobsEmptyStateProps {
  className?: string;
  hasActiveFilters: boolean;
  onClearFilters?: () => void;
}

export function JobsEmptyState({
  className,
  hasActiveFilters,
  onClearFilters,
}: JobsEmptyStateProps) {
  return (
    <div
      className={cn(
        "ui-empty-shell flex flex-col items-center justify-center px-8 py-16 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-surface-975/90 shadow-[0_0_40px_-12px_rgba(56,189,248,0.2)] ring-1 ring-white/[0.04]">
        <ListTodo className="h-7 w-7 text-slate-500" strokeWidth={1.25} />
      </div>
      <h2 className="mt-6 text-lg font-semibold tracking-tight text-white">
        {hasActiveFilters
          ? "No jobs match this view"
          : "No debug jobs yet"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {hasActiveFilters
          ? "Try widening your search, clearing filters, or checking a different status or trigger."
          : "When investigations start from alerts, API calls, or manual runs, they will appear here."}
      </p>
      {hasActiveFilters && onClearFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className={cn(
            "mt-8 inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-300 transition-all duration-200",
            "hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white"
          )}
        >
          <FilterX className="h-4 w-4" />
          Clear filters & search
        </button>
      ) : null}
    </div>
  );
}
