import "server-only";

import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getCurrentSession } from "@/auth/utils";
import { db } from "@/db";
import {
  snippetTable,
  workspaceMemberTable,
  workspaceTable,
} from "@/db/schema";

export const getWorkspaceBySlug = unstable_cache(
  async (workspaceSlug: string) => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }

    const [workspace] = await db
      .select()
      .from(workspaceTable)
      .where(eq(workspaceTable.slug, workspaceSlug));
    if (!workspace) {
      return null;
    }

    const [workspaceMember] = await db
      .select()
      .from(workspaceMemberTable)
      .where(
        and(
          eq(workspaceMemberTable.userId, session.user.id),
          eq(workspaceMemberTable.workspaceId, workspace.id),
        ),
      );
    if (!workspaceMember) {
      return null;
    }

    return { workspace, workspaceMember };
  },
  ["workspace"],
);

export const getSnippets = unstable_cache(async (workspaceSlug: string) => {
  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace) {
    return [];
  }

  return db
    .select()
    .from(snippetTable)
    .where(eq(snippetTable.workspaceId, workspace.workspace.id));
});
