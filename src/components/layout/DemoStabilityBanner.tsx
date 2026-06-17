import { useEffect, useState } from "react";
import { WifiOff, Database } from "lucide-react";
import { USE_MOCK_API } from "@/api/config";
import { FeedbackNotice } from "@/components/ui/FeedbackNotice";

/**
 * Conference/demo helpers: offline notice + mock-mode reminder (no UI redesign).
 */
export function DemoStabilityBanner() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <div className="space-y-2">
      {!online ? (
        <FeedbackNotice tone="warning" title="You appear to be offline">
          Core demo flows use built-in mock data, so you can keep exploring. Live API
          features will resume when your connection returns.
        </FeedbackNotice>
      ) : null}
      {USE_MOCK_API ? (
        <FeedbackNotice
          tone="info"
          title="Demo mode"
          className="hidden sm:flex"
        >
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            Running with sample data — no backend required for this conference build.
          </span>
        </FeedbackNotice>
      ) : null}
      {!online ? (
        <p className="flex items-center gap-1.5 px-1 text-[10px] font-medium uppercase tracking-wider text-amber-400/80 sm:hidden">
          <WifiOff className="h-3 w-3" aria-hidden />
          Offline — mock data available
        </p>
      ) : null}
    </div>
  );
}
