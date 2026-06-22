import type { McpConnectionStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  McpConnectionStatus,
  { label: string; className: string }
> = {
  healthy: {
    label: "Healthy",
    className: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  },
  unhealthy: {
    label: "Configured · Unhealthy",
    className: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  },
  not_configured: {
    label: "Not configured",
    className: "border-slate-500/35 bg-slate-500/15 text-slate-300",
  },
  failed: {
    label: "Failed",
    className: "border-red-500/40 bg-red-500/15 text-red-200",
  },
};

interface ConnectionStatusBadgeProps {
  status: McpConnectionStatus;
  className?: string;
}

export function ConnectionStatusBadge({ status, className }: ConnectionStatusBadgeProps) {
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
