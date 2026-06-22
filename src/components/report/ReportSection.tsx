import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ReportSection({ title, children, className }: ReportSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-black/[0.88] p-5 shadow-card sm:p-6",
        className
      )}
    >
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
