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
        "rounded-2xl border border-violet-500/20 bg-black/[0.94] p-6 shadow-card",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <History className="h-5 w-5 text-violet-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Similar incidents</h3>
          <p className="mt-1 text-sm text-slate-500">
            Historical cases with overlapping signals — cross-check during review.
          </p>
        </div>
      </div>
      {incidents.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-slate-700/50 bg-black/[0.82] px-4 py-6 text-center text-sm text-slate-500">
          No indexed similar incidents for this pattern yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {incidents.map((si) => (
            <li
              key={si.id}
              className="rounded-xl border border-white/[0.06] bg-black/[0.82] p-4 transition hover:border-violet-500/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg border border-white/[0.08] bg-black/[0.94] px-2.5 py-1 font-mono text-[11px] font-semibold text-sky-300/95">
                  {si.service}
                </span>
                <time
                  className="font-mono text-[11px] text-slate-500 tabular-nums"
                  dateTime={si.occurredAt}
                >
                  {formatDateTime(si.occurredAt)}
                </time>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-100">{si.title}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">{si.id}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {si.overlap}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
