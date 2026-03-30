import type { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const jobStatusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  queued: {
    label: "Queued",
    className:
      "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/25",
  },
  running: {
    label: "Running",
    className:
      "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/30",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-400 ring-1 ring-inset ring-red-500/30",
  },
};

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = jobStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}

type AnomalySeverity = "critical" | "high" | "medium" | "low";

const severityConfig: Record<
  AnomalySeverity,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-500/15 text-red-400 ring-red-500/35",
  },
  high: {
    label: "High",
    className: "bg-orange-500/15 text-orange-400 ring-orange-500/35",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/15 text-amber-400 ring-amber-500/35",
  },
  low: {
    label: "Low",
    className: "bg-slate-500/15 text-slate-400 ring-slate-500/30",
  },
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: AnomalySeverity;
  className?: string;
}) {
  const cfg = severityConfig[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}

type AnomalyStatus = "open" | "investigating" | "mitigated" | "resolved";

const anomalyStatusConfig: Record<
  AnomalyStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-red-500/10 text-red-400 ring-red-500/25",
  },
  investigating: {
    label: "Investigating",
    className: "bg-amber-500/10 text-amber-400 ring-amber-500/25",
  },
  mitigated: {
    label: "Mitigated",
    className: "bg-blue-500/10 text-blue-400 ring-blue-500/25",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
  },
};

export function AnomalyStatusBadge({
  status,
  className,
}: {
  status: AnomalyStatus;
  className?: string;
}) {
  const cfg = anomalyStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}

type ReportStatus = "ready" | "generating" | "failed";

const reportStatusConfig: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  },
  generating: {
    label: "Generating",
    className: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-400 ring-red-500/30",
  },
};

export function ReportStatusBadge({
  status,
  className,
}: {
  status: ReportStatus;
  className?: string;
}) {
  const cfg = reportStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
