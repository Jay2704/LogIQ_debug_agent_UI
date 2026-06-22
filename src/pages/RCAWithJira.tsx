import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { MCP_UI_ENABLED } from "@/api/config";
import { DashboardHomeHero } from "@/components/landing/DashboardHomeHero";

export function RCAWithJira() {
  const location = useLocation();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const { anomalyId, service } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      anomalyId: params.get("anomaly_id"),
      service: params.get("service"),
    };
  }, [location.search]);

  const handleRunRca = async () => {
    if (!anomalyId) {
      setRunError("Missing anomaly_id in URL query params.");
      return;
    }
    setRunning(true);
    setRunError(null);
    try {
      await api.rca.run(anomalyId);
      navigate("/jobs");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setRunError(msg || "Failed to run RCA.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-10">
      {anomalyId ? (
      <div className="rounded-2xl border border-cyber/[0.12] bg-black/[0.88] p-4 text-sm text-slate-300 sm:p-5">
        <p>
          <span className="font-semibold text-slate-100">Anomaly:</span>{" "}
          <span className="font-mono">{anomalyId ?? "—"}</span>
        </p>
        <p className="mt-1">
          <span className="font-semibold text-slate-100">Service:</span>{" "}
          <span className="font-mono">{service ?? "—"}</span>
        </p>
        <button
          type="button"
          onClick={() => void handleRunRca()}
          disabled={!anomalyId || running}
          className="mt-4 inline-flex items-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:border-sky-400/55 hover:bg-sky-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Running RCA..." : "Run RCA"}
        </button>
        {runError ? (
          <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
            {runError}
          </p>
        ) : null}
      </div>
      ) : null}
      <div className="mt-6">
        <DashboardHomeHero
          showHero={false}
          showWorkflow
          enableMcpPreview={MCP_UI_ENABLED}
        />
      </div>
    </div>
  );
}
