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
    <section className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-surface-900/90 via-[#0b1222] to-surface-975 p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_24px_64px_-32px_rgba(0,0,0,0.55)] sm:p-8">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="relative">
        {!hideIntro ? (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
              Workspace
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
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
                      "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-colors duration-300",
                      isActive
                        ? "bg-sky-500/20 ring-sky-500/40"
                        : "bg-white/[0.06] ring-white/[0.08] group-hover:bg-sky-500/15 group-hover:ring-sky-500/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors duration-300",
                        isActive ? "text-sky-200" : "text-slate-400 group-hover:text-sky-200"
                      )}
                      strokeWidth={2}
                    />
                  </div>
                  {isActive ? (
                    <span className="rounded-lg border border-sky-500/35 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-200/95">
                      Current
                    </span>
                  ) : (
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-sky-400" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{item.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                {showJobsStat ? (
                  <p className="mt-3 font-mono text-xs text-emerald-400/90">
                    {jobsCount} investigation{jobsCount === 1 ? "" : "s"} in workspace
                  </p>
                ) : null}
              </>
            );

            const cardClass = cn(
              "group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-975/70 p-5 text-left shadow-inner transition duration-300",
              "hover:-translate-y-1 hover:border-sky-500/25 hover:shadow-[0_0_40px_-12px_rgba(56,189,248,0.35)]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60",
              isActive && "ring-2 ring-sky-500/35"
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
