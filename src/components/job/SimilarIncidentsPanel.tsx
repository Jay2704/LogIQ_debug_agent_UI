import { History } from "lucide-react";
import type { SimilarIncident } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SimilarIncidentsPanelProps {
  incidents: SimilarIncident[];
  className?: string;
}

export function SimilarIncidentsPanel({
  incidents,
  className,
}: SimilarIncidentsPanelProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-violet-500/15 bg-surface-975/90 p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/25">
          <History className="h-4 w-4 text-violet-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Similar incidents</h3>
          <p className="mt-1 text-xs text-slate-500">
            Historical cases with overlapping signals for cross-check during
            review.
          </p>
        </div>
      </div>
      {incidents.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-700/50 bg-surface-900/40 px-3 py-4 text-center text-sm text-slate-500">
          No indexed similar incidents for this pattern yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {incidents.map((si) => (
            <li
              key={si.id}
              className="rounded-xl border border-white/[0.06] bg-surface-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">{si.title}</p>
                <time
                  className="font-mono text-[10px] text-slate-500 tabular-nums"
                  dateTime={si.occurredAt}
                >
                  {formatDateTime(si.occurredAt)}
                </time>
              </div>
              <p className="mt-2 font-mono text-[11px] text-slate-500">{si.id}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {si.overlap}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
