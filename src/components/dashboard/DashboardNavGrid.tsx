import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MAIN_NAV_ITEMS, type MainNavItem } from "@/lib/mainNav";
import { cn } from "@/lib/utils";

interface DashboardNavGridProps {
  jobsCount?: number;
  /** Guest landing: cards route to login; no "Current" state */
  forPublicLanding?: boolean;
  /** Hide built-in "Navigate" heading when parent supplies a section title */
  hideIntro?: boolean;
}

export function DashboardNavGrid({
  jobsCount,
  forPublicLanding = false,
  hideIntro = false,
}: DashboardNavGridProps) {
  const { pathname } = useLocation();

  const resolveActive = (item: MainNavItem) => {
    if (forPublicLanding) return false;
    return item.end === true
      ? pathname === item.to
      : pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const cardTarget = (item: MainNavItem) =>
    forPublicLanding ? "/login" : item.to;

  return (
    <section className="relative overflow-hidden rounded-card border border-cyber/[0.12] bg-black/[0.88] p-5 shadow-card-premium sm:p-7">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-cyber/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-nexus/[0.05] blur-3xl" />
      <div className="relative">
        {!hideIntro ? (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyber/90">
              Workspace
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Navigate
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {forPublicLanding
                ? "Sign in to open each area of LogIQ — investigations, anomalies, utilities, and more."
                : "Jump to any area of LogIQ — same destinations as the sidebar, optimized for the home dashboard."}
            </p>
          </>
        ) : null}

        <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", !hideIntro && "mt-8")}>
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = resolveActive(item);
            const Icon = item.icon;
            const showJobsStat =
              !forPublicLanding && item.to === "/jobs" && typeof jobsCount === "number";
            const target = cardTarget(item);

            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-card ring-1 transition-colors duration-300",
                      isActive
                        ? "bg-cyber/[0.15] ring-cyber/[0.3]"
                        : "bg-black/[0.6] ring-cyber/[0.08] group-hover:bg-cyber/[0.1] group-hover:ring-cyber/[0.22]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-300",
                        isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-300"
                      )}
                      strokeWidth={1.75}
                    />
                  </div>
                  {isActive ? (
                    <span className="rounded border border-cyber/[0.3] bg-cyber/[0.1] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                      Active
                    </span>
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-cyber" />
                  )}
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold tracking-tight text-white">{item.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
                {showJobsStat ? (
                  <p className="mt-2.5 font-mono text-xs text-nexus/80">
                    {jobsCount} investigation{jobsCount === 1 ? "" : "s"} in workspace
                  </p>
                ) : null}
              </>
            );

            const cardClass = cn(
              "nexus-card-scanline group relative block overflow-hidden rounded-card border border-cyber/[0.08] bg-black/[0.85] p-4 text-left transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-cyber/[0.22] hover:shadow-glow-cyber",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60",
              isActive && "ring-1 ring-cyber/[0.3] border-cyber/[0.2]"
            );

            if (isActive) {
              return (
                <div key={item.to} className={cardClass} aria-current="page">
                  {inner}
                </div>
              );
            }

            return (
              <Link key={item.to} to={target} className={cardClass}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
