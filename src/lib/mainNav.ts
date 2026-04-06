import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  FileStack,
  LayoutDashboard,
  ListTodo,
  Settings2,
  Wrench,
} from "lucide-react";

export interface MainNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  description: string;
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
    description: "Overview, live KPIs, and recent investigations",
  },
  {
    to: "/jobs",
    label: "Jobs",
    icon: ListTodo,
    description: "Create and manage investigations",
  },
  {
    to: "/anomalies",
    label: "Anomalies",
    icon: AlertTriangle,
    description: "Review detected issues and incident signals",
  },
  {
    to: "/insights",
    label: "Insights",
    icon: BarChart3,
    description: "Explore patterns, signals, and findings",
  },
  {
    to: "/reports",
    label: "Reports",
    icon: FileStack,
    description: "View generated summaries and incident reports",
  },
  {
    to: "/utilities",
    label: "Utilities",
    icon: Wrench,
    description: "Upload logs, search, split errors, summarize",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings2,
    description: "Manage preferences and environment settings",
  },
];
