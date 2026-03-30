import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Use h1 semantics for page-level; default h2 for in-page sections */
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  as = "h2",
  className,
}: SectionHeaderProps) {
  const Heading = as;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="ui-page-header-block min-w-0 flex-1">
        {eyebrow ? (
          <p className="ui-section-eyebrow">{eyebrow}</p>
        ) : null}
        <Heading
          className={as === "h1" ? "ui-page-title" : "ui-section-title"}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={
              as === "h1" ? "ui-page-desc" : "ui-section-desc"
            }
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
      ) : null}
    </div>
  );
}
