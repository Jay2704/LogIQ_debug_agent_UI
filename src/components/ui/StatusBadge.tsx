import type { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const jobStatusConfig: Record<
  JobStatus,
  { label: string; className: string }
> = {
  queued: {
    label: "Queued",
    className:
      "bg-slate-600/25 text-slate-200 ring-1 ring-inset ring-slate-400/35",
  },
  running: {
    label: "Running",
    className:
      "bg-amber-500/20 text-amber-300 ring-1 ring-inset ring-amber-400/45 shadow-[0_0_12px_-4px_rgba(245,158,11,0.35)]",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/40 shadow-[0_0_12px_-4px_rgba(16,185,129,0.25)]",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-400/45 shadow-[0_0_12px_-4px_rgba(239,68,68,0.3)]",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
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
    className:
      "bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-400/45",
  },
  high: {
    label: "High",
    className:
      "bg-orange-500/20 text-orange-300 ring-1 ring-inset ring-orange-400/40",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-500/20 text-amber-300 ring-1 ring-inset ring-amber-400/40",
  },
  low: {
    label: "Low",
    className:
      "bg-slate-600/25 text-slate-300 ring-1 ring-inset ring-slate-400/35",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset",
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
    className:
      "bg-red-500/18 text-red-300 ring-red-400/40",
  },
  investigating: {
    label: "Investigating",
    className:
      "bg-amber-500/18 text-amber-300 ring-amber-400/40",
  },
  mitigated: {
    label: "Mitigated",
    className:
      "bg-blue-500/18 text-sky-300 ring-blue-400/40",
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-emerald-500/18 text-emerald-300 ring-emerald-400/40",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset",
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
    className:
      "bg-emerald-500/20 text-emerald-300 ring-emerald-400/40",
  },
  generating: {
    label: "Generating",
    className:
      "bg-amber-500/20 text-amber-300 ring-amber-400/45",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/20 text-red-300 ring-red-400/45",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
