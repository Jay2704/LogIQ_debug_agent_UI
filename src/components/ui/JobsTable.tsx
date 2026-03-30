import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Job } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
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
}

export function JobsTable({ jobs, emptyMessage }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-blue-500/20 bg-surface-900/50 px-6 py-12 text-center text-sm text-slate-500">
        {emptyMessage ?? "No jobs match the current filters."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-blue-500/[0.12] bg-gradient-to-b from-surface-850/70 via-surface-960 to-surface-975 shadow-card-premium">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-blue-500/10 bg-surface-975/95 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              <th className="px-4 py-3.5 font-semibold">Job ID</th>
              <th className="px-4 py-3.5 font-semibold">Anomaly ID</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Trigger</th>
              <th className="px-4 py-3.5 font-semibold">Created</th>
              <th className="px-4 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500/[0.06]">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="group transition-colors duration-150 hover:bg-blue-500/[0.07]"
              >
                <td className="px-4 py-3.5 font-mono text-xs text-slate-200 transition group-hover:text-white">
                  {job.id}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-violet-300/95">
                  {job.anomalyId}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3.5 text-slate-400">
                  {triggerLabels[job.trigger]}
                </td>
                <td className="px-4 py-3.5 text-slate-500 tabular-nums">
                  {formatDateTime(job.createdAt)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    to={`/jobs/${job.id}`}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-400",
                      "transition hover:bg-sky-500/15 hover:text-sky-300"
                    )}
                  >
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
