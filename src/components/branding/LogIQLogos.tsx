import { useId } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

/** Gradient colours shared by both logos */
const MARK_STOPS = [
  { offset: "0%",   color: "#22D3EE" },
  { offset: "55%",  color: "#6366F1" },
  { offset: "100%", color: "#8B5CF6" },
] as const;

const TEXT_STOPS = [
  { offset: "0%",   color: "#22D3EE" },
  { offset: "100%", color: "#8B5CF6" },
] as const;

/** The L+Q icon paths — rendered inside an <svg> that supplies the gradient IDs */
function LQPaths({ gid }: { gid: string }) {
  const fill = `url(#${gid})`;
  return (
    <>
      {/* L: vertical bar + foot */}
      <path
        d="M12 7L12 40L30 40"
        stroke={fill}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Q ring: 70° gap at lower-left */}
      <circle
        cx="38" cy="28" r="16"
        stroke={fill}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="81 19.5"
        transform="rotate(170 38 28)"
      />
      {/* Centre dot */}
      <circle cx="38" cy="28" r="3.5" fill={fill} />
    </>
  );
}

/** Full wordmark (L+Q mark + "LogIQ") — sidebar, nav bars, heroes, auth */
export function LogIQFullLogo({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  const id = useId();
  const { theme } = useTheme();
  const gm = `${id}-gm`;
  const gt = `${id}-gt`;
  // "Log" text must be visible on both dark (#040C18) and light (#edf2fb) backgrounds
  const logFill = theme === "light" ? "#1e293b" : "#ffffff";

  return (
    <svg
      viewBox="0 0 175 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className={cn("w-auto", className)}
    >
      <defs>
        <linearGradient id={gm} x1="4" y1="4" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          {MARK_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={gt} x1="0%" y1="0%" x2="100%" y2="0%">
          {TEXT_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      <LQPaths gid={gm} />

      <text
        x="66"
        y="41"
        fontFamily="'Space Grotesk','DM Sans',system-ui,sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="-0.5"
        fill={logFill}
      >
        Log<tspan fill={`url(#${gt})`}>IQ</tspan>
      </text>
    </svg>
  );
}

/** Compact square mark — topbar, auth header, favicon-size slots */
export function LogIQIconMark({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  const id = useId();
  const gm = `${id}-gm`;

  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className={cn("w-auto", className)}
    >
      <defs>
        <linearGradient id={gm} x1="4" y1="4" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          {MARK_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <LQPaths gid={gm} />
    </svg>
  );
}
