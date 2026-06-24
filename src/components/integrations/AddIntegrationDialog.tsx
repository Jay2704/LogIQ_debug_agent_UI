import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import type {
  CreateIntegrationConnectionInput,
  IntegrationConnection,
  IntegrationProvider,
  UpdateIntegrationConnectionInput,
  ValidateIntegrationConnectionResult,
} from "@/types";
import { cn } from "@/lib/utils";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { GitHubConnectionForm } from "./GitHubConnectionForm";
import { JiraConnectionForm } from "./JiraConnectionForm";
import { ValidateConnectionButton } from "./ValidateConnectionButton";
import { ValidationStatusBadge } from "./ValidationStatusBadge";

type DialogStep = "choose" | "form";

interface AddIntegrationDialogProps {
  isOpen: boolean;
  workspaceId: string;
  editing?: IntegrationConnection | null;
  saving?: boolean;
  validatingId?: string | null;
  onClose: () => void;
  onCreate: (payload: CreateIntegrationConnectionInput) => Promise<IntegrationConnection>;
  onUpdate: (
    id: string,
    payload: UpdateIntegrationConnectionInput
  ) => Promise<IntegrationConnection>;
  onValidate: (id: string) => Promise<ValidateIntegrationConnectionResult>;
}

const PROVIDERS: { id: IntegrationProvider; label: string; description: string }[] = [
  {
    id: "jira",
    label: "Jira",
    description: "Link tickets and project context for RCA intake.",
  },
  {
    id: "github",
    label: "GitHub",
    description: "Attach repository context and commits to investigations.",
  },
];

export function AddIntegrationDialog({
  isOpen,
  workspaceId,
  editing = null,
  saving = false,
  validatingId = null,
  onClose,
  onCreate,
  onUpdate,
  onValidate,
}: AddIntegrationDialogProps) {
  const [step, setStep] = useState<DialogStep>("choose");
  const [provider, setProvider] = useState<IntegrationProvider | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidateIntegrationConnectionResult | null>(
    null
  );
  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setStep("form");
      setProvider(editing.provider);
      setSavedId(editing.id);
      setValidation(null);
    } else {
      setStep("choose");
      setProvider(null);
      setSavedId(null);
      setValidation(null);
    }
    setDialogError(null);
  }, [isOpen, editing]);

  if (!isOpen) return null;

  const title = editing
    ? `Edit ${editing.provider === "jira" ? "Jira" : "GitHub"} connection`
    : step === "choose"
      ? "Add integration"
      : `Connect ${provider === "jira" ? "Jira" : "GitHub"}`;

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="integration-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        disabled={saving}
        onClick={handleClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.1] bg-black/[0.96] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500/90">
              Integrations
            </p>
            <h2 id="integration-dialog-title" className="mt-1 text-xl font-bold text-white">
              {title}
            </h2>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "choose" && !editing ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-slate-400">
              Choose a provider to connect. You can validate credentials before investigations use
              them.
            </p>
            {PROVIDERS.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => {
                  setProvider(row.id);
                  setStep("form");
                }}
                className="flex w-full flex-col rounded-xl border border-white/[0.08] bg-black/[0.55] px-4 py-3 text-left transition hover:border-sky-500/35 hover:bg-sky-500/[0.06]"
              >
                <span className="text-sm font-semibold text-white">{row.label}</span>
                <span className="mt-1 text-xs text-slate-500">{row.description}</span>
              </button>
            ))}
          </div>
        ) : null}

        {step === "form" && provider === "jira" ? (
          <div className="mt-6" key={editing?.id ?? "jira-new"}>
            <JiraConnectionForm
              workspaceId={workspaceId}
              initial={editing?.provider === "jira" ? editing : null}
              disabled={saving}
              submitLabel={editing ? "Save changes" : "Save connection"}
              onSubmit={async (values) => {
                setDialogError(null);
                try {
                  let connection: IntegrationConnection;
                  if (editing?.provider === "jira") {
                    const payload: UpdateIntegrationConnectionInput = {
                      displayName: values.displayName,
                      workspaceId: values.workspaceId,
                      baseUrl: values.baseUrl,
                      projectKey: values.projectKey,
                      email: values.email,
                      enabled: values.enabled,
                    };
                    if (values.apiToken.trim()) {
                      (payload as import("@/types").UpdateJiraConnectionInput).apiToken =
                        values.apiToken;
                    }
                    connection = await onUpdate(editing.id, payload);
                  } else {
                    connection = await onCreate({
                      provider: "jira",
                      displayName: values.displayName,
                      workspaceId: values.workspaceId,
                      baseUrl: values.baseUrl,
                      projectKey: values.projectKey,
                      email: values.email,
                      apiToken: values.apiToken,
                      enabled: values.enabled,
                    });
                  }
                  setSavedId(connection.id);
                } catch (e) {
                  setDialogError(e instanceof Error ? e.message : String(e));
                  throw e;
                }
              }}
            />
          </div>
        ) : null}

        {step === "form" && provider === "github" ? (
          <div className="mt-6" key={editing?.id ?? "github-new"}>
            <GitHubConnectionForm
              workspaceId={workspaceId}
              initial={editing?.provider === "github" ? editing : null}
              disabled={saving}
              submitLabel={editing ? "Save changes" : "Save connection"}
              onSubmit={async (values) => {
                setDialogError(null);
                try {
                  let connection: IntegrationConnection;
                  if (editing?.provider === "github") {
                    const payload: UpdateIntegrationConnectionInput = {
                      displayName: values.displayName,
                      workspaceId: values.workspaceId,
                      orgName: values.orgName,
                      repoName: values.repoName,
                      enabled: values.enabled,
                    };
                    if (values.token.trim()) {
                      (payload as import("@/types").UpdateGitHubConnectionInput).token =
                        values.token;
                    }
                    connection = await onUpdate(editing.id, payload);
                  } else {
                    connection = await onCreate({
                      provider: "github",
                      displayName: values.displayName,
                      workspaceId: values.workspaceId,
                      orgName: values.orgName,
                      repoName: values.repoName,
                      token: values.token,
                      enabled: values.enabled,
                    });
                  }
                  setSavedId(connection.id);
                } catch (e) {
                  setDialogError(e instanceof Error ? e.message : String(e));
                  throw e;
                }
              }}
            />
          </div>
        ) : null}

        {savedId ? (
          <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/[0.55] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-200">Validate connection</p>
              {validation ? (
                <ValidationStatusBadge status={validation.validationStatus} />
              ) : null}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Run a live credential check before enabling this integration for RCA runs.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ValidateConnectionButton
                connectionId={savedId}
                validating={validatingId === savedId}
                disabled={saving}
                onValidate={onValidate}
                onValidated={setValidation}
              />
              {validation?.validationStatus === "valid" ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white ring-1 ring-blue-400/35",
                    ctaButtonGradient,
                    ctaGlowBlueOnly
                  )}
                >
                  Done
                </button>
              ) : null}
            </div>
            {validation?.validationError ? (
              <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-xs text-red-100/90">
                {validation.validationError}
              </p>
            ) : null}
          </div>
        ) : null}

        {dialogError ? (
          <p className="mt-4 rounded-lg border border-red-500/25 bg-red-500/[0.08] px-3 py-2 text-sm text-red-100/90">
            {dialogError}
          </p>
        ) : null}

        {saving ? (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </p>
        ) : null}
      </div>
    </div>
  );
}
