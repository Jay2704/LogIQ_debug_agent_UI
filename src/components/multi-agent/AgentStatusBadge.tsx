import type { AgentRunStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AgentRunStatus,
  { label: string; className: string }
> = {
  idle: {
    label: "Idle",
    className: "border-slate-500/35 bg-slate-500/15 text-slate-300",
  },
  running: {
    label: "Running",
    className: "border-sky-500/40 bg-sky-500/15 text-sky-200",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  },
  failed: {
    label: "Failed",
    className: "border-red-500/40 bg-red-500/15 text-red-200",
  },
};

interface AgentStatusBadgeProps {
  status: AgentRunStatus;
  className?: string;
}

export function AgentStatusBadge({ status, className }: AgentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
