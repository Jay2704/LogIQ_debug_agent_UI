import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, UserRound } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";

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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-blue-500/[0.1] bg-surface-975/75 px-6 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <form onSubmit={handleSearch} className="relative max-w-xl flex-1">
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search job ID, anomaly ID, or service…"
          aria-label="Global search"
        />
      </form>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
          aria-label="Theme"
        >
          <Moon className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="ml-1 flex items-center gap-2 rounded-xl border border-blue-500/15 bg-surface-900/70 px-2 py-1.5 pl-2 pr-3 shadow-inner transition hover:border-blue-500/25"
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
