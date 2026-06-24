import type { IntegrationValidationStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<IntegrationValidationStatus, string> = {
  valid: "Valid",
  invalid: "Invalid",
  unknown: "Not validated",
  pending: "Validating…",
};

const STATUS_CLASS: Record<IntegrationValidationStatus, string> = {
  valid: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
  invalid: "border-red-500/35 bg-red-500/10 text-red-200",
  unknown: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  pending: "border-amber-500/35 bg-amber-500/10 text-amber-200",
};

interface ValidationStatusBadgeProps {
  status: IntegrationValidationStatus;
}

export function ValidationStatusBadge({ status }: ValidationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        STATUS_CLASS[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
