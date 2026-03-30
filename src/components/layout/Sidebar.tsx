import { NavLink } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileStack,
  LayoutDashboard,
  ListTodo,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Jobs", icon: ListTodo, end: false },
  { to: "/anomalies", label: "Anomalies", icon: AlertTriangle, end: false },
  { to: "/insights", label: "Insights", icon: BarChart3, end: false },
  { to: "/reports", label: "Reports", icon: FileStack, end: false },
  { to: "/settings", label: "Settings", icon: Settings2, end: false },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/[0.06] bg-surface-950/95 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-600/30 ring-1 ring-white/10">
          <Activity className="h-5 w-5 text-blue-300" strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            LogIQ
          </p>
          <p className="text-sm font-semibold text-slate-100">
            Debug Agent
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-blue-500/15 text-blue-300 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-xl bg-surface-900/80 p-3 ring-1 ring-white/[0.05]">
          <p className="text-xs font-medium text-slate-300">Environment</p>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            mock · no backend
          </p>
        </div>
      </div>
    </aside>
  );
}
