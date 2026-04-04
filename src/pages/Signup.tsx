import type { FormEvent } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCurrentUser } from "@/auth";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
  AuthField,
  AuthInput,
  AuthPasswordInput,
  AuthSelect,
} from "@/components/auth/AuthField";
import { PasswordStrengthHint } from "@/components/auth/PasswordStrengthHint";
import { submitResendVerificationEmail, submitSignup } from "@/lib/authHandlers";
import {
  hasFieldErrors,
  isPasswordPolicySatisfied,
  isSignupFormValid,
  validateSignup,
} from "@/lib/authValidation";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import type { AuthSubmitStatus, SignupFormValues } from "@/types";
import { SIGNUP_ROLE_OPTIONS } from "@/types";

const initial: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  team: "",
};

function visibleSignupError(
  field: keyof SignupFormValues,
  errs: Partial<Record<keyof SignupFormValues, string>>,
  values: SignupFormValues,
  touched: Partial<Record<keyof SignupFormValues, boolean>>
): string | undefined {
  const e = errs[field];
  if (!e) return undefined;
  switch (field) {
    case "email":
      return touched.email || values.email.length > 0 ? e : undefined;
    case "firstName":
      return touched.firstName || values.firstName.length > 0 ? e : undefined;
    case "lastName":
      return touched.lastName || values.lastName.length > 0 ? e : undefined;
    case "password":
      return values.password.length > 0 ? e : undefined;
    case "role":
      return touched.role ? e : undefined;
    case "team":
      return touched.team || values.team.length > 0 ? e : undefined;
    default:
      return undefined;
  }
}

export function Signup() {
  const { user } = useCurrentUser();
  const [values, setValues] = useState<SignupFormValues>(initial);
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignupFormValues, boolean>>
  >({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<AuthSubmitStatus>("idle");
  const [banner, setBanner] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNote, setResendNote] = useState<string | null>(null);

  const loading = submitStatus === "loading";
  const success = submitStatus === "success";
  const errs = validateSignup(values);
  const formValid = isSignupFormValid(values);
  const passwordsMatch = values.password === confirmPassword;
  const confirmPasswordError =
    !confirmPassword
      ? "Confirm your password"
      : !passwordsMatch
        ? "Passwords do not match"
        : undefined;
  const visibleConfirmError =
    (confirmPasswordTouched || confirmPassword.length > 0) ? confirmPasswordError : undefined;
  /** Inputs only locked while submitting or after success — never because validation failed (user must be able to type). */
  const inputsDisabled = loading || success;
  /** Submit gated by validation + loading + success + password match state. */
  const submitDisabled = loading || success || !formValid || !passwordsMatch || !confirmPassword;

  function touch(field: keyof SignupFormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function update<K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setBanner("");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validateSignup(values);
    if (hasFieldErrors(next)) return;
    if (values.password !== confirmPassword) return;

    setSubmitStatus("loading");
    setBanner("");
    const result = await submitSignup(values);
    setSubmitStatus(result.status);
    setBanner(result.message ?? "");
    if (result.status === "success") {
      setRegisteredEmail(values.email.trim());
      setResendNote(null);
    }
  }

  async function handleResendVerification() {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendNote(null);
    const result = await submitResendVerificationEmail(registeredEmail);
    setResendLoading(false);
    setResendNote(result.message ?? "");
  }

  if (user?.userId?.trim()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      cardTitle="Create account"
      cardDescription="Join your team’s LogIQ workspace — create your profile with a password, then log in."
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
          id="signup-first-name"
          label="First name"
          error={visibleSignupError("firstName", errs, values, touched)}
        >
          <AuthInput
            id="signup-first-name"
            name="given-name"
            autoComplete="given-name"
            placeholder="Alex"
            value={values.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            onBlur={() => touch("firstName")}
            disabled={inputsDisabled}
            error={visibleSignupError("firstName", errs, values, touched)}
            success={Boolean(
              values.firstName.trim() && !errs.firstName
            )}
          />
        </AuthField>

        <AuthField
          id="signup-last-name"
          label="Last name"
          error={visibleSignupError("lastName", errs, values, touched)}
          hint="Optional if you go by a single name."
        >
          <AuthInput
            id="signup-last-name"
            name="family-name"
            autoComplete="family-name"
            placeholder="Rivera"
            value={values.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            onBlur={() => touch("lastName")}
            disabled={inputsDisabled}
            error={visibleSignupError("lastName", errs, values, touched)}
            success={Boolean(
              values.lastName.trim() && !errs.lastName
            )}
          />
        </AuthField>

        <AuthField
          id="signup-email"
          label="Email"
          error={visibleSignupError("email", errs, values, touched)}
        >
          <AuthInput
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => touch("email")}
            disabled={inputsDisabled}
            error={visibleSignupError("email", errs, values, touched)}
            success={Boolean(values.email.trim() && !errs.email)}
          />
        </AuthField>

        <AuthField
          id="signup-password"
          label="Password"
          error={visibleSignupError("password", errs, values, touched)}
          hint="Never stored in the browser — only sent when you create your account."
        >
          <AuthPasswordInput
            id="signup-password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => touch("password")}
            disabled={inputsDisabled}
            error={visibleSignupError("password", errs, values, touched)}
            success={Boolean(
              values.password &&
              !errs.password &&
              isPasswordPolicySatisfied(values.password)
            )}
          />
        </AuthField>

        <PasswordStrengthHint password={values.password} disabled={inputsDisabled} />

        <AuthField
          id="signup-confirm-password"
          label="Confirm password"
          error={visibleConfirmError}
        >
          <AuthPasswordInput
            id="signup-confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (submitStatus !== "idle") {
                setSubmitStatus("idle");
                setBanner("");
              }
            }}
            onBlur={() => setConfirmPasswordTouched(true)}
            disabled={inputsDisabled}
            error={visibleConfirmError}
            success={Boolean(
              confirmPassword && !confirmPasswordError
            )}
          />
        </AuthField>

        <AuthField
          id="signup-role"
          label="Role"
          error={visibleSignupError("role", errs, values, touched)}
        >
          <AuthSelect
            id="signup-role"
            name="role"
            value={values.role}
            onChange={(e) =>
              update("role", e.target.value as SignupFormValues["role"])
            }
            onBlur={() => touch("role")}
            disabled={inputsDisabled}
            error={visibleSignupError("role", errs, values, touched)}
            success={Boolean(values.role && !errs.role)}
          >
            <option value="">Select a role…</option>
            {SIGNUP_ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AuthSelect>
        </AuthField>

        <AuthField
          id="signup-team"
          label="Team"
          error={visibleSignupError("team", errs, values, touched)}
          hint="Squad or group name (e.g. Platform, Checkout)."
        >
          <AuthInput
            id="signup-team"
            name="team"
            autoComplete="organization"
            placeholder="Platform"
            value={values.team}
            onChange={(e) => update("team", e.target.value)}
            onBlur={() => touch("team")}
            disabled={inputsDisabled}
            error={visibleSignupError("team", errs, values, touched)}
            success={Boolean(values.team.trim() && !errs.team)}
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
              Creating profile…
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
            Login
          </Link>
        </p>

        {success ? (
          <div className="space-y-3 border-t border-white/[0.06] pt-4 text-center">
            <button
              type="button"
              onClick={() => void handleResendVerification()}
              disabled={resendLoading || !registeredEmail}
              className={cn(
                "w-full rounded-xl border border-white/[0.1] bg-surface-975/80 py-2.5 text-sm font-semibold text-slate-200 transition",
                "hover:border-sky-500/25 hover:bg-surface-975",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              {resendLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Resend verification email"
              )}
            </button>
            {resendNote ? (
              <p className="text-xs text-slate-400">
                {resendNote}
              </p>
            ) : null}
            <Link
              to="/login"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35 transition hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              Continue to Login
            </Link>
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
}
