import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/api/config";
import { getApi } from "@/api/client";
import { joinApiUrl } from "@/api/http/apiUrl";
import {
  AnomalyStatusBadge,
  SeverityBadge,
} from "@/components/ui/StatusBadge";
import { PageLoading } from "@/components/ui/PageLoading";
import { formatDateTime } from "@/lib/utils";
import type { Anomaly } from "@/types";

type UiSeverity = "low" | "medium" | "high" | "critical";
type UiStatus = "open" | "investigating" | "mitigated" | "resolved";

interface UiAnomaly {
  id: string;
  service: string;
  severity: UiSeverity;
  status: UiStatus;
  detectedAt: string;
  summary: string;
  signalType: string;
}

interface CreateAnomalyFormState {
  anomaly_id: string;
  service: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
}

const EMPTY_FORM: CreateAnomalyFormState = {
  anomaly_id: "",
  service: "",
  severity: "HIGH",
  summary: "",
};

function normalizeSeverity(value: unknown): UiSeverity {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "low" || v === "medium" || v === "high" || v === "critical") return v;
  return "high";
}

function normalizeStatus(value: unknown): UiStatus {
  const v = String(value ?? "").trim().toLowerCase();
  if (v === "open" || v === "investigating" || v === "mitigated" || v === "resolved") return v;
  return "open";
}

function fromDomainAnomaly(a: Anomaly): UiAnomaly {
  return {
    id: a.id,
    service: a.service,
    severity: normalizeSeverity(a.severity),
    status: normalizeStatus(a.status),
    detectedAt: a.detectedAt,
    summary: a.summary,
    signalType: a.signalType,
  };
}

export function Anomalies() {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState<UiAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateAnomalyFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunRCA = (anomaly: { id: string; service: string }) => {
    navigate(
      `/rca?anomaly_id=${encodeURIComponent(anomaly.id)}&service=${encodeURIComponent(
        anomaly.service
      )}`
    );
  };

  const fetchAnomalies = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await getApi().anomalies.list();
      setAnomalies(rows.map(fromDomainAnomaly));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg || "Could not load anomalies.");
      setAnomalies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnomalies();
  }, []);

  const handleCreateAnomaly = async () => {
    const anomalyId = form.anomaly_id.trim();
    const service = form.service.trim();
    const summary = form.summary.trim();
    if (!anomalyId || !service || !summary) {
      setFormError("Please complete anomaly_id, service, and summary.");
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL is not configured.");
      }
      const url = joinApiUrl(API_BASE_URL, "/api/v1/anomalies");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anomaly_id: anomalyId,
          service,
          severity: form.severity,
          summary,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(body || `Failed to create anomaly (${res.status})`);
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setToastMessage("Anomaly created");
      window.setTimeout(() => setToastMessage(null), 2500);
      await fetchAnomalies();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setFormError(msg || "Could not create anomaly.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <PageLoading message="Loading anomalies…" />;
  }

  if (loadError) {
    return (
      <div className="rounded-card border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
        {loadError}
      </div>
    );
  }

  const sorted = [...anomalies].sort(
    (a, b) =>
      new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );

  return (
    <div className="space-y-6">
      {toastMessage ? (
        <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          {toastMessage}
        </div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="ui-page-title">Anomalies</h1>
          <p className="ui-page-desc">
            Severity-ranked signals with investigation status. Trigger RCA directly
            from each anomaly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center rounded-lg border border-sky-500/35 bg-sky-500/10 px-3.5 py-2 text-sm font-semibold text-sky-300 transition hover:border-sky-400/55 hover:bg-sky-500/20 hover:text-white"
        >
          + Create Anomaly
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((a) => (
          <div
            key={a.id}
            className="group rounded-card border border-cyber/[0.12] bg-black/[0.88] p-5 shadow-card-premium transition hover:border-cyber/[0.25]"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={a.severity} />
                <AnomalyStatusBadge status={a.status} />
              </div>
              <span className="text-xs text-slate-500 tabular-nums">
                {formatDateTime(a.detectedAt)}
              </span>
            </div>
            <p className="mt-3 font-mono text-xs text-violet-300/90">{a.id}</p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {a.service}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {a.summary}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <span className="text-xs text-slate-500">{a.signalType}</span>
              <button
                type="button"
                onClick={() => handleRunRCA(a)}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-xs font-semibold text-sky-300 transition hover:border-sky-400/55 hover:bg-sky-500/20 hover:text-white"
              >
                Run RCA
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-cyber/[0.2] bg-black/[0.95] p-5 shadow-card-premium">
            <h2 className="text-lg font-semibold text-white">Create Anomaly</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                anomaly_id
                <input
                  value={form.anomaly_id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, anomaly_id: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/60"
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                service
                <input
                  value={form.service}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, service: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/60"
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                severity
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      severity: e.target.value as CreateAnomalyFormState["severity"],
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/60"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                summary
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-white/[0.12] bg-black/[0.82] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400/60"
                />
              </label>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              {formError ? (
                <p className="mr-auto rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200">
                  {formError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setShowModal(false);
                }}
                className="rounded-lg border border-white/[0.14] px-3 py-2 text-sm text-slate-300 transition hover:border-white/[0.25] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleCreateAnomaly()}
                disabled={creating}
                className="rounded-lg border border-sky-500/35 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-300 transition hover:border-sky-400/55 hover:bg-sky-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
