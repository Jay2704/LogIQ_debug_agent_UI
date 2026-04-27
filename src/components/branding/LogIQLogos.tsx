import logiqFullSvg from "@/assets/logiq_full.svg";
import logiqIconSvg from "@/assets/logiq_icon.svg";
import { cn } from "@/lib/utils";

/** Full wordmark (icon mark + "LogIQ") — sidebar, topbar, heroes, auth */
export function LogIQFullLogo({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logiqFullSvg}
      alt={alt}
      className={cn("w-auto", className)}
    />
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
