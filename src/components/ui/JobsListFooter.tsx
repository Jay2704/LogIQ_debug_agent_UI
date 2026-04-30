import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobsListFooterProps {
  showing: number;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function JobsListFooter({
  showing,
  total,
  hasMore,
  onLoadMore,
  className,
}: JobsListFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-blue-500/[0.1] bg-black/[0.94] px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold tabular-nums text-slate-300">
          {Math.min(showing, total)}
        </span>{" "}
        of{" "}
        <span className="font-semibold tabular-nums text-slate-300">{total}</span>{" "}
        <span className="text-slate-600">jobs</span>
      </p>
      <div className="flex items-center gap-3">
        {hasMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/25 bg-black/[0.82] px-4 py-2 text-sm font-semibold text-slate-200 shadow-inner transition hover:border-sky-500/35 hover:bg-sky-500/10 hover:text-white"
          >
            Load more
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        ) : total > 0 ? (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
            End of list
          </span>
        ) : null}
      </div>
    </div>
  );
}
