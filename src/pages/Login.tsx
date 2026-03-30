import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import { submitLoginPlaceholder } from "@/lib/authHandlers";
import { hasFieldErrors, validateLogin } from "@/lib/authValidation";
import { cn } from "@/lib/utils";
import type { AuthSubmitStatus, LoginFormValues } from "@/types";

const initial: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export function Login() {
  const [values, setValues] = useState<LoginFormValues>(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [submitStatus, setSubmitStatus] = useState<AuthSubmitStatus>("idle");
  const [banner, setBanner] = useState("");

  const loading = submitStatus === "loading";
  const success = submitStatus === "success";
  const disabled = loading || success;

  function update<K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K]
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
    const next = validateLogin(values);
    setErrors(next);
    if (hasFieldErrors(next)) return;

    setSubmitStatus("loading");
    setBanner("");
    const result = await submitLoginPlaceholder(values);
    setSubmitStatus(result.status);
    setBanner(result.message ?? "");
  }

  return (
    <AuthLayout
      cardTitle="Sign in"
      cardDescription="Use your work email to access the workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {submitStatus === "error" && banner ? (
          <div
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
            role="alert"
          >
            {banner}
          </div>
        ) : null}
        {success && banner ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200">
            {banner}
          </div>
        ) : null}

        <AuthField id="login-email" label="Email" error={errors.email}>
          <AuthInput
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            disabled={disabled}
            error={errors.email}
            success={Boolean(
              values.email && !errors.email && submitStatus !== "error"
            )}
          />
        </AuthField>

        <AuthField
          id="login-password"
          label="Password"
          error={errors.password}
          hint='Tip: password "faildemo" simulates an error.'
        >
          <AuthInput
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            disabled={disabled}
            error={errors.password}
            success={Boolean(
              values.password && !errors.password && submitStatus !== "error"
            )}
          />
        </AuthField>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => update("rememberMe", e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-white/20 bg-surface-950 text-sky-500 focus:ring-sky-500/40 focus:ring-offset-0 disabled:opacity-50"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
            "bg-cta-primary shadow-glow-cta ring-1 ring-sky-400/30 transition-all duration-200",
            "hover:bg-cta-primary-hover hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70",
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cta-primary"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-sky-400 transition hover:text-sky-300"
          >
            Create one
          </Link>
        </p>

        {success ? (
          <div className="border-t border-white/[0.06] pt-4 text-center">
            <Link
              to="/"
              className="text-sm font-semibold text-sky-400 hover:text-sky-300"
            >
              Continue to dashboard →
            </Link>
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
}
