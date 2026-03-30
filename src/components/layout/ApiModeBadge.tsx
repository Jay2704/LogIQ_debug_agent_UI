import { USE_HTTP_API } from "@/api/config";
import { cn } from "@/lib/utils";

/**
 * Developer-facing indicator: HTTP client vs mock fixtures. Does not show URLs.
 */
export function ApiModeBadge() {
  const live = USE_HTTP_API;
  return (
    <span
      className={cn(
        "inline-flex max-w-[100%] shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px]",
        live
          ? "border-emerald-500/25 bg-emerald-500/[0.07] text-emerald-400/85"
          : "border-white/[0.08] bg-surface-900/70 text-slate-500"
      )}
      title={
        live
          ? "API client mode: requests go to the configured backend origin."
          : "Fixture mode: no live API client — data is mocked in the app."
      }
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          live ? "bg-emerald-400/85 shadow-[0_0_8px_rgba(52,211,153,0.45)]" : "bg-slate-500"
        )}
        aria-hidden
      />
      {live ? "Live Backend" : "Mock Mode"}
    </span>
  );
}
