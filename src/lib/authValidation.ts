import type { LoginFormValues, SignupFormValues } from "@/types";

/** Simple, practical email pattern — backend remains source of truth. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimum password length (aligned with backend policy). */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Special characters accepted for password policy (frontend hint; backend may differ slightly).
 * Covers common symbols used across stacks.
 */
const PASSWORD_SPECIAL_RE =
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

const PASSWORD_UPPER_RE = /[A-Z]/;
const PASSWORD_LOWER_RE = /[a-z]/;
const PASSWORD_NUMBER_RE = /[0-9]/;

export type PasswordRuleChecks = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
};

/** Per-rule booleans for checklist UI and validation. */
export function getPasswordRuleChecks(password: string): PasswordRuleChecks {
  return {
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    uppercase: PASSWORD_UPPER_RE.test(password),
    lowercase: PASSWORD_LOWER_RE.test(password),
    number: PASSWORD_NUMBER_RE.test(password),
    special: PASSWORD_SPECIAL_RE.test(password),
  };
}

export function isPasswordPolicySatisfied(password: string): boolean {
  const c = getPasswordRuleChecks(password);
  return (
    c.minLength &&
    c.uppercase &&
    c.lowercase &&
    c.number &&
    c.special
  );
}

function validateEmailField(email: string): string | undefined {
  const t = email.trim();
  if (!t) return "Email is required";
  if (!EMAIL_RE.test(t)) return "Enter a valid email address";
  return undefined;
}

export function validateLogin(values: LoginFormValues): Partial<
  Record<keyof LoginFormValues, string>
> {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  const emailErr = validateEmailField(values.email);
  if (emailErr) errors.email = emailErr;
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
}

/** Login: valid when required fields present and email format OK (no strength rules). */
export function isLoginFormValid(values: LoginFormValues): boolean {
  return !hasFieldErrors(validateLogin(values));
}

export function validateSignup(values: SignupFormValues): Partial<
  Record<keyof SignupFormValues, string>
> {
  const errors: Partial<Record<keyof SignupFormValues, string>> = {};
  if (!values.fullName.trim()) {
    errors.fullName = "Name is required";
  }
  const emailErr = validateEmailField(values.email);
  if (emailErr) errors.email = emailErr;

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!isPasswordPolicySatisfied(values.password)) {
    const c = getPasswordRuleChecks(values.password);
    if (!c.minLength) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    } else if (!c.lowercase) {
      errors.password = "Include at least one lowercase letter";
    } else if (!c.uppercase) {
      errors.password = "Include at least one uppercase letter";
    } else if (!c.number) {
      errors.password = "Include at least one number";
    } else if (!c.special) {
      errors.password = "Include at least one special character (!@#$…)";
    }
  }

  if (!values.role) {
    errors.role = "Select a role";
  }
  if (!values.team.trim()) {
    errors.team = "Team is required";
  }
  return errors;
}

export function isSignupFormValid(values: SignupFormValues): boolean {
  return !hasFieldErrors(validateSignup(values));
}

export function hasFieldErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
