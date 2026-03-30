import { FileCode2, Hash, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const cellBase =
  "min-w-0 rounded-xl border bg-[#060a12]/90 px-3.5 py-3 shadow-inner ring-1 ring-inset ring-white/[0.03] transition-colors";

interface EvidenceMetadataRowProps {
  fileId: string;
  evidenceRef: string;
  runId: string;
  className?: string;
}

function isMissingRef(value: string): boolean {
  const t = value.trim();
  return t === "" || t === "—";
}

export function EvidenceMetadataRow({
  fileId,
  evidenceRef,
  runId,
  className,
}: EvidenceMetadataRowProps) {
  const cells = [
    {
      key: "file",
      icon: FileCode2,
      label: "File ID",
      value: fileId,
      mono: true,
    },
    {
      key: "evidence",
      icon: Hash,
      label: "Evidence reference",
      value: evidenceRef,
      mono: true,
    },
    {
      key: "run",
      icon: PlayCircle,
      label: "Pipeline run",
      value: runId,
      mono: true,
    },
  ] as const;

  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {cells.map(({ key, icon: Icon, label, value, mono }) => {
        const missing = isMissingRef(value);
        return (
          <div
            key={key}
            className={cn(
              cellBase,
              missing
                ? "border-dashed border-slate-600/45 bg-surface-950/50"
                : "border-white/[0.08]",
              key === "evidence" && !missing && "border-emerald-500/15 ring-emerald-500/10"
            )}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              <Icon
                className={cn(
                  "h-3.5 w-3.5 shrink-0 stroke-[2]",
                  key === "evidence" && !missing
                    ? "text-emerald-400/85"
                    : "text-sky-500/85"
                )}
              />
              {label}
            </div>
            <p
              className={cn(
                "mt-2 break-all leading-relaxed",
                missing
                  ? "text-[12px] italic text-slate-600"
                  : "text-[13px] text-slate-100",
                mono &&
                  !missing &&
                  "font-mono text-[12px] sm:text-[13px] text-sky-100/95",
                key === "evidence" && !missing && "text-emerald-100/95"
              )}
              title={missing ? undefined : value}
            >
              {missing ? "Not linked in this result" : value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
