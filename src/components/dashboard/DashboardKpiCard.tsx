import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "ice" | "amber" | "emerald" | "rose";

const accents: Record<
  Accent,
  {
    border: string;
    glow: string;
    icon: string;
    bar: string;
    badge: string;
    scanline: string;
  }
> = {
  ice: {
    border: "border-cyber/[0.2]",
    glow: "shadow-glow-cyber",
    icon: "bg-cyber/[0.1] ring-cyber/[0.2] text-cyan-300",
    bar: "from-cyber to-cyan-500",
    badge: "text-cyber",
    scanline: "rgba(34,211,238,0.03)",
  },
  amber: {
    border: "border-amber-500/[0.22]",
    glow: "shadow-glow-amber",
    icon: "bg-amber-500/[0.1] ring-amber-500/[0.2] text-amber-300",
    bar: "from-amber-400 to-orange-500",
    badge: "text-amber-400",
    scanline: "rgba(245,158,11,0.03)",
  },
  emerald: {
    border: "border-nexus/[0.2]",
    glow: "shadow-glow-nexus",
    icon: "bg-nexus/[0.1] ring-nexus/[0.2] text-nexus",
    bar: "from-nexus to-emerald-500",
    badge: "text-nexus",
    scanline: "rgba(52,211,153,0.03)",
  },
  rose: {
    border: "border-rose-500/[0.18]",
    glow: "shadow-glow-rose",
    icon: "bg-rose-500/[0.1] ring-rose-500/[0.2] text-rose-300",
    bar: "from-rose-400 to-red-500",
    badge: "text-rose-400",
    scanline: "rgba(244,63,94,0.03)",
  },
};

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent: Accent;
  index?: number;
}

export function DashboardKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  index = 0,
}: DashboardKpiCardProps) {
  const a = accents[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "nexus-card-scanline relative overflow-hidden rounded-card border bg-black/[0.88] p-5",
        a.border,
        a.glow
      )}
    >
      {/* Scanline texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${a.scanline} 3px, ${a.scanline} 4px)`,
        }}
        aria-hidden
      />

      {/* Top accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 h-[2px] w-full rounded-t-card bg-gradient-to-r",
          a.bar
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("font-mono text-[10px] font-bold uppercase tracking-[0.18em]", a.badge)}>
            {title}
          </p>
          <p className="mt-2.5 font-display text-3xl font-bold tabular-nums tracking-tight text-white">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-card ring-1",
            a.icon
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </motion.div>
  );
}
