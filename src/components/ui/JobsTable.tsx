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
      <p className="rounded-card border border-dashed border-white/[0.08] bg-surface-900/40 px-6 py-12 text-center text-sm text-slate-500">
        {emptyMessage ?? "No jobs match the current filters."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-white/[0.06] bg-surface-900/50 shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-surface-850/50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Job ID</th>
              <th className="px-4 py-3 font-medium">Anomaly ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Trigger</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="transition hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-300">
                  {job.id}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-violet-300/90">
                  {job.anomalyId}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {triggerLabels[job.trigger]}
                </td>
                <td className="px-4 py-3 text-slate-500 tabular-nums">
                  {formatDateTime(job.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/jobs/${job.id}`}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-400",
                      "transition hover:bg-blue-500/10 hover:text-blue-300"
                    )}
                  >
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
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
