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
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "At least 8 characters";
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
  if (!values.workEmail.trim()) {
    errors.workEmail = "Work email is required";
  } else if (!EMAIL_RE.test(values.workEmail.trim())) {
    errors.workEmail = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "At least 8 characters";
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (!values.teamRole) {
    errors.teamRole = "Select a team or role";
  }
  return errors;
}

export function hasFieldErrors(errors: object): boolean {
  return Object.keys(errors).length > 0;
}
