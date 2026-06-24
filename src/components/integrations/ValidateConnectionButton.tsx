import { Loader2, RefreshCw } from "lucide-react";
import type { ValidateIntegrationConnectionResult } from "@/types";
import { cn } from "@/lib/utils";

interface ValidateConnectionButtonProps {
  connectionId: string;
  validating?: boolean;
  disabled?: boolean;
  onValidate: (connectionId: string) => Promise<ValidateIntegrationConnectionResult>;
  onValidated?: (result: ValidateIntegrationConnectionResult) => void;
  className?: string;
}

export function ValidateConnectionButton({
  connectionId,
  validating = false,
  disabled = false,
  onValidate,
  onValidated,
  className,
}: ValidateConnectionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || validating || !connectionId}
      onClick={() => {
        void onValidate(connectionId).then((result) => onValidated?.(result));
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/45 hover:bg-sky-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {validating ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
      )}
      Validate
    </button>
  );
}
