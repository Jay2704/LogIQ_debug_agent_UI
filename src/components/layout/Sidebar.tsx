import { Link, NavLink } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileStack,
  LayoutDashboard,
  ListTodo,
  Settings2,
  Wrench,
} from "lucide-react";
import { USE_HTTP_API } from "@/api/config";
import { navActiveInsetShadow, navItemActiveGradient } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Jobs", icon: ListTodo, end: false },
  { to: "/anomalies", label: "Anomalies", icon: AlertTriangle, end: false },
  { to: "/insights", label: "Insights", icon: BarChart3, end: false },
  { to: "/reports", label: "Reports", icon: FileStack, end: false },
  { to: "/utilities", label: "Utilities", icon: Wrench, end: false },
  { to: "/settings", label: "Settings", icon: Settings2, end: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/[0.08] bg-surface-975/[0.92] shadow-[inset_-1px_0_0_rgba(59,130,246,0.05)] backdrop-blur-2xl md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/40 to-violet-600/35 ring-1 ring-white/15 shadow-glow-blue">
          <Activity className="h-5 w-5 text-sky-300" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            LogIQ
          </p>
          <p className="text-sm font-bold tracking-tight text-white">
            Debug Agent
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-2 py-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-all duration-200",
                ui.focusRing,
                isActive
                  ? cn(
                      navItemActiveGradient,
                      navActiveInsetShadow,
                      "text-white ring-1 ring-white/[0.08] backdrop-blur-md"
                    )
                  : "text-slate-400 hover:bg-blue-500/[0.08] hover:text-slate-100 active:scale-[0.99]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive ? "text-sky-300" : "text-slate-500"
                  )}
                  strokeWidth={2}
                />
                <span className={cn(isActive && "font-semibold")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/[0.08] p-4">
        <div className="rounded-xl border border-white/[0.06] bg-surface-900/55 p-3 shadow-inner backdrop-blur-sm">
          <p className="text-xs font-medium text-slate-400">Environment</p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            {USE_HTTP_API ? (
              <>
                <span className="text-emerald-400/90">live API</span>
                <span className="text-slate-600"> · </span>
                <span className="text-slate-500">origin from env</span>
              </>
            ) : (
              <>
                <span className="text-slate-500">mock</span>
                <span className="text-slate-600"> · </span>
                <span className="text-slate-500">no backend</span>
              </>
            )}
          </p>
          {import.meta.env.DEV ? (
            <Link
              to="/dev/integration-check"
              className="mt-2 block text-[11px] font-medium text-amber-400/85 transition hover:text-amber-300"
            >
              Dev: integration check
            </Link>
          ) : null}
          <Link
            to="/login"
            className="mt-3 block text-xs font-semibold text-sky-400/90 transition hover:text-sky-300"
          >
            Login (demo)
          </Link>
        </div>
      </div>
    </aside>
  );
}
