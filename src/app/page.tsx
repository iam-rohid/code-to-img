import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

import { getCurrentSession, SessionValidationResult } from "@/auth/utils";
import { db } from "@/db";
import { workspaceMemberTable, workspaceTable } from "@/db/schema";

const getRedirectUrl = async (session: SessionValidationResult) => {
  let workspaceSlug = session.user.defaultWorkspace;

  if (!workspaceSlug) {
    const [workspace] = await db
      .select({ slug: workspaceTable.slug })
      .from(workspaceMemberTable)
      .innerJoin(
        workspaceTable,
        eq(workspaceTable.id, workspaceMemberTable.workspaceId),
      )
      .where(eq(workspaceMemberTable.userId, session.user.id))
      .orderBy(asc(workspaceMemberTable.createdAt));

    if (workspace) {
      workspaceSlug = workspace.slug;
    }
  }

  if (!workspaceSlug) {
    return "/onboarding/workspace";
  }

  return `/${workspaceSlug}`;
};

export default async function Page() {
  const session = await getCurrentSession();
  if (session) {
    redirect(await getRedirectUrl(session), RedirectType.replace);
  }

  return (
    <div>
      <Link href="/login">Log In</Link>
    </div>
  );
}
