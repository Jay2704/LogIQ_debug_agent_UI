/** localStorage key for the JWT returned by `POST /api/v1/auth/login`. */
export const ACCESS_TOKEN_STORAGE_KEY = "logiq.access_token.v1";

export function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const token = raw?.trim();
    return token ? token : null;
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  const trimmed = token.trim();
  if (!trimmed) return;
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, trimmed);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
