import { getApi } from "@/api/client";
import { resolveRcaRunInput } from "@/lib/rcaRunContext";
import { resolveWorkspaceId } from "@/lib/workspaceId";
import type { RcaRunInput, User } from "@/types";

/** Build RCA run payload with workspace and optional GitHub repo from integrations. */
export async function buildRcaRunInput(
  anomalyId: string,
  user: User | null | undefined
): Promise<RcaRunInput> {
  const workspaceId = resolveWorkspaceId(user);
  const connections = await getApi().integrations.listConnections(workspaceId);
  return resolveRcaRunInput(anomalyId, workspaceId, connections);
}
