import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface UtilityRunButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function UtilityRunButton({
  onClick,
  loading,
  disabled,
  children = "Run",
  className,
}: UtilityRunButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold",
        "bg-sky-500/15 text-sky-100 ring-1 ring-sky-500/35 transition",
        "hover:bg-sky-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60",
        "disabled:pointer-events-none disabled:opacity-45",
        className
      )}
    >
      <Play
        className={cn(
          "h-4 w-4 text-sky-200",
          loading && "animate-pulse"
        )}
        strokeWidth={2}
        fill="currentColor"
      />
      {loading ? "Running…" : children}
    </button>
  );
}
