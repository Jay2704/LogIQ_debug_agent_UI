import type { LucideIcon } from "lucide-react";
import {
  Clock,
  FileText,
  Layers,
  ListFilter,
  Search,
  SplitSquareHorizontal,
  Sparkles,
} from "lucide-react";
import type { UtilityIconKey } from "@/types";

export const utilityIconMap: Record<UtilityIconKey, LucideIcon> = {
  search: Search,
  clock: Clock,
  split: SplitSquareHorizontal,
  fileText: FileText,
  layers: Layers,
  listFilter: ListFilter,
  sparkles: Sparkles,
};
