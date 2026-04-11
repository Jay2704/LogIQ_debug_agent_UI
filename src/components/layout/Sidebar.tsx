import { Link, NavLink } from "react-router-dom";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { USE_HTTP_API } from "@/api/config";
import { MAIN_NAV_ITEMS } from "@/lib/mainNav";
import { navActiveInsetShadow, navItemActiveGradient } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const navGroups = [
  {
    label: "Workspace",
    items: MAIN_NAV_ITEMS.filter((i) =>
      ["/", "/jobs", "/anomalies", "/insights", "/reports"].includes(i.to)
    ),
  },
  {
    label: "Tools",
    items: MAIN_NAV_ITEMS.filter((i) => ["/utilities"].includes(i.to)),
  },
  {
    label: "Info",
    items: MAIN_NAV_ITEMS.filter((i) =>
      ["/about", "/faq", "/settings"].includes(i.to)
    ),
  },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col border-r border-cyber/[0.08] bg-surface-975/[0.95] backdrop-blur-2xl md:flex">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34,211,238,0.008) 3px, rgba(34,211,238,0.008) 4px)",
        }}
        aria-hidden
      />

      {/* Logo */}
      <div className="relative flex min-h-[4.5rem] items-center border-b border-cyber/[0.08] px-4 py-3">
        <Link
          to="/"
          className="flex min-w-0 items-center outline-none ring-offset-2 ring-offset-surface-975 transition hover:opacity-90 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-500/50"
        >
          <LogIQFullLogo className="max-h-14 max-w-[200px] object-contain object-left" />
        </Link>

        {/* Status dot */}
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={cn(
              "relative flex h-2 w-2",
              USE_HTTP_API ? "text-nexus" : "text-slate-600"
            )}
          >
            {USE_HTTP_API && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nexus/60 opacity-75" />
            )}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                USE_HTTP_API ? "bg-nexus" : "bg-slate-700"
              )}
            />
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-2 py-4">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium outline-none transition-all duration-200",
                      ui.focusRing,
                      isActive
                        ? cn(
                            navItemActiveGradient,
                            navActiveInsetShadow,
                            "text-cyan-300 ring-1 ring-cyber/[0.12]"
                          )
                        : "text-slate-500 hover:bg-cyber/[0.06] hover:text-slate-200"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left accent bar */}
                      <span
                        className={cn(
                          "h-4 w-0.5 shrink-0 rounded-full transition-all duration-200",
                          isActive ? "bg-cyber" : "bg-transparent group-hover:bg-cyber/30"
                        )}
                      />
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-200",
                          isActive ? "text-cyber" : "text-slate-600 group-hover:text-slate-300"
                        )}
                        strokeWidth={1.75}
                      />
                      <span className={cn("font-medium", isActive && "font-semibold")}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-cyber/[0.06] p-3">
        <div className="rounded-card border border-cyber/[0.08] bg-surface-950/80 p-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              ENV
            </span>
            <span
              className={cn(
                "ml-auto rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                USE_HTTP_API
                  ? "bg-nexus/10 text-nexus"
                  : "bg-slate-800/80 text-slate-500"
              )}
            >
              {USE_HTTP_API ? "LIVE" : "MOCK"}
            </span>
          </div>
          {import.meta.env.DEV ? (
            <Link
              to="/dev/integration-check"
              className="mt-2 block text-[11px] text-amber-400/80 transition hover:text-amber-300"
            >
              › dev: integration check
            </Link>
          ) : null}
          <Link
            to="/login"
            className="mt-2 block text-[11px] text-cyber/70 transition hover:text-cyan-300"
          >
            › Login (demo)
          </Link>
        </div>
      </div>
    </aside>
  );
}
