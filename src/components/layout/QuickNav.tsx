import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/anomalies", label: "Anomalies" },
  { to: "/insights", label: "Insights" },
  { to: "/reports", label: "Reports" },
  { to: "/utilities", label: "Utilities" },
  { to: "/settings", label: "Settings" },
];

export function QuickNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-white/[0.08] bg-surface-975/95 px-4 py-2 shadow-inner backdrop-blur-md md:hidden">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            cn(
              "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold outline-none transition-all duration-200",
              ui.focusRing,
              "ring-offset-2 ring-offset-surface-975",
              isActive
                ? "bg-nav-active text-white shadow-insetNav ring-1 ring-white/[0.08] backdrop-blur-sm"
                : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}
