import type { FormEvent } from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthPasswordInput } from "@/components/auth/AuthField";
import { PasswordStrengthHint } from "@/components/auth/PasswordStrengthHint";
import { submitResetPassword } from "@/lib/authHandlers";
import {
  hasFieldErrors,
  isPasswordPolicySatisfied,
  isResetPasswordFormValid,
  validateResetPasswordForm,
  type ResetPasswordFormValues,
} from "@/lib/authValidation";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";

const initial: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

export function ResetPassword() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [values, setValues] = useState<ResetPasswordFormValues>(initial);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [banner, setBanner] = useState("");

  const loading = submitStatus === "loading";
  const success = submitStatus === "success";
  const errs = validateResetPasswordForm(values);
  const formValid = isResetPasswordFormValid(values);
  const inputsDisabled = loading || success;
  const submitDisabled = loading || success || !formValid;

  function update<K extends keyof ResetPasswordFormValues>(
    key: K,
    value: ResetPasswordFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setBanner("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const next = validateResetPasswordForm(values);
    if (hasFieldErrors(next)) return;

    setSubmitStatus("loading");
    setBanner("");
    const result = await submitResetPassword(token, values.password);
    if (result.status === "success") {
      setSubmitStatus("success");
      setBanner(result.message ?? "");
      return;
    }
    setSubmitStatus("error");
    setBanner(result.message ?? "Reset failed.");
  }

  if (user?.userId?.trim()) {
    return <Navigate to="/" replace />;
  }

  if (!token) {
    return (
      <AuthLayout
        cardTitle="Invalid link"
        cardDescription="You need a valid reset link from your email."
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2.5 text-sm text-amber-100/95">
            This link is missing a reset token. Request a new reset email.
          </div>
          <Link
            to="/forgot-password"
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/35"
            )}
          >
            Request new link
          </Link>
          <p className="text-center text-sm text-slate-500">
            <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300">
              Back to Login
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      cardTitle="Set new password"
      cardDescription="Choose a strong password for your account."
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
        {submitStatus === "error" && banner ? (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            role="alert"
          >
            {banner}
          </div>
        ) : null}

        {success && banner ? (
          <div
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200"
            role="status"
          >
            {banner}
          </div>
        ) : null}

        {!success ? (
          <>
            <AuthField
              id="reset-password"
              label="New password"
              error={
                values.password.length > 0 ? errs.password : undefined
              }
            >
              <AuthPasswordInput
                id="reset-password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={values.password}
                onChange={(e) => update("password", e.target.value)}
                disabled={inputsDisabled}
                error={
                  values.password.length > 0 ? errs.password : undefined
                }
                success={Boolean(
                  values.password &&
                    !errs.password &&
                    isPasswordPolicySatisfied(values.password)
                )}
              />
            </AuthField>

            <PasswordStrengthHint
              password={values.password}
              disabled={inputsDisabled}
            />

            <AuthField
              id="reset-confirm"
              label="Confirm password"
              error={
                values.confirmPassword.length > 0
                  ? errs.confirmPassword
                  : undefined
              }
            >
              <AuthPasswordInput
                id="reset-confirm"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                disabled={inputsDisabled}
                error={
                  values.confirmPassword.length > 0
                    ? errs.confirmPassword
                    : undefined
                }
                success={Boolean(
                  values.confirmPassword &&
                    !errs.confirmPassword &&
                    values.password === values.confirmPassword &&
                    isPasswordPolicySatisfied(values.password)
                )}
              />
            </AuthField>

            <button
              type="submit"
              disabled={submitDisabled}
              className={cn(
                "relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35 transition-all duration-200",
                "hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className={cn(
              "inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white",
              ctaButtonGradient,
              ctaGlowBlueOnly,
              "ring-1 ring-blue-400/35"
            )}
          >
            Continue to Login
          </button>
        )}

        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-sky-400 hover:text-sky-300">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
