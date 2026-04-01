import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthInput } from "@/components/auth/AuthField";
import { submitLogin } from "@/lib/authHandlers";
import { hasFieldErrors, validateLogin } from "@/lib/authValidation";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { formatUserContextLine } from "@/lib/userDisplay";
import { cn } from "@/lib/utils";
import type { AuthSubmitStatus, LoginFormValues } from "@/types";

const initial: LoginFormValues = {
  email: "",
  password: "",
};

export function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, user } = useCurrentUser();
  const [values, setValues] = useState<LoginFormValues>(initial);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});
  const [submitStatus, setSubmitStatus] = useState<AuthSubmitStatus>("idle");
  const [banner, setBanner] = useState("");

  const loading = submitStatus === "loading";
  const success = submitStatus === "success";
  const disabled = loading;

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
    const result = await submitLogin(values.email, values.password);
    if (result.status === "success" && result.user) {
      setCurrentUser(result.user);
      setSubmitStatus("success");
      setBanner(result.message ?? "");
      setValues((v) => ({ ...v, password: "" }));
    } else {
      setSubmitStatus("error");
      setBanner(result.message ?? "Login failed.");
    }
  }

  const previewUser = success && user ? user : null;

  return (
    <AuthLayout
      cardTitle="Login"
      cardDescription="Enter your email and password. Your password is not stored in the browser — only the returned user profile is saved for this session."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

        <AuthField id="login-password" label="Password" error={errors.password}>
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

        {previewUser ? (
          <div className="rounded-xl border border-white/[0.08] bg-surface-900/50 px-4 py-3 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Logged in as
            </p>
            <p className="mt-1 font-semibold text-slate-100">
              {previewUser.name || previewUser.email}
            </p>
            <p className="mt-0.5 text-slate-400">
              {formatUserContextLine(previewUser)}
            </p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
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
              Logging in…
            </>
          ) : success ? (
            "Login again"
          ) : (
            "Login"
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
            <button
              type="button"
              onClick={() => navigate("/")}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white",
                ctaButtonGradient,
                ctaGlowBlueOnly,
                "ring-1 ring-blue-400/35 transition hover:shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/70"
              )}
            >
              Continue to dashboard
            </button>
          </div>
        ) : null}
      </form>
    </AuthLayout>
  );
}
