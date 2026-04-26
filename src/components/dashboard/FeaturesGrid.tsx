import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  BadgeInfo,
  FileStack,
  LayoutDashboard,
  ListTodo,
  Settings2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: "Dashboard",
    description: "Overview, live KPIs, and quick workspace access.",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    description: "Create and manage investigations.",
    to: "/jobs",
    icon: ListTodo,
  },
  {
    title: "Anomalies",
    description: "Review detected issues and incident signals.",
    to: "/anomalies",
    icon: AlertTriangle,
  },
  {
    title: "Insights",
    description: "Explore recurring patterns and findings.",
    to: "/insights",
    icon: BarChart3,
  },
  {
    title: "Reports",
    description: "View generated summaries and outcomes.",
    to: "/reports",
    icon: FileStack,
  },
  {
    title: "Utilities",
    description: "Use helper tools for log workflows.",
    to: "/utilities",
    icon: Wrench,
  },
  {
    title: "Settings",
    description: "Manage environment and UI preferences.",
    to: "/settings",
    icon: Settings2,
  },
  {
    title: "About Us",
    description: "Read what LogIQ does and how it helps teams.",
    to: "/about",
    icon: BadgeInfo,
  },
];

export function FeaturesGrid() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-cyber/[0.12] bg-black/[0.9] p-5 shadow-card-premium sm:p-6">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/90">
          Quick Navigation
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Features
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FEATURE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.to)}
              className={cn(
                "group rounded-xl border border-cyber/[0.12] bg-black/[0.88] p-4 text-left transition-all duration-200",
                "hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-glow-cyber",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60"
              )}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyber/[0.2] bg-cyber/[0.08]">
                <Icon className="h-5 w-5 text-cyan-300" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
