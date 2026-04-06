import logiqIconSrc from "@/assets/logiq.png";
import logiqLogoSrc from "@/assets/logiq_logo.png";
import { cn } from "@/lib/utils";

/** Full wordmark — nav bars, heroes, auth */
export function LogIQFullLogo({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logiqLogoSrc}
      alt={alt}
      width={280}
      height={60}
      className={cn(
        "h-12 w-auto max-w-[min(320px,78vw)] object-contain object-left sm:h-14 sm:max-w-[min(380px,82vw)] lg:h-16 lg:max-w-[min(420px,85vw)]",
        "drop-shadow-[0_0_28px_rgba(56,189,248,0.16)]",
        className
      )}
    />
  );
}

/** Compact square mark — favicon-style UI, top bar when sidebar is hidden */
export function LogIQIconMark({
  className,
  alt = "LogIQ",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logiqIconSrc}
      alt={alt}
      width={48}
      height={48}
      className={cn(
        "h-12 w-12 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.2)] sm:h-14 sm:w-14",
        className
      )}
    />
  );
}
