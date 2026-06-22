import { History } from "lucide-react";
import type { RcaFeedbackEntry } from "@/types";
import { cn, formatDateTime } from "@/lib/utils";

const actionLabels: Record<RcaFeedbackEntry["action"], string> = {
  confirm: "Confirmed",
  reject: "Rejected",
  override: "Overridden",
};

const actionTone: Record<RcaFeedbackEntry["action"], string> = {
  confirm: "border-emerald-500/35 bg-emerald-500/15 text-emerald-200",
  reject: "border-red-500/35 bg-red-500/15 text-red-200",
  override: "border-amber-500/35 bg-amber-500/15 text-amber-200",
};

interface FeedbackHistoryProps {
  history: RcaFeedbackEntry[];
  loading?: boolean;
  className?: string;
}

export function FeedbackHistory({
  history,
  loading = false,
  className,
}: FeedbackHistoryProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-black/[0.94] p-5 shadow-card sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30">
          <History className="h-5 w-5 text-violet-400" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Historical feedback</h3>
          <p className="mt-1 text-sm text-slate-500">
            Prior reviewer actions on RCA outcomes for this investigation.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate-500">Loading feedback history…</p>
      ) : history.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-slate-700/50 bg-black/[0.82] px-4 py-6 text-center text-sm text-slate-500">
          No feedback submitted yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-white/[0.06] bg-black/[0.82] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                    actionTone[entry.action]
                  )}
                >
                  {actionLabels[entry.action]}
                </span>
                <time
                  className="font-mono text-[11px] text-slate-500 tabular-nums"
                  dateTime={entry.submittedAt}
                >
                  {formatDateTime(entry.submittedAt)}
                </time>
              </div>
              {entry.submittedBy ? (
                <p className="mt-2 font-mono text-[11px] text-slate-500">
                  {entry.submittedBy}
                </p>
              ) : null}
              {entry.comment ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{entry.comment}</p>
              ) : (
                <p className="mt-2 text-xs italic text-slate-600">No comment provided.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
