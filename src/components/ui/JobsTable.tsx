import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Cpu } from "lucide-react";
import type { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { getJobRouteId } from "@/lib/jobRoute";
import { cn } from "@/lib/utils";

const triggerLabels: Record<Job["trigger"], string> = {
  alert: "Alert",
  manual: "Manual",
  scheduled: "Scheduled",
  api: "API",
  webhook: "Webhook",
};

interface JobsTableProps {
  jobs: Job[];
  emptyMessage?: string;
  /** Shown below the table inside the same card (e.g. load more) */
  footer?: ReactNode;
}

export function JobsTable({ jobs, emptyMessage, footer }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <p className="ui-empty-shell px-6 py-12 text-center text-sm text-slate-500">
        {emptyMessage ?? "No jobs match the current filters."}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "ui-table-shell shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-28px_rgba(0,0,0,0.55)]"
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-black/[0.96] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <th scope="col" className="px-5 py-3.5 pl-6 font-semibold">
                Job ID
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Service
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Anomaly
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Trigger
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Created
              </th>
              <th scope="col" className="px-5 py-3.5 pr-6 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={getJobRouteId(job)}
                className={cn(
                  "group border-b border-blue-500/[0.05] transition-colors duration-150",
                  "hover:bg-gradient-to-r hover:from-sky-500/[0.06] hover:via-blue-500/[0.04] hover:to-transparent",
                  "hover:shadow-[inset_3px_0_0_0_rgba(56,189,248,0.45)]"
                )}
              >
                <td className="px-5 py-3.5 pl-6 align-middle">
                  <span className="font-mono text-[13px] font-medium text-slate-100 transition group-hover:text-white">
                    {getJobRouteId(job)}
                  </span>
                  {job.userSummary ? (
                    <span className="mt-0.5 block text-xs font-medium text-slate-400">
                      {job.userSummary}
                    </span>
                  ) : null}
                </td>
                <td className="max-w-[200px] px-4 py-3.5 align-middle">
                  <span
                    className="flex items-center gap-1.5 truncate text-[13px] text-slate-400"
                    title={job.service ?? "—"}
                  >
                    <Cpu
                      className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-sky-500/80"
                      strokeWidth={2}
                    />
                    <span className="truncate font-medium text-slate-300 group-hover:text-slate-200">
                      {job.service ?? "—"}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <span className="font-mono text-[12px] text-violet-300/95">
                    {job.anomalyId ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <StatusBadge status={job.status} variant="workflow" />
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <span className="inline-flex items-center rounded-md border border-white/[0.06] bg-black/[0.94] px-2 py-0.5 text-[12px] font-medium text-slate-400 group-hover:border-blue-500/20 group-hover:text-slate-300">
                    {triggerLabels[job.trigger]}
                  </span>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <time
                    className="tabular-nums text-[13px] text-slate-500 group-hover:text-slate-400"
                    dateTime={job.createdAt}
                  >
                    {formatDateTime(job.createdAt)}
                  </time>
                </td>
                <td className="px-5 py-3.5 pr-6 text-right align-middle">
                  <Link
                    to={`/jobs/${encodeURIComponent(getJobRouteId(job))}`}
                    className={cn(
                      "inline-flex items-center justify-center gap-1 rounded-lg border border-sky-500/25",
                      "bg-sky-500/[0.08] px-3 py-1.5 text-xs font-semibold text-sky-300",
                      "shadow-sm transition duration-150",
                      "hover:border-sky-400/50 hover:bg-sky-500/18 hover:text-white",
                      "hover:shadow-[0_0_20px_-6px_rgba(56,189,248,0.45)]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500/60",
                      "active:scale-[0.98]"
                    )}
                  >
                    View Result
                    <ChevronRight
                      className="h-3.5 w-3.5 opacity-80 transition group-hover:translate-x-0.5"
                      strokeWidth={2.5}
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
