import type {
  AuthSubmitResult,
  LoginFormValues,
  SignupFormValues,
} from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Placeholder sign-in — replace with `api.auth.login()` when backend exists.
 * Demo: use password `faildemo` to simulate an error response.
 */
export async function submitLoginPlaceholder(
  values: LoginFormValues
): Promise<AuthSubmitResult> {
  await delay(1000);
  if (values.password === "faildemo") {
    return {
      status: "error",
      message:
        "Invalid credentials (simulated). Use any other password for a success state.",
    };
  }
  return {
    status: "success",
    message:
      "Signed in successfully (demo). No session is stored — connect an auth API to persist.",
  };
}

/**
 * Placeholder sign-up — replace with `api.auth.signup()` when backend exists.
 */
export async function submitSignupPlaceholder(
  _values: SignupFormValues
): Promise<AuthSubmitResult> {
  void _values;
  await delay(1200);
  return {
    status: "success",
    message:
      "Account created (demo). Verify email flow would start here once wired to a backend.",
  };
}
