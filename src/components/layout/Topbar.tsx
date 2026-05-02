import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, Terminal, UserRound } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { LogIQFullLogo } from "@/components/branding/LogIQLogos";
import { ApiModeBadge } from "@/components/layout/ApiModeBadge";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavHeader, NavTab } from "@/components/ui/nav-header";
import { formatUserContextLine, userDisplayName } from "@/lib/userDisplay";
import { cn } from "@/lib/utils";

const APP_NAV_TABS: NavTab[] = [
  { label: "Dashboard", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Anomalies", href: "/anomalies" },
  { label: "Insights", href: "/insights" },
  { label: "Reports", href: "/reports" },
];

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const { user, clearCurrentUser } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 bg-transparent px-4 backdrop-blur-xl sm:gap-3 sm:px-6">
      {/* Left: sidebar toggle + brand */}
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyber/[0.18] text-slate-300 transition hover:bg-cyber/[0.08] hover:text-white"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Link
        to="/"
        className="flex shrink-0 items-center rounded-lg outline-none ring-offset-2 ring-offset-surface-975 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
        aria-label="LogIQ home"
      >
        <LogIQFullLogo className="h-8 w-auto sm:h-9" />
      </Link>

      <div className="hidden flex-1 items-center justify-center lg:flex">
        <NavHeader tabs={APP_NAV_TABS} />
      </div>

      {/* Right: controls + user section */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none">
        <ApiModeBadge />

        {/* Theme toggle */}
        <ThemeToggle />

        <div className="h-5 w-px bg-cyber/[0.1]" aria-hidden />

        {user ? (
          <button
            type="button"
            onClick={() => {
              clearCurrentUser();
              navigate("/login");
            }}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-cyber/[0.06] hover:text-slate-200 sm:inline-flex"
            title="Clears prototype session only — not a secure server logout."
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            Sign out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-cyber/80 transition hover:text-cyan-300 sm:px-3.5"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-300 sm:px-3.5"
            >
              Sign up
            </Link>
          </>
        )}

        {/* User pill */}
        <div
          className={cn(
            "flex max-w-[min(100vw-10rem,14rem)] items-center gap-2 rounded-card border border-cyber/[0.1] bg-black/[0.7] px-2 py-1.5 pl-2 pr-3 transition-all duration-200",
            user ? "hover:border-cyber/[0.2] hover:bg-black/[0.85]" : undefined
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyber/20 to-cyber/5 ring-1 ring-cyber/20">
            {user ? (
              <UserRound className="h-3.5 w-3.5 text-cyber" />
            ) : (
              <Terminal className="h-3.5 w-3.5 text-slate-500" />
            )}
          </span>
          <span className="min-w-0 flex-1 text-left text-xs leading-tight sm:text-[13px]">
            {user ? (
              <>
                <span className="block truncate font-semibold text-slate-100">
                  {userDisplayName(user) || user.email}
                </span>
                <span className="truncate font-mono text-[10px] text-slate-500">
                  {formatUserContextLine(user)}
                </span>
              </>
            ) : (
              <>
                <span className="block font-semibold text-slate-400">Guest</span>
                <span className="font-mono text-[10px] text-slate-500">not authenticated</span>
              </>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
