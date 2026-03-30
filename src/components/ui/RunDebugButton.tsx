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
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5",
        "text-sm font-semibold tracking-wide text-white",
        "bg-cta-primary shadow-glow-cta transition duration-300",
        "ring-1 ring-sky-400/30 ring-offset-2 ring-offset-surface-960",
        "hover:bg-cta-primary-hover hover:shadow-[0_0_0_1px_rgba(56,189,248,0.45),0_12px_48px_-6px_rgba(37,99,235,0.55),0_0_72px_-8px_rgba(139,92,246,0.3)]",
        "hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      <Play
        className="relative h-4 w-4 fill-white text-white drop-shadow-sm"
        strokeWidth={0}
        aria-hidden
      />
      <span className="relative">Run Debug Agent</span>
    </Link>
  );
}
