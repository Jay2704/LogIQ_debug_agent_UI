import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

interface RunDebugButtonProps {
  className?: string;
  to?: string;
  /** UI-only: hides navigation; use when role does not allow this shortcut. */
  disabled?: boolean;
  /** Shown when `disabled` (e.g. viewer role). */
  disabledTitle?: string;
}

export function RunDebugButton({
  className,
  to = "/jobs",
  disabled = false,
  disabledTitle = "Not available for your role (UI only — not a security guarantee).",
}: RunDebugButtonProps) {
  const content = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
    </>
  );

  if (disabled) {
    return (
      <span
        role="presentation"
        aria-disabled="true"
        title={disabledTitle}
        className={cn(
          "group relative inline-flex cursor-not-allowed items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 opacity-50",
          "text-sm font-semibold tracking-wide text-white",
          ctaButtonGradient,
          ctaGlowBlueOnly,
          "ring-1 ring-blue-400/35",
          className
        )}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5",
        "text-sm font-semibold tracking-wide text-white",
        ctaButtonGradient,
        ctaGlowBlueOnly,
        "transition-all duration-300",
        "ring-1 ring-blue-400/35",
        "hover:shadow-[0_0_0_1px_rgba(96,165,250,0.45),0_12px_48px_-6px_rgba(59,130,246,0.35),0_0_64px_-10px_rgba(96,165,250,0.22)]",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
        className
      )}
    >
      {content}
    </Link>
  );
}
