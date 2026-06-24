import { Bell, Plug, Server, Shield, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/auth";
import { useRoleUiCapabilities } from "@/lib/roleUiCapabilities";
import {
  formatUserContextLine,
  formatUserRoleLabel,
  userDisplayName,
} from "@/lib/userDisplay";

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
      "Connect Jira and GitHub for investigation context, or monitor MCP provider health.",
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
  const { user } = useCurrentUser();
  const roleCaps = useRoleUiCapabilities();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="ui-page-title">Settings</h1>
        <p className="ui-page-desc">
          Configuration surface reserved for backend integration. Session below reflects the
          prototype current-user layer only — not production authentication.
        </p>
      </div>

      <div className="ui-card p-5 shadow-card">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.7] text-slate-400">
            <UserRound className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-200">
              Current user (prototype)
            </h2>
            {user ? (
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[8rem_1fr] sm:gap-x-4">
                <dt className="text-slate-500">User ID</dt>
                <dd className="font-mono text-slate-300">{user.userId}</dd>
                <dt className="text-slate-500">Name</dt>
                <dd className="text-slate-200">
                  {userDisplayName(user) || "—"}
                </dd>
                <dt className="text-slate-500">Email</dt>
                <dd className="truncate text-slate-200">{user.email}</dd>
                <dt className="text-slate-500">Role</dt>
                <dd className="text-slate-200">{formatUserRoleLabel(user.role)}</dd>
                <dt className="text-slate-500">Team</dt>
                <dd className="text-slate-200">{user.team || "—"}</dd>
                <dt className="text-slate-500">Summary</dt>
                <dd className="text-slate-400">{formatUserContextLine(user)}</dd>
                <dt className="text-slate-500">UI capabilities</dt>
                <dd className="text-xs leading-relaxed text-slate-500">
                  Frontend hints only — not authorization. Create job:{" "}
                  <span className="text-slate-400">
                    {roleCaps.canCreateJob ? "yes" : "no"}
                  </span>
                  . Run pipeline / Run Debug shortcut:{" "}
                  <span className="text-slate-400">
                    {roleCaps.canRunInvestigationPipeline ? "yes" : "no"}
                  </span>
                  .
                </dd>
              </dl>
            ) : (
              <div className="mt-2 space-y-2 text-sm text-slate-500">
                <p>
                  No user selected.{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Login
                  </Link>{" "}
                  to bind this workspace to a user record and see role-based UI hints.
                </p>
                <p className="text-xs text-slate-500">
                  Guests cannot create jobs or run investigations from the UI; viewers can
                  browse but not run pipelines (prototype only — not server authorization).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="ui-card p-5 shadow-card">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.7] text-slate-400">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-200">{s.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{s.description}</p>
                {s.title === "Integrations" ? (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <Link
                      to="/settings/integrations"
                      className="font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      Manage Jira & GitHub →
                    </Link>
                    <Link
                      to="/settings/mcp-connections"
                      className="font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      MCP Connection Center →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
