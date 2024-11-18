import "server-only";

import { cache } from "react";
import { and, asc, eq } from "drizzle-orm";

import { getCurrentSession, SessionValidationResult } from "@/auth/utils";
import { db } from "@/db";
import { workspaceMemberTable, workspaceTable } from "@/db/schema";

import { getWorkspaceSlugFromCookie } from "./actions";

export const hasAccessToWorkspaceSlug = cache(
  async (workspaceSlug: string, session?: SessionValidationResult | null) => {
    if (session === undefined) {
      session = await getCurrentSession();
    }

    if (session === null) {
      return false;
    }

    const [workspace] = await db
      .select({ id: workspaceTable.id })
      .from(workspaceTable)
      .where(eq(workspaceTable.slug, workspaceSlug));
    if (!workspace) {
      return false;
    }

    const workspaceMembers = await db
      .select()
      .from(workspaceMemberTable)
      .where(
        and(
          eq(workspaceMemberTable.userId, session.user.id),
          eq(workspaceMemberTable.workspaceId, workspace.id),
        ),
      );

    return workspaceMembers.length > 0;
  },
);

export const getFirstWorkspaceSlug = cache(
  async (session?: SessionValidationResult | null): Promise<string | null> => {
    if (session === undefined) {
      session = await getCurrentSession();
    }

    if (session === null) {
      return null;
    }

    const workspaceSlug = await getWorkspaceSlugFromCookie();
    if (workspaceSlug) {
      return workspaceSlug;
    }

    const [workspace] = await db
      .select({ slug: workspaceTable.slug })
      .from(workspaceMemberTable)
      .innerJoin(
        workspaceTable,
        eq(workspaceTable.id, workspaceMemberTable.workspaceId),
      )
      .where(eq(workspaceMemberTable.userId, session.user.id))
      .orderBy(asc(workspaceMemberTable.createdAt))
      .limit(1);
    return workspace?.slug ?? null;
  },
);
