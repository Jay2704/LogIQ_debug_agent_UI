import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RunDebugButtonProps {
  className?: string;
  to?: string;
}

export function RunDebugButton({
  className,
  to = "/jobs",
}: RunDebugButtonProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-blue transition hover:from-blue-500 hover:to-blue-400",
        className
      )}
    >
      <Play className="h-4 w-4 fill-current" />
      Run Debug Agent
    </Link>
  );
}
