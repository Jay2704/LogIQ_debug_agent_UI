import { Plus } from "lucide-react";
import type { IntegrationConnection, ValidateIntegrationConnectionResult } from "@/types";
import { ctaButtonGradient, ctaGlowBlueOnly } from "@/lib/ctaTheme";
import { cn } from "@/lib/utils";
import { IntegrationCard } from "./IntegrationCard";

interface IntegrationListProps {
  connections: IntegrationConnection[];
  validatingId: string | null;
  saving?: boolean;
  onAdd: () => void;
  onValidate: (id: string) => Promise<ValidateIntegrationConnectionResult>;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onEdit: (connection: IntegrationConnection) => void;
  onDelete: (id: string) => void;
}

export function IntegrationList({
  connections,
  validatingId,
  saving = false,
  onAdd,
  onValidate,
  onToggleEnabled,
  onEdit,
  onDelete,
}: IntegrationListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          {connections.length} connection{connections.length === 1 ? "" : "s"} in this workspace
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-blue-400/35",
            ctaButtonGradient,
            ctaGlowBlueOnly
          )}
        >
          <Plus className="h-4 w-4" />
          Add integration
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {connections.map((connection) => (
          <IntegrationCard
            key={connection.id}
            connection={connection}
            validating={validatingId === connection.id}
            saving={saving}
            onValidate={onValidate}
            onToggleEnabled={onToggleEnabled}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
