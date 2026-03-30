import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackTone = "success" | "error" | "warning" | "info";

const toneStyles: Record<
  FeedbackTone,
  {
    border: string;
    bg: string;
    text: string;
    icon: typeof CheckCircle2;
    iconColor: string;
  }
> = {
  success: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/[0.08]",
    text: "text-emerald-100/95",
    icon: CheckCircle2,
    iconColor: "text-emerald-400/90",
  },
  error: {
    border: "border-red-500/25",
    bg: "bg-red-500/[0.08]",
    text: "text-red-200/95",
    icon: XCircle,
    iconColor: "text-red-400/90",
  },
  warning: {
    border: "border-amber-500/25",
    bg: "bg-amber-500/[0.06]",
    text: "text-amber-100/90",
    icon: AlertTriangle,
    iconColor: "text-amber-400/90",
  },
  info: {
    border: "border-sky-500/25",
    bg: "bg-sky-500/[0.06]",
    text: "text-sky-100/90",
    icon: Info,
    iconColor: "text-sky-400/90",
  },
};

interface FeedbackNoticeProps {
  tone: FeedbackTone;
  title?: string;
  children: ReactNode;
  /** Optional dismiss control (e.g. toast-style) */
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
  role?: "status" | "alert";
}

export function FeedbackNotice({
  tone,
  title,
  children,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  role,
}: FeedbackNoticeProps) {
  const t = toneStyles[tone];
  const Icon = t.icon;
  const resolvedRole =
    role ?? (tone === "error" ? "alert" : "status");

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-inner",
        t.border,
        t.bg,
        className
      )}
      role={resolvedRole}
    >
      <Icon
        className={cn("mt-0.5 h-5 w-5 shrink-0", t.iconColor)}
        strokeWidth={1.75}
        aria-hidden
      />
      <div className={cn("min-w-0 flex-1", t.text)}>
        {title ? (
          <p className="font-semibold text-white/95">{title}</p>
        ) : null}
        <div className={cn(title && "mt-1", "leading-relaxed opacity-95")}>
          {children}
        </div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "shrink-0 rounded-lg p-1 transition hover:bg-white/10",
            tone === "success" && "text-emerald-300/80 hover:text-white",
            tone === "error" && "text-red-300/80 hover:text-white",
            tone === "warning" && "text-amber-300/80 hover:text-white",
            tone === "info" && "text-sky-300/80 hover:text-white"
          )}
          aria-label={dismissLabel}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
