import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "ui-empty-shell flex flex-col items-center justify-center px-8 py-14 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/[0.82] text-slate-500 shadow-inner ring-1 ring-white/[0.04]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-6 text-base font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
