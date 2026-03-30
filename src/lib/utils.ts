export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Split repo-style path and optional #L214-L238 anchor for technical display. */
export function splitRootCausePath(path: string): {
  segments: string[];
  lineRange: string | null;
  isStructured: boolean;
} {
  const trimmed = path.trim();
  if (!trimmed) {
    return { segments: [], lineRange: null, isStructured: false };
  }
  /** Non-repo strings (e.g. RCA pending) render as plain monospace block */
  if (!trimmed.includes("/") || /^unknown|^pending/i.test(trimmed)) {
    return { segments: [], lineRange: null, isStructured: false };
  }
  const m = trimmed.match(/^(.*)(#L\d+(?:-\d+)?)$/i);
  const base = m ? m[1]! : trimmed;
  const lineRange = m ? m[2]! : null;
  const segments = base.split("/").filter(Boolean);
  return { segments, lineRange, isStructured: segments.length > 0 };
}
