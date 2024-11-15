import { eq } from "drizzle-orm";
import { redirect, RedirectType } from "next/navigation";

import { getCurrentSession } from "@/auth/utils";
import { db } from "@/db";
import { workspaceMemberTable, workspaceTable } from "@/db/schema";
import { getWorkspaceSlugFromCookie } from "@/lib/server/actions";

export default async function Page() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const workspaceSlug = await getWorkspaceSlugFromCookie();

  if (workspaceSlug) {
    redirect(`/${workspaceSlug}`, RedirectType.replace);
  }

  const workspaces = await db
    .select({ slug: workspaceTable.slug })
    .from(workspaceMemberTable)
    .innerJoin(
      workspaceTable,
      eq(workspaceTable.id, workspaceMemberTable.workspaceId),
    )
    .where(eq(workspaceMemberTable.userId, session.user.id));

  const workspace = workspaces[0];

  if (workspace) {
    redirect(`/${workspace.slug}`, RedirectType.replace);
  }

  redirect(`/onboarding/workspace`, RedirectType.replace);
}
