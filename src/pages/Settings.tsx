import { Bell, Plug, Server, Shield } from "lucide-react";

const sections = [
  {
    title: "Workspace",
    description:
      "Future: default region, retention for traces and logs, and job concurrency limits.",
    icon: Server,
  },
  {
    title: "Integrations",
    description:
      "Future: connect APM, log stores, ticketing, and chat to route anomalies and reports.",
    icon: Plug,
  },
  {
    title: "Notifications",
    description:
      "Future: alert routing for failed jobs, SLA breaches on RCA latency, and weekly digests.",
    icon: Bell,
  },
  {
    title: "Access",
    description:
      "Future: SSO, role-based views for on-call vs read-only, and audit export.",
    icon: Shield,
  },
];

export function Settings() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configuration surface reserved for backend integration. No controls are
          wired in this mock UI.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <div
            key={s.title}
            className="rounded-card border border-white/[0.06] bg-surface-900/50 p-5 shadow-card"
          >
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-800 text-slate-400">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{s.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
