import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/jobs", label: "Jobs" },
  { to: "/anomalies", label: "Anomalies" },
  { to: "/insights", label: "Insights" },
  { to: "/reports", label: "Reports" },
  { to: "/settings", label: "Settings" },
];

export function QuickNav() {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] bg-surface-950/90 px-4 py-2 md:hidden">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            cn(
              "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium",
              isActive
                ? "bg-blue-500/20 text-blue-300"
                : "text-slate-500 hover:text-slate-300"
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}
