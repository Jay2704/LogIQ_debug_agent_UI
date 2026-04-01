import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Moon, UserRound } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { ApiModeBadge } from "@/components/layout/ApiModeBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { formatUserContextLine } from "@/lib/userDisplay";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function Topbar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user, clearCurrentUser } = useCurrentUser();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("dbg_")) {
      navigate(`/jobs/${encodeURIComponent(trimmed)}`);
      return;
    }
    if (trimmed.startsWith("anomaly_")) {
      navigate(`/anomalies`);
      return;
    }
    navigate(`/jobs`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.08] bg-surface-975/80 px-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-6">
      <form onSubmit={handleSearch} className="relative max-w-xl flex-1">
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search job ID, anomaly ID, or service…"
          aria-label="Global search"
        />
      </form>
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <ApiModeBadge />
        {user ? (
          <>
            <button
              type="button"
              onClick={() => {
                clearCurrentUser();
                navigate("/login");
              }}
              className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200 sm:inline-flex"
              title="Clears prototype session only — not a secure server logout."
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-2 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-white/[0.04] hover:text-sky-300 sm:px-2.5"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 sm:px-2.5"
            >
              Sign up
            </Link>
          </>
        )}
        <button
          type="button"
          className={cn(ui.iconBtn, ui.focusRing, "ring-offset-2 ring-offset-surface-975")}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className={cn(ui.iconBtn, ui.focusRing, "ring-offset-2 ring-offset-surface-975")}
          aria-label="Theme"
        >
          <Moon className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <div
          className={cn(
            "ml-1 flex max-w-[min(100vw-12rem,14rem)] items-center gap-2 rounded-xl border border-white/[0.08] bg-surface-900/60 px-2 py-1.5 pl-2 pr-3 shadow-inner transition-all duration-200",
            user
              ? "hover:border-white/[0.12] hover:bg-white/[0.04]"
              : undefined
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 ring-1 ring-white/10">
            <UserRound className="h-4 w-4 text-slate-200" />
          </span>
          <span className="min-w-0 flex-1 text-left text-xs">
            {user ? (
              <>
                <span className="block truncate font-semibold text-slate-100">
                  {user.name || user.email}
                </span>
                <span className="truncate text-slate-500">
                  {formatUserContextLine(user)}
                </span>
              </>
            ) : (
              <>
                <span className="block font-semibold text-slate-100">Guest</span>
                <span className="text-slate-500">Not signed in</span>
              </>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
