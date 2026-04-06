import { api } from "@/api";
import type {
  AuthSubmitResult,
  LoginInput,
  LoginSubmitResult,
  SignupFormValues,
  UserRole,
} from "@/types";

/**
 * True only when `fetch` threw before any HTTP response (our `createHttpApi` wrapper).
 * Do not use `includes("network error")` — API JSON bodies can contain that phrase and would be misclassified.
 */
function isLogiqFetchNetworkError(raw: string): boolean {
  return /^\[LogIQ API\] Network error \(no response\):/i.test(raw.trim());
}

/** Shown when `fetch` fails before any HTTP response (offline, DNS, CORS, wrong host, etc.). */
function networkFailureUserMessage(_raw: string): string {
  void _raw;
  return "Could not reach the API. Check that the backend is running, the API URL is correct, and CORS allows this origin.";
}

/**
 * Parses `httpError` messages for signup. Uses a single anchored match so status is found
 * even when there is no space after the code (`...users 500`) or the reason phrase is empty.
 */
function parseSignupPostUsersError(raw: string): { status: number; payload: string } | null {
  const t = raw.trim();
  const m = /^\[LogIQ API\] POST \/api\/v1\/users (\d+)/.exec(t);
  if (!m) return null;
  const status = parseInt(m[1], 10);
  const afterStatus = t.slice(m.index! + m[0].length).trimStart();
  const sep = afterStatus.indexOf(": ");
  if (sep === -1) {
    return { status, payload: "" };
  }
  return { status, payload: afterStatus.slice(sep + 2).trim() };
}

/**
 * Parses JSON detail from the response-body slice for POST /api/v1/users (FastAPI-style `detail`, etc.).
 */
function extractSignupErrorDetail(payload: string): string {
  if (!payload) return "";

  try {
    const j = JSON.parse(payload) as unknown;
    if (typeof j === "object" && j !== null) {
      const o = j as Record<string, unknown>;
      if (typeof o.detail === "string") {
        return o.detail.slice(0, 500);
      }
      if (Array.isArray(o.detail)) {
        const parts = o.detail.map((item) => {
          if (typeof item === "object" && item !== null && "msg" in item) {
            const msg = (item as { msg?: unknown }).msg;
            return typeof msg === "string" ? msg : "";
          }
          return "";
        });
        const joined = parts.filter(Boolean).join(" ");
        if (joined) return joined.slice(0, 500);
      }
      if (typeof o.message === "string") {
        return o.message.slice(0, 500);
      }
    }
  } catch {
    /* not JSON — use raw slice */
  }
  return payload.slice(0, 500);
}

function primaryErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.trim()) return error.message;
    const cause = (error as { cause?: unknown }).cause;
    if (cause instanceof Error && cause.message.trim()) {
      return cause.message;
    }
  }
  return String(error);
}

function signupErrorMessage(error: unknown): string {
  const raw = primaryErrorMessage(error);

  /** HTTP response from POST /api/v1/users — classify before fetch/network (never show unreachable for 4xx/5xx). */
  const parsed = parseSignupPostUsersError(raw);
  if (parsed) {
    const { status: code, payload } = parsed;
    if (code === 409) {
      return "An account with this email already exists.";
    }
    if (code === 422) {
      const detail = extractSignupErrorDetail(payload);
      if (detail) return detail;
      return "Some fields didn’t pass validation. Check your input and try again.";
    }
    if (code >= 500 && code < 600) {
      return "The server returned an error while creating the account.";
    }
    if (code === 400) {
      const detail = extractSignupErrorDetail(payload);
      if (detail) return detail;
      return "Invalid request. Check your input and try again.";
    }
    const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
    if (trimmed.length > 0 && trimmed.length < 500) {
      return trimmed;
    }
    return "Something went wrong while creating your account. Please try again.";
  }

  if (isLogiqFetchNetworkError(raw)) {
    return networkFailureUserMessage(raw);
  }

  const lower = raw.toLowerCase();

  if (
    /\b409\b/.test(raw) ||
    /\bconflict\b/i.test(raw) ||
    /duplicate|already\s+exists|already\s+registered|unique|email\s+is\s+taken/i.test(
      lower
    )
  ) {
    return "An account with this email already exists.";
  }

  if (/\b(400|422)\b/.test(raw) || /validation|invalid\s+input|unprocessable/i.test(lower)) {
    const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
    if (trimmed.length > 0 && trimmed.length < 400) {
      return trimmed;
    }
    return "Some fields didn’t pass validation. Check your input and try again.";
  }

  const trimmedFallback = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
  if (trimmedFallback.length > 0 && trimmedFallback.length < 500) {
    return trimmedFallback;
  }

  return "Something went wrong while creating your account. Please try again.";
}

function genericRequestError(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (isLogiqFetchNetworkError(raw)) {
    return networkFailureUserMessage(raw);
  }
  const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
  if (trimmed.length > 0 && trimmed.length < 400) {
    return trimmed;
  }
  return fallback;
}

function loginIsUnverifiedError(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();
  if (/\[LogIQ API\] LOGIN_STATUS 403_UNVERIFIED\b/.test(raw)) {
    return true;
  }
  if (/email_not_verified/i.test(raw)) {
    return true;
  }
  if (/\b403\b/.test(raw) && /verify|unverified|not verified/i.test(lower)) {
    return true;
  }
  if (
    /unverified|not verified|verify your email|email (?:is )?not verified|must verify/i.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

function loginErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/\[LogIQ API\] LOGIN_STATUS 401\b/.test(raw)) {
    return "Invalid email or password";
  }
  if (/\[LogIQ API\] LOGIN_STATUS 404\b/.test(raw)) {
    return "User not found";
  }
  if (isLogiqFetchNetworkError(raw)) {
    return networkFailureUserMessage(raw);
  }
  const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
  if (trimmed.length > 0 && trimmed.length < 400) {
    return trimmed;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Password login: `POST /api/v1/auth/login` — persists only the returned user via `setCurrentUser` (no password stored).
 */
export async function submitLogin(
  email: string,
  password: string
): Promise<LoginSubmitResult> {
  const input: LoginInput = { email: email.trim(), password };
  try {
    const user = await api.auth.login(input);
    return {
      status: "success",
      message: "You’re logged in for this session (user saved locally — no JWT yet).",
      user,
    };
  } catch (e) {
    if (loginIsUnverifiedError(e)) {
      return {
        status: "error",
        reason: "unverified",
        message:
          "Your email isn’t verified yet. Check your inbox (and spam) for the verification link from us, or use Resend verification below.",
      };
    }
    return {
      status: "error",
      message: loginErrorMessage(e),
    };
  }
}

/**
 * Creates a user via `POST /api/v1/users` (mock or HTTP per `VITE_USE_HTTP` + `VITE_API_BASE_URL`).
 * Password is sent in the request body only — never stored in localStorage.
 */
export async function submitSignup(
  values: SignupFormValues
): Promise<AuthSubmitResult> {
  const role = values.role as UserRole;
  try {
    await api.users.create({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      role,
      team: values.team.trim(),
      password: values.password,
    });
    return {
      status: "success",
      message:
        "Your account was created. We sent a verification email to your inbox.\n\nIf you don’t see it in a minute or two, check your spam or junk folder. You can also resend the verification email below.",
    };
  } catch (e) {
    return {
      status: "error",
      message: signupErrorMessage(e),
    };
  }
}

function verifyEmailErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();
  if (isLogiqFetchNetworkError(raw)) {
    return genericRequestError(
      error,
      "We couldn’t verify your email right now. Try again in a moment."
    );
  }
  if (
    /\b(400|401|403|404|410)\b/.test(raw) ||
    /expired|invalid.*token|token.*invalid|verification link/i.test(lower)
  ) {
    return "This link doesn’t work anymore. It may have expired — use Resend verification from signup or Login, or sign up again.";
  }
  return genericRequestError(
    error,
    "We couldn’t verify your email right now. Try again in a moment."
  );
}

/**
 * POST /api/v1/auth/verify-email
 */
export async function submitVerifyEmail(
  token: string
): Promise<AuthSubmitResult> {
  try {
    await api.auth.verifyEmail(token);
    return {
      status: "success",
      message:
        "Your email is verified. You can use Login with your email and password.",
    };
  } catch (e) {
    return {
      status: "error",
      message: verifyEmailErrorMessage(e),
    };
  }
}

/**
 * POST /api/v1/auth/forgot-password — backend may 404; client treats as success for privacy.
 */
export async function submitForgotPassword(
  email: string
): Promise<AuthSubmitResult> {
  try {
    await api.auth.forgotPassword(email);
    return {
      status: "success",
      message:
        "If an account exists for this email, a password reset link has been sent.\n\nCheck your inbox and spam or junk folder.",
    };
  } catch (e) {
    return {
      status: "error",
      message: genericRequestError(
        e,
        "Could not send reset instructions. Check your connection and try again."
      ),
    };
  }
}

function resetPasswordErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();

  /** HTTP status or API text suggests the reset token/link, not password policy. */
  const looksLikeBadToken =
    /\b401\b/.test(raw) ||
    /\b403\b/.test(raw) ||
    /\b404\b/.test(raw) ||
    /expired.*\b(token|link)\b|\b(token|link)\b.*expired/i.test(lower) ||
    /invalid.*\b(token|reset)\b|\b(reset)\b.*\b(token|link)\b/i.test(lower);

  if (looksLikeBadToken) {
    return "This reset link is invalid or has expired. Request a new reset email from Forgot password.";
  }

  if (
    /\b(400|422)\b/.test(raw) ||
    /validation|password|weak|policy|requirements|does not meet|must contain|at least/i.test(
      lower
    )
  ) {
    const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
    if (trimmed.length > 0 && trimmed.length < 400) {
      return trimmed;
    }
    return "Password does not meet requirements. Use a stronger password.";
  }

  return genericRequestError(
    error,
    "Could not reset your password. Try again or request a new reset link."
  );
}

/**
 * POST /api/v1/auth/reset-password
 */
export async function submitResetPassword(
  token: string,
  password: string
): Promise<AuthSubmitResult> {
  try {
    await api.auth.resetPassword(token, password);
    return {
      status: "success",
      message:
        "Your password was updated. Use Login with your email and new password.",
    };
  } catch (e) {
    return {
      status: "error",
      message: resetPasswordErrorMessage(e),
    };
  }
}

/**
 * POST /api/v1/auth/resend-verification
 */
export async function submitResendVerificationEmail(
  email: string
): Promise<AuthSubmitResult> {
  try {
    await api.auth.resendVerificationEmail(email);
    return {
      status: "success",
      message:
        "If that email is registered, we sent a verification email. Check your inbox and spam or junk folder.",
    };
  } catch (e) {
    return {
      status: "error",
      message: genericRequestError(e, "Could not send the email. Try again."),
    };
  }
}
