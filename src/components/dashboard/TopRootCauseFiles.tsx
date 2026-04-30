import { FileCode2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { TopRootCauseFileRow } from "@/types";
import { cn } from "@/lib/utils";

interface TopRootCauseFilesProps {
  rows: TopRootCauseFileRow[];
  maxHits: number;
  className?: string;
}

function TrendIcon({ trend }: { trend: TopRootCauseFileRow["trend"] }) {
  if (trend === "up") {
    return <TrendingUp className="h-3.5 w-3.5 text-amber-400" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />;
  }
  return <Minus className="h-3.5 w-3.5 text-slate-500" />;
}

export function TopRootCauseFiles({
  rows,
  maxHits,
  className,
}: TopRootCauseFilesProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-card border border-indigo-500/20 bg-gradient-to-b from-black/[0.85] to-black/[0.96] p-5 shadow-inner",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 ring-1 ring-indigo-400/25">
          <FileCode2 className="h-4 w-4 text-indigo-300" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-300/80">
            Deterministic RCA
          </p>
          <h3 className="text-sm font-bold text-white">Top root cause files</h3>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Ranked by hit count across completed investigations (workspace scope).
      </p>
      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {rows.map((row) => (
          <li key={row.path}>
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-300" title={row.path}>
                {row.path}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <TrendIcon trend={row.trend} />
                <span className="font-mono text-[11px] tabular-nums text-slate-400">
                  {row.hits}
                </span>
              </div>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.85]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500/80 to-violet-500/70"
                style={{ width: `${Math.min(100, (row.hits / maxHits) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
