/** Mask a secret for display — never show full token value. */
export function maskSecret(secret: string): string {
  const trimmed = secret.trim();
  if (!trimmed) return "••••••••";
  if (trimmed.length <= 4) return "••••••••";
  return `••••••••${trimmed.slice(-4)}`;
}
