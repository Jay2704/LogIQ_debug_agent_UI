import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  BadgeInfo,
  CircleHelp,
  ClipboardCheck,
  FileStack,
  GitBranchPlus,
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
    to: "/evaluation/rca",
    label: "RCA Evaluation",
    icon: ClipboardCheck,
    description: "Review RCA accuracy, feedback trends, and confidence calibration",
  },
  {
    to: "/rca-jira",
    label: "RCA with JIRA",
    icon: GitBranchPlus,
    description: "Fetch ticket, upload logs, run RCA, and review history",
  },
  {
    to: "/utilities",
    label: "Utilities",
    icon: Wrench,
    description: "Upload logs, search, split errors, summarize",
  },
  {
    to: "/about",
    label: "About Us",
    icon: BadgeInfo,
    description: "What LogIQ is, how it works, and how we help teams debug",
  },
  {
    to: "/faq",
    label: "FAQs",
    icon: CircleHelp,
    description: "Common questions about the product and investigation workflow",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings2,
    description: "Manage preferences and environment settings",
  },
];
