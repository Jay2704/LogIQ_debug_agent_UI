import { FileCode2, Hash, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvidenceMetadataRowProps {
  fileId: string;
  evidenceRef: string;
  runId: string;
  className?: string;
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
      label: "Evidence ref",
      value: evidenceRef,
      mono: true,
    },
    {
      key: "run",
      icon: PlayCircle,
      label: "Run ID",
      value: runId,
      mono: true,
    },
  ] as const;

  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-3",
        className
      )}
    >
      {cells.map(({ key, icon: Icon, label, value, mono }) => (
        <div
          key={key}
          className="min-w-0 rounded-xl border border-white/[0.07] bg-[#060a12]/90 px-3 py-2.5 shadow-inner ring-1 ring-inset ring-white/[0.03]"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            <Icon className="h-3 w-3 shrink-0 text-sky-500/80" strokeWidth={2} />
            {label}
          </div>
          <p
            className={cn(
              "mt-1.5 break-all text-[12px] leading-snug text-slate-200",
              mono && "font-mono text-[11px] text-sky-100/90"
            )}
            title={value}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
