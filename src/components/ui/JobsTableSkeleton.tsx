import { cn } from "@/lib/utils";

interface JobsTableSkeletonProps {
  rows?: number;
  className?: string;
}

export function JobsTableSkeleton({
  rows = 8,
  className,
}: JobsTableSkeletonProps) {
  return (
    <div
      className={cn(
        "ui-table-shell overflow-hidden from-black/[0.75] shadow-card-premium",
        className
      )}
    >
      <div className="border-b border-white/[0.08] bg-black/[0.94] px-4 py-3.5">
        <div className="flex gap-4">
          {["w-[22%]", "w-[18%]", "w-[12%]", "w-[12%]", "w-[18%]", "w-[18%]"].map(
            (w, i) => (
              <div
                key={i}
                className={cn(
                  "h-3 rounded-md bg-slate-700/40",
                  w,
                  i === 0 && "animate-pulse"
                )}
              />
            )
          )}
        </div>
      </div>
      <div className="divide-y divide-blue-500/[0.06]">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="h-4 w-[22%] rounded bg-slate-700/35 animate-pulse" />
            <div className="h-4 w-[18%] rounded bg-slate-700/30 animate-pulse" />
            <div className="h-6 w-[12%] rounded-full bg-slate-700/35 animate-pulse" />
            <div className="h-4 w-[12%] rounded bg-slate-700/30 animate-pulse" />
            <div className="h-4 w-[18%] rounded bg-slate-700/25 animate-pulse" />
            <div className="ml-auto h-8 w-28 rounded-lg bg-slate-700/35 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
