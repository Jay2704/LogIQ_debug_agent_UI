import { api } from "@/api";
import type {
  AuthSubmitResult,
  LoginInput,
  LoginSubmitResult,
  SignupFormValues,
  UserRole,
} from "@/types";

function loginErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/\[LogIQ API\] LOGIN_STATUS 401\b/.test(raw)) {
    return "Invalid email or password";
  }
  if (/\[LogIQ API\] LOGIN_STATUS 404\b/.test(raw)) {
    return "User not found";
  }
  const lower = raw.toLowerCase();
  if (lower.includes("network error") || lower.includes("failed to fetch")) {
    return "Could not reach the server. Check your connection and that the API is running (and CORS).";
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
    return {
      status: "error",
      message: loginErrorMessage(e),
    };
  }
}

function signupErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();

  if (
    /\b409\b/.test(raw) ||
    /\bconflict\b/i.test(raw) ||
    /duplicate|already\s+exists|already\s+registered|unique|email\s+is\s+taken/i.test(
      lower
    )
  ) {
    return "An account with this email already exists. Log in or use a different email.";
  }

  if (/\b(400|422)\b/.test(raw) || /validation|invalid\s+input|unprocessable/i.test(lower)) {
    const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
    if (trimmed.length > 0 && trimmed.length < 400) {
      return trimmed;
    }
    return "Some fields didn’t pass validation. Check your input and try again.";
  }

  if (lower.includes("network error") || lower.includes("failed to fetch")) {
    return "Could not reach the server. Check your connection and that the API is running (and CORS).";
  }

  return "Something went wrong while creating your account. Please try again.";
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
      name: values.fullName.trim(),
      email: values.email.trim(),
      role,
      team: values.team.trim(),
      password: values.password,
    });
    return {
      status: "success",
      message: "Account created. You can log in now.",
    };
  } catch (e) {
    return {
      status: "error",
      message: signupErrorMessage(e),
    };
  }
}
