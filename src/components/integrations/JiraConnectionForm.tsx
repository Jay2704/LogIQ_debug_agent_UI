import { useState } from "react";
import type { JiraIntegrationConnection } from "@/types";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";
import { MaskedSecretInput } from "./MaskedSecretInput";

export interface JiraFormValues {
  displayName: string;
  workspaceId: string;
  baseUrl: string;
  projectKey: string;
  email: string;
  apiToken: string;
  enabled: boolean;
}

interface JiraConnectionFormProps {
  workspaceId: string;
  initial?: JiraIntegrationConnection | null;
  disabled?: boolean;
  onSubmit: (values: JiraFormValues) => Promise<void>;
  submitLabel?: string;
}

const fieldClass = cn(
  "mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
  ui.surfaceInput,
  ui.focusRing,
  "outline-none"
);

export function JiraConnectionForm({
  workspaceId,
  initial = null,
  disabled = false,
  onSubmit,
  submitLabel = "Save connection",
}: JiraConnectionFormProps) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [wsId, setWsId] = useState(initial?.workspaceId ?? workspaceId);
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? "");
  const [projectKey, setProjectKey] = useState(initial?.projectKey ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [apiToken, setApiToken] = useState("");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!initial && !apiToken.trim()) {
      setFormError("API token is required for new connections.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        displayName,
        workspaceId: wsId,
        baseUrl,
        projectKey,
        email,
        apiToken,
        enabled,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label htmlFor="jira-display-name" className="text-xs font-semibold text-slate-400">
          Display name
        </label>
        <input
          id="jira-display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={disabled || submitting}
          className={fieldClass}
          placeholder="Production Jira"
        />
      </div>
      <div>
        <label htmlFor="jira-workspace-id" className="text-xs font-semibold text-slate-400">
          Workspace ID
        </label>
        <input
          id="jira-workspace-id"
          value={wsId}
          onChange={(e) => setWsId(e.target.value)}
          required
          disabled={disabled || submitting}
          className={cn(fieldClass, "font-mono text-xs")}
        />
      </div>
      <div>
        <label htmlFor="jira-base-url" className="text-xs font-semibold text-slate-400">
          Base URL
        </label>
        <input
          id="jira-base-url"
          type="url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          required
          disabled={disabled || submitting}
          className={fieldClass}
          placeholder="https://your-org.atlassian.net"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="jira-project-key" className="text-xs font-semibold text-slate-400">
            Project key
          </label>
          <input
            id="jira-project-key"
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value)}
            required
            disabled={disabled || submitting}
            className={cn(fieldClass, "font-mono uppercase")}
            placeholder="LOG"
          />
        </div>
        <div>
          <label htmlFor="jira-email" className="text-xs font-semibold text-slate-400">
            Email
          </label>
          <input
            id="jira-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={disabled || submitting}
            className={fieldClass}
            placeholder="oncall@company.com"
          />
        </div>
      </div>
      <MaskedSecretInput
        id="jira-api-token"
        label="API token"
        maskedValue={initial?.secretMasked ?? null}
        hasSavedSecret={Boolean(initial?.hasSecret)}
        value={apiToken}
        onChange={setApiToken}
        required={!initial}
        disabled={disabled || submitting}
        placeholder="jira_…"
      />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          disabled={disabled || submitting}
          className="h-4 w-4 rounded border-white/20 bg-black/40 text-sky-500 focus:ring-sky-500/40"
        />
        Enabled for investigations
      </label>
      {formError ? (
        <p className="rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-100/90">
          {formError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || submitting}
        className="inline-flex w-full items-center justify-center rounded-xl border border-sky-500/35 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
