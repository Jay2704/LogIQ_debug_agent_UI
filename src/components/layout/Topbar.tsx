import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { LogIQIconMark } from "@/components/branding/LogIQLogos";
import { ApiModeBadge } from "@/components/layout/ApiModeBadge";
import { formatUserContextLine, userDisplayName } from "@/lib/userDisplay";
import { cn } from "@/lib/utils";

export function Topbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, clearCurrentUser } = useCurrentUser();
  /** Sidebar is hidden on home — show compact icon in top bar for brand recall */
  const showCompactBrand = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-white/[0.08] bg-surface-975/80 px-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:gap-3 sm:px-6",
        showCompactBrand ? "h-14 sm:h-16" : "h-16"
      )}
    >
      {showCompactBrand ? (
        <Link
          to="/"
          className="mr-auto flex shrink-0 items-center rounded-lg outline-none ring-offset-2 ring-offset-surface-975 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-500/50"
          aria-label="LogIQ home"
        >
          <LogIQIconMark className="h-10 w-10 sm:h-11 sm:w-11" />
        </Link>
      ) : null}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
        {pathname !== "/" ? <ApiModeBadge /> : null}
        {user ? (
          <button
            type="button"
            onClick={() => {
              clearCurrentUser();
              navigate("/login");
            }}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200 sm:inline-flex"
            title="Clears prototype session only — not a secure server logout."
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            Sign out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-sky-400 transition hover:bg-white/[0.04] hover:text-sky-300 sm:px-3.5"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 sm:px-3.5"
            >
              Sign up
            </Link>
          </>
        )}
        <div
          className={cn(
            "flex max-w-[min(100vw-12rem,15rem)] items-center gap-2 rounded-lg border border-white/[0.08] bg-surface-900/60 px-2 py-1.5 pl-2 pr-3 shadow-inner transition-all duration-200",
            user ? "hover:border-white/[0.12] hover:bg-white/[0.04]" : undefined
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-600 to-slate-800 ring-1 ring-white/10">
            <UserRound className="h-4 w-4 text-slate-200" />
          </span>
          <span className="min-w-0 flex-1 text-left text-xs leading-tight sm:text-[13px]">
            {user ? (
              <>
                <span className="block truncate font-semibold text-slate-100">
                  {userDisplayName(user) || user.email}
                </span>
                <span className="truncate text-slate-500">
                  {formatUserContextLine(user)}
                </span>
              </>
            ) : (
              <>
                <span className="block font-semibold text-slate-100">Guest</span>
                <span className="text-slate-500">Not logged in</span>
              </>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
