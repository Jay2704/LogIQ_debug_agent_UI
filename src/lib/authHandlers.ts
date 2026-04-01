import { api } from "@/api";
import type {
  AuthSubmitResult,
  LoginLookupResult,
  SignupFormValues,
  UserRole,
} from "@/types";

function loginLookupErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();
  if (lower.includes("network error") || lower.includes("failed to fetch")) {
    return "Could not reach the server. Check your connection and that the API is running (and CORS).";
  }
  if (/\b(404)\b/.test(raw) && !lower.includes("conflict")) {
    return "No user found for this email. Create an account on Sign up first.";
  }
  const trimmed = raw.replace(/^\[LogIQ API\]\s*/i, "").trim();
  if (trimmed.length > 0 && trimmed.length < 400) {
    return trimmed;
  }
  return "Could not look up this email. Try again.";
}

/**
 * Prototype login: `GET /api/v1/users/by-email/{email}` — no password or JWT.
 * Call `setCurrentUser` from `@/auth` when status is success to bind the UI.
 */
export async function submitLoginLookup(email: string): Promise<LoginLookupResult> {
  const trimmed = email.trim();
  try {
    const user = await api.users.getUserByEmail(trimmed);
    if (!user) {
      return {
        status: "error",
        message:
          "No user found for this email. Create an account on Sign up first.",
      };
    }
    return {
      status: "success",
      message:
        "You’re signed in for this session (prototype only — not password or token authentication).",
      user,
    };
  } catch (e) {
    return {
      status: "error",
      message: loginLookupErrorMessage(e),
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
    return "An account with this email already exists. Sign in or use a different email.";
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
 * Passwords are not sent or stored in this flow.
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
    });
    return {
      status: "success",
      message:
        "Your profile is saved. You can sign in once password authentication is enabled.",
    };
  } catch (e) {
    return {
      status: "error",
      message: signupErrorMessage(e),
    };
  }
}
