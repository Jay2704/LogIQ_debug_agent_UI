import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, UserRound } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";

export function Topbar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("dbg_")) {
      navigate(`/jobs/${trimmed}`);
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
      <div className="ml-auto flex items-center gap-0.5">
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
        <button
          type="button"
          className={cn(
            "ml-1 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-surface-900/60 px-2 py-1.5 pl-2 pr-3 shadow-inner transition-all duration-200",
            "hover:border-white/[0.12] hover:bg-white/[0.04]",
            ui.focusRing,
            "ring-offset-2 ring-offset-surface-975"
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 ring-1 ring-white/10">
            <UserRound className="h-4 w-4 text-slate-200" />
          </span>
          <span className="hidden text-left text-xs lg:block">
            <span className="block font-semibold text-slate-100">Platform</span>
            <span className="text-slate-500">SRE</span>
          </span>
        </button>
      </div>
    </header>
  );
}
