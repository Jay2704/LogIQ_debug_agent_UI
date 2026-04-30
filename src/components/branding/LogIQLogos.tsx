import logiqIconSvg from "@/assets/logiq_icon.svg";
import { cn } from "@/lib/utils";

/** Full wordmark (icon mark + "LogIQ") — sidebar, topbar, heroes, auth */
export function LogIQFullLogo({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 175 56"
      fill="none"
      aria-label="LogIQ"
      role="img"
      className={cn("w-auto", className)}
    >
      <defs>
        <linearGradient id="logiq-logo-gm" x1="4" y1="4" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="55%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="logiq-logo-gt" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path d="M12 7L12 40L30 40" stroke="url(#logiq-logo-gm)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="38" cy="28" r="16" stroke="url(#logiq-logo-gm)" strokeWidth="7" strokeLinecap="round" fill="none"
        strokeDasharray="81 19.5" transform="rotate(170 38 28)" />
      <circle cx="38" cy="28" r="3.5" fill="url(#logiq-logo-gm)" />
      <text
        x="66" y="41"
        fontFamily="'Space Grotesk','DM Sans',system-ui,sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="-0.5"
        className="logiq-wordmark"
      >
        Log<tspan fill="url(#logiq-logo-gt)">IQ</tspan>
      </text>
    </svg>
  );
}

/** Compact square mark only — favicon-size slots */
export function LogIQIconMark({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logiqIconSvg}
      alt={alt}
      className={cn("w-auto", className)}
    />
  );
}
