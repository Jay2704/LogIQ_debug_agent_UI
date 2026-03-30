import type { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const jobStatusConfig: Record<
  JobStatus,
  {
    label: string;
    hint: string;
    className: string;
    dot: string;
    workflowClass: string;
  }
> = {
  queued: {
    label: "Queued",
    hint: "Waiting in pipeline",
    className:
      "bg-slate-600/25 text-slate-200 ring-1 ring-inset ring-slate-400/35",
    dot: "bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.5)]",
    workflowClass:
      "bg-slate-600/20 text-slate-100 ring-1 ring-inset ring-slate-400/30",
  },
  running: {
    label: "Running",
    hint: "RCA & evidence in progress",
    className:
      "bg-amber-500/20 text-amber-300 ring-1 ring-inset ring-amber-400/45 shadow-[0_0_12px_-4px_rgba(245,158,11,0.35)]",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
    workflowClass:
      "bg-amber-500/[0.18] text-amber-200 ring-1 ring-inset ring-amber-400/40",
  },
  completed: {
    label: "Completed",
    hint: "Investigation finished",
    className:
      "bg-emerald-500/20 text-emerald-300 ring-1 ring-inset ring-emerald-400/40 shadow-[0_0_12px_-4px_rgba(16,185,129,0.25)]",
    dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.45)]",
    workflowClass:
      "bg-emerald-500/[0.18] text-emerald-200 ring-1 ring-inset ring-emerald-400/35",
  },
  failed: {
    label: "Failed",
    hint: "Needs attention or retry",
    className:
      "bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-400/45 shadow-[0_0_12px_-4px_rgba(239,68,68,0.3)]",
    dot: "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]",
    workflowClass:
      "bg-red-500/[0.18] text-red-200 ring-1 ring-inset ring-red-400/40",
  },
};

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
  /** Table / ops view: dot + tighter pill + title with pipeline hint */
  variant?: "default" | "workflow";
}

export function StatusBadge({
  status,
  className,
  variant = "default",
}: StatusBadgeProps) {
  const cfg = jobStatusConfig[status];
  if (variant === "workflow") {
    return (
      <span
        title={cfg.hint}
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums tracking-wide transition-colors duration-150",
          cfg.workflowClass,
          className
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            cfg.dot,
            status === "running" && "animate-pulse"
          )}
          aria-hidden
        />
        <span className="truncate">{cfg.label}</span>
      </span>
    );
  }
  return (
    <span
      title={cfg.hint}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors duration-150",
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
