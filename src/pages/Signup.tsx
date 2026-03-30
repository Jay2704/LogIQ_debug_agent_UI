import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthInput, AuthSelect } from "@/components/auth/AuthField";
import { submitSignupPlaceholder } from "@/lib/authHandlers";
import { hasFieldErrors, validateSignup } from "@/lib/authValidation";
import { cn } from "@/lib/utils";
import type { AuthSubmitStatus, SignupFormValues } from "@/types";
import { TEAM_ROLE_OPTIONS } from "@/types";

const initial: SignupFormValues = {
  fullName: "",
  workEmail: "",
  password: "",
  confirmPassword: "",
  teamRole: "",
};

export function Signup() {
  const [values, setValues] = useState<SignupFormValues>(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormValues, string>>
  >({});
  const [submitStatus, setSubmitStatus] = useState<AuthSubmitStatus>("idle");
  const [banner, setBanner] = useState("");

  const loading = submitStatus === "loading";
  const success = submitStatus === "success";
  const disabled = loading || success;

  function update<K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setBanner("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validateSignup(values);
    setErrors(next);
    if (hasFieldErrors(next)) return;

    setSubmitStatus("loading");
    setBanner("");
    const result = await submitSignupPlaceholder(values);
    setSubmitStatus(result.status);
    setBanner(result.message ?? "");
  }

  return (
    <AuthLayout
      cardTitle="Create account"
      cardDescription="Join your team’s LogIQ workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {submitStatus === "error" && banner ? (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {banner}
          </div>
        ) : null}
        {success && banner ? (
          <div
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200"
            aria-live="polite"
          >
            {banner}
          </div>
        ) : null}

        <AuthField
          id="signup-name"
          label="Full name"
          error={errors.fullName}
        >
          <AuthInput
            id="signup-name"
            name="name"
            autoComplete="name"
            placeholder="Alex Rivera"
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            disabled={disabled}
            error={errors.fullName}
            success={Boolean(values.fullName && !errors.fullName)}
          />
        </AuthField>

        <AuthField
          id="signup-email"
          label="Work email"
          error={errors.workEmail}
          hint='Demo: include “fail@” in the email to simulate a failed signup.'
        >
          <AuthInput
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.workEmail}
            onChange={(e) => update("workEmail", e.target.value)}
            disabled={disabled}
            error={errors.workEmail}
            success={Boolean(values.workEmail && !errors.workEmail)}
          />
        </AuthField>

        <AuthField
          id="signup-password"
          label="Password"
          error={errors.password}
          hint="Minimum 8 characters."
        >
          <AuthInput
            id="signup-password"
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            disabled={disabled}
            error={errors.password}
            success={Boolean(values.password && !errors.password)}
          />
        </AuthField>

        <AuthField
          id="signup-confirm"
          label="Confirm password"
          error={errors.confirmPassword}
        >
          <AuthInput
            id="signup-confirm"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            disabled={disabled}
            error={errors.confirmPassword}
            success={
              Boolean(values.confirmPassword) &&
              values.password === values.confirmPassword &&
              !errors.confirmPassword
            }
          />
        </AuthField>

        <AuthField
          id="signup-role"
          label="Team / role"
          error={errors.teamRole}
        >
          <AuthSelect
            id="signup-role"
            name="teamRole"
            value={values.teamRole}
            onChange={(e) =>
              update("teamRole", e.target.value as SignupFormValues["teamRole"])
            }
            disabled={disabled}
            error={errors.teamRole}
            success={Boolean(values.teamRole && !errors.teamRole)}
          >
            <option value="">Select…</option>
            {TEAM_ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AuthSelect>
        </AuthField>

        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
            "bg-cta-primary shadow-glow-cta ring-1 ring-sky-400/30 transition-all duration-200",
            "hover:bg-cta-primary-hover hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-400 transition hover:text-sky-300"
          >
            Sign in
          </Link>
        </p>

        {success ? (
          <div className="border-t border-white/[0.06] pt-4 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-sky-400 hover:text-sky-300"
            >
              Go to sign in →
            </Link>
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
}
