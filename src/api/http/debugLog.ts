/** Temporary integration logs — gated on DEV; search for `[LogIQ API]` to remove. */
export function logApiDebug(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.info("[LogIQ API]", ...args);
  }
}
