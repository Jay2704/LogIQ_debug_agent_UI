import type { LoginFormValues, SignupFormValues } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values: LoginFormValues): Partial<
  Record<keyof LoginFormValues, string>
> {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

export function validateSignup(values: SignupFormValues): Partial<
  Record<keyof SignupFormValues, string>
> {
  const errors: Partial<Record<keyof SignupFormValues, string>> = {};
  if (!values.fullName.trim()) {
    errors.fullName = "Name is required";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  if (!values.role) {
    errors.role = "Select a role";
  }
  if (!values.team.trim()) {
    errors.team = "Team is required";
  }
  return errors;
}

export function hasFieldErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
