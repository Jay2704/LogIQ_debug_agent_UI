import { useState } from "react";
import type { GitHubIntegrationConnection } from "@/types";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/ui";
import { MaskedSecretInput } from "./MaskedSecretInput";

export interface GitHubFormValues {
  displayName: string;
  workspaceId: string;
  orgName: string;
  repoName: string;
  token: string;
  enabled: boolean;
}

interface GitHubConnectionFormProps {
  workspaceId: string;
  initial?: GitHubIntegrationConnection | null;
  disabled?: boolean;
  onSubmit: (values: GitHubFormValues) => Promise<void>;
  submitLabel?: string;
}

const fieldClass = cn(
  "mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
  ui.surfaceInput,
  ui.focusRing,
  "outline-none"
);

export function GitHubConnectionForm({
  workspaceId,
  initial = null,
  disabled = false,
  onSubmit,
  submitLabel = "Save connection",
}: GitHubConnectionFormProps) {
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [wsId, setWsId] = useState(initial?.workspaceId ?? workspaceId);
  const [orgName, setOrgName] = useState(initial?.orgName ?? "");
  const [repoName, setRepoName] = useState(initial?.repoName ?? "");
  const [token, setToken] = useState("");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!initial && !token.trim()) {
      setFormError("Personal access token is required for new connections.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        displayName,
        workspaceId: wsId,
        orgName,
        repoName,
        token,
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
        <label htmlFor="github-display-name" className="text-xs font-semibold text-slate-400">
          Display name
        </label>
        <input
          id="github-display-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={disabled || submitting}
          className={fieldClass}
          placeholder="Platform API repo"
        />
      </div>
      <div>
        <label htmlFor="github-workspace-id" className="text-xs font-semibold text-slate-400">
          Workspace ID
        </label>
        <input
          id="github-workspace-id"
          value={wsId}
          onChange={(e) => setWsId(e.target.value)}
          required
          disabled={disabled || submitting}
          className={cn(fieldClass, "font-mono text-xs")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="github-org" className="text-xs font-semibold text-slate-400">
            Organization
          </label>
          <input
            id="github-org"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            disabled={disabled || submitting}
            className={fieldClass}
            placeholder="logiq"
          />
        </div>
        <div>
          <label htmlFor="github-repo" className="text-xs font-semibold text-slate-400">
            Repository
          </label>
          <input
            id="github-repo"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
            disabled={disabled || submitting}
            className={fieldClass}
            placeholder="platform-api"
          />
        </div>
      </div>
      <MaskedSecretInput
        id="github-token"
        label="Token"
        maskedValue={initial?.secretMasked ?? null}
        hasSavedSecret={Boolean(initial?.hasSecret)}
        value={token}
        onChange={setToken}
        required={!initial}
        disabled={disabled || submitting}
        placeholder="ghp_…"
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
