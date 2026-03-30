import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "ice" | "amber" | "emerald" | "rose";

const accents: Record<
  Accent,
  { border: string; glow: string; icon: string; bar: string }
> = {
  ice: {
    border: "border-cyan-500/25",
    glow: "shadow-[0_0_60px_-20px_rgba(34,211,238,0.35)]",
    icon: "bg-gradient-to-br from-cyan-500/25 to-blue-600/20 text-cyan-300 ring-cyan-400/30",
    bar: "from-cyan-500 to-blue-500",
  },
  amber: {
    border: "border-amber-500/30",
    glow: "shadow-[0_0_50px_-18px_rgba(245,158,11,0.4)]",
    icon: "bg-gradient-to-br from-amber-500/25 to-orange-600/15 text-amber-300 ring-amber-400/35",
    bar: "from-amber-400 to-orange-500",
  },
  emerald: {
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_50px_-18px_rgba(16,185,129,0.35)]",
    icon: "bg-gradient-to-br from-emerald-500/25 to-teal-700/20 text-emerald-300 ring-emerald-400/30",
    bar: "from-emerald-400 to-teal-500",
  },
  rose: {
    border: "border-rose-500/25",
    glow: "shadow-[0_0_50px_-18px_rgba(244,63,94,0.3)]",
    icon: "bg-gradient-to-br from-rose-500/20 to-red-900/20 text-rose-300 ring-rose-400/25",
    bar: "from-rose-400 to-red-500",
  },
};

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent: Accent;
}

export function DashboardKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: DashboardKpiCardProps) {
  const a = accents[accent];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border bg-gradient-to-br p-5",
        "from-surface-850/95 via-surface-960 to-surface-975",
        a.border,
        a.glow,
        "ring-1 ring-inset ring-white/[0.04]"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-card bg-gradient-to-b opacity-90",
          a.bar
        )}
      />
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/[0.04] to-transparent blur-2xl" />
      <div className="relative flex items-start justify-between gap-3 pl-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-white">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
            a.icon
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
