import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "@/api";
import { API_BASE_URL, USE_HTTP_API } from "@/api/config";
import type { CreateJobInput } from "@/types";

type BlockStatus = "idle" | "loading" | "success" | "error";

interface Block {
  status: BlockStatus;
  payload: string;
  response: string;
  error: string;
  /** Human-readable: OK on success, or HTTP code when parseable from client error */
  statusHint: string;
}

const empty: Block = {
  status: "idle",
  payload: "",
  response: "",
  error: "",
  statusHint: "—",
};

function formatResult(value: unknown): string {
  if (value === undefined) return "(undefined)";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function extractHttpStatusFromMessage(message: string): string | undefined {
  const m = message.match(/\[LogIQ API\][^\d]*(\d{3})\b/);
  return m?.[1];
}

async function runBlock(
  setBlock: Dispatch<SetStateAction<Block>>,
  payload: unknown,
  fn: () => Promise<unknown>
): Promise<void> {
  setBlock({
    status: "loading",
    payload: formatResult(payload),
    response: "",
    error: "",
    statusHint: "…",
  });
  try {
    const res = await fn();
    setBlock({
      status: "success",
      payload: formatResult(payload),
      response: formatResult(res),
      error: "",
      statusHint: USE_HTTP_API ? "OK (2xx)" : "OK (mock)",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const code = extractHttpStatusFromMessage(msg);
    setBlock({
      status: "error",
      payload: formatResult(payload),
      response: "",
      error: msg,
      statusHint: code ? `HTTP ${code}` : "Error",
    });
  }
}

function StatusBadge({ status }: { status: BlockStatus }) {
  const cls =
    status === "loading"
      ? "bg-amber-500/20 text-amber-200"
      : status === "success"
        ? "bg-emerald-500/20 text-emerald-200"
        : status === "error"
          ? "bg-red-500/20 text-red-200"
          : "bg-slate-700/50 text-slate-400";
  return (
    <span className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${cls}`}>
      {status}
    </span>
  );
}

function ResultPanels({ block }: { block: Block }) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
        <span className="font-bold uppercase text-slate-600">Last status</span>
        <span className="font-mono text-slate-400">{block.statusHint}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Request payload</p>
          <pre className="max-h-56 overflow-auto rounded border border-white/10 bg-black/40 p-2 text-[11px] leading-relaxed text-slate-300">
            {block.payload || "—"}
          </pre>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">Response JSON</p>
          <pre className="max-h-56 overflow-auto rounded border border-white/10 bg-black/40 p-2 text-[11px] leading-relaxed text-slate-300">
            {block.status === "loading" ? (
              <span className="text-slate-500">Loading…</span>
            ) : block.status === "error" ? (
              <span className="text-slate-600">—</span>
            ) : (
              block.response || "—"
            )}
          </pre>
        </div>
      </div>
      {block.status === "error" && block.error ? (
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase text-red-400/90">Error</p>
          <pre className="max-h-40 overflow-auto rounded border border-red-500/25 bg-red-950/30 p-2 text-[11px] leading-relaxed text-red-200/95">
            {block.error}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  subtitle,
  headerRight,
  children,
}: {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/[0.08] bg-black/[0.94] p-4 ring-1 ring-inset ring-white/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-bold text-white">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[10px] text-slate-600">{subtitle}</p>
          ) : null}
        </div>
        {headerRight}
      </div>
      {children}
    </section>
  );
}

/**
 * Internal-only integration surface. Route is registered only when `import.meta.env.DEV`.
 */
export function DevIntegrationCheck() {
  const [listJobs, setListJobs] = useState<Block>(empty);
  const [createJob, setCreateJob] = useState<Block>(empty);
  const [jobDetail, setJobDetail] = useState<Block>(empty);
  const [debugRun, setDebugRun] = useState<Block>(empty);
  const [rca, setRca] = useState<Block>(empty);
  const [explanation, setExplanation] = useState<Block>(empty);

  const [createForm, setCreateForm] = useState<CreateJobInput>({
    jobType: "debug_investigation",
    anomalyId: "integration_test_anomaly",
    runId: `run_${Date.now()}`,
    triggeredByUserId: "18c6e126-b6d4-517e-ab4c-6ffa1e2f8eeb",
    triggerSource: "manual",
  });
  const [jobIdInput, setJobIdInput] = useState("");
  const [anomalyForAgent, setAnomalyForAgent] = useState("anomaly_001");
  const [anomalyForRca, setAnomalyForRca] = useState("anomaly_001");
  const [jobIdForRca, setJobIdForRca] = useState("");
  const [anomalyForExplanation, setAnomalyForExplanation] = useState("anomaly_001");

  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16 font-mono text-xs text-slate-300">
      <div className="border-b border-white/10 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/90">
          Dev only
        </p>
        <h1 className="mt-1 text-lg font-bold text-white">Integration check</h1>
        <p className="mt-2 text-slate-500">
          Calls <code className="text-sky-400">api</code> from{" "}
          <code className="text-sky-400">@/api</code> — same transport as the app. Use with{" "}
          <strong className="text-slate-400">Live Backend</strong> topbar mode for real HTTP.
        </p>
        {!USE_HTTP_API ? (
          <div
            className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.08] px-3 py-2 text-[11px] text-amber-100/90"
            role="status"
          >
            <strong className="text-amber-200">Mock mode</strong> — requests hit in-memory
            fixtures, not your backend. Set env for HTTP + base URL, restart dev server, confirm
            topbar shows Live Backend.
          </div>
        ) : null}
        <dl className="mt-3 grid gap-1 text-[11px] text-slate-500 sm:grid-cols-2">
          <div>
            <dt className="inline text-slate-600">USE_HTTP_API:</dt>{" "}
            <dd className="inline text-slate-400">{String(USE_HTTP_API)}</dd>
          </div>
          <div>
            <dt className="inline text-slate-600">VITE_API_BASE_URL:</dt>{" "}
            <dd className="inline text-slate-400">
              {API_BASE_URL ? "set (value not shown)" : "unset"}
            </dd>
          </div>
          <div>
            <dt className="inline text-slate-600">Transport:</dt>{" "}
            <dd className="inline text-slate-400">
              {USE_HTTP_API ? "createHttpApi (fetch)" : "createMockApi"}
            </dd>
          </div>
        </dl>
        <Link
          to="/jobs"
          className="mt-4 inline-block text-sky-400 underline hover:text-sky-300"
        >
          ← Back to jobs
        </Link>
      </div>

      <Section
        title="GET /api/v1/jobs"
        subtitle="api.jobs.list()"
        headerRight={
          <div className="flex items-center gap-2">
            <StatusBadge status={listJobs.status} />
            <button
              type="button"
              disabled={listJobs.status === "loading"}
              onClick={() =>
                void runBlock(setListJobs, { method: "api.jobs.list()" }, () => api.jobs.list())
              }
              className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
            >
              Run
            </button>
          </div>
        }
      >
        <ResultPanels block={listJobs} />
      </Section>

      <Section
        title="POST /api/v1/jobs"
        subtitle="api.jobs.create(CreateJobInput)"
        headerRight={<StatusBadge status={createJob.status} />}
      >
        <div className="mt-3 w-full space-y-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["jobType", "jobType"],
                ["anomalyId", "anomalyId"],
                ["runId", "runId"],
                ["triggeredByUserId", "triggeredByUserId"],
                ["triggerSource", "triggerSource"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-[10px] text-slate-500">{label}</span>
                <input
                  value={createForm[key]}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="mt-0.5 w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={createJob.status === "loading"}
            onClick={() =>
              void runBlock(setCreateJob, createForm, () => api.jobs.create(createForm))
            }
            className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
          >
            Run
          </button>
          <ResultPanels block={createJob} />
        </div>
      </Section>

      <Section
        title="GET /api/v1/jobs/:jobId"
        subtitle="api.jobs.getDetailBundle(jobId)"
        headerRight={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={jobDetail.status} />
            <input
              value={jobIdInput}
              onChange={(e) => setJobIdInput(e.target.value)}
              placeholder="job_id"
              className="w-48 rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
            />
            <button
              type="button"
              disabled={jobDetail.status === "loading" || !jobIdInput.trim()}
              onClick={() =>
                void runBlock(
                  setJobDetail,
                  { method: "api.jobs.getDetailBundle", jobId: jobIdInput.trim() },
                  () => api.jobs.getDetailBundle(jobIdInput.trim())
                )
              }
              className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
            >
              Run
            </button>
          </div>
        }
      >
        <ResultPanels block={jobDetail} />
      </Section>

      <Section
        title="POST /api/v1/rca/run"
        subtitle="api.rca.run(anomaly_id)"
        headerRight={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={debugRun.status} />
            <input
              value={anomalyForAgent}
              onChange={(e) => setAnomalyForAgent(e.target.value)}
              placeholder="anomaly_id"
              className="w-56 rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
            />
            <button
              type="button"
              disabled={debugRun.status === "loading" || !anomalyForAgent.trim()}
              onClick={() =>
                void runBlock(
                  setDebugRun,
                  {
                    method: "api.rca.run",
                    anomaly_id: anomalyForAgent.trim(),
                  },
                  async () => {
                    await api.rca.run(anomalyForAgent.trim());
                    return { ok: true, message: "No JSON body (204 / empty)" };
                  }
                )
              }
              className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
            >
              Run
            </button>
          </div>
        }
      >
        <ResultPanels block={debugRun} />
      </Section>

      <Section
        title="GET /api/v1/rca/results/:anomalyId"
        subtitle="api.rca.getResultsByAnomalyId(anomalyId, jobId)"
        headerRight={<StatusBadge status={rca.status} />}
      >
        <div className="mt-3 w-full space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              value={anomalyForRca}
              onChange={(e) => setAnomalyForRca(e.target.value)}
              placeholder="anomaly_id"
              className="w-56 rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
            />
            <input
              value={jobIdForRca}
              onChange={(e) => setJobIdForRca(e.target.value)}
              placeholder="job_id (mapping)"
              className="w-56 rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
            />
            <button
              type="button"
              disabled={
                rca.status === "loading" ||
                !anomalyForRca.trim() ||
                !jobIdForRca.trim()
              }
              onClick={() =>
                void runBlock(
                  setRca,
                  {
                    method: "api.rca.getResultsByAnomalyId",
                    anomalyId: anomalyForRca.trim(),
                    jobId: jobIdForRca.trim(),
                  },
                  () =>
                    api.rca.getResultsByAnomalyId(
                      anomalyForRca.trim(),
                      jobIdForRca.trim()
                    )
                )
              }
              className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
            >
              Run
            </button>
          </div>
          <ResultPanels block={rca} />
        </div>
      </Section>

      <Section
        title="GET /api/v1/rca/explanation/:anomalyId"
        subtitle="api.rca.getExplanationByAnomalyId(anomalyId)"
        headerRight={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={explanation.status} />
            <input
              value={anomalyForExplanation}
              onChange={(e) => setAnomalyForExplanation(e.target.value)}
              placeholder="anomaly_id"
              className="w-56 rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px]"
            />
            <button
              type="button"
              disabled={explanation.status === "loading" || !anomalyForExplanation.trim()}
              onClick={() =>
                void runBlock(
                  setExplanation,
                  {
                    method: "api.rca.getExplanationByAnomalyId",
                    anomalyId: anomalyForExplanation.trim(),
                  },
                  () => api.rca.getExplanationByAnomalyId(anomalyForExplanation.trim())
                )
              }
              className="rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200 hover:bg-sky-500/20 disabled:opacity-50"
            >
              Run
            </button>
          </div>
        }
      >
        <ResultPanels block={explanation} />
      </Section>
    </div>
  );
}
