import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getCurrentSession } from "@/auth/utils";
import Editor from "@/components/editor/editor";
import { db } from "@/db";
import {
  Snippet,
  snippetTable,
  workspaceMemberTable,
  workspaceTable,
} from "@/db/schema";
import { CURRENT_WORKSPACE_SLUG_COOKIE } from "@/lib/constants";
import {
  CloudSnippetDataProvider,
  LocalSnippetDataProvider,
} from "@/providers/snippet-data-provider";
import { trpc } from "@/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ snippetId?: string }>;
}) {
  const session = await getCurrentSession();
  const { snippetId } = await searchParams;

  if (!session) {
    if (snippetId) {
      redirect("/editor");
    }

    return (
      <LocalSnippetDataProvider>
        <Editor />
      </LocalSnippetDataProvider>
    );
  }

  if (!snippetId) {
    let workspaceId: string | null = null;

    const cookieStore = await cookies();
    const workspaceSlug = cookieStore.get(CURRENT_WORKSPACE_SLUG_COOKIE)?.value;
    if (workspaceSlug) {
      const [workspace] = await db
        .select({ id: workspaceTable.id })
        .from(workspaceTable)
        .where(eq(workspaceTable.slug, workspaceSlug));
      workspaceId = workspace.id;
    }

    if (!workspaceId) {
      const [workspace] = await db
        .select({ id: workspaceMemberTable.workspaceId })
        .from(workspaceMemberTable)
        .where(eq(workspaceMemberTable.userId, session.user.id));

      if (!workspace) {
        redirect("/onboarding/workspace");
      }

      workspaceId = workspace.id;
    }

    const [snippet] = await db
      .select({ id: snippetTable.id })
      .from(snippetTable)
      .where(eq(snippetTable.workspaceId, workspaceId))
      .orderBy(desc(snippetTable.lastSeenAt), desc(snippetTable.createdAt))
      .limit(1);

    if (snippet) {
      redirect(`/editor?snippetId=${encodeURIComponent(snippet.id)}`);
    } else {
      const [newSnippet] = await db
        .insert(snippetTable)
        .values({ title: "Untitled", workspaceId })
        .returning({ id: snippetTable.id });
      if (!newSnippet) {
        throw new Error("Something went wrong!");
      }
      redirect(`/editor?snippetId=${encodeURIComponent(newSnippet.id)}`);
    }
  }

  let snippet: Snippet | null = null;

  try {
    snippet = await trpc.snippets.getSnippet({ snippetId });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {}

  if (!snippet) {
    notFound();
  }

  await db
    .update(snippetTable)
    .set({ lastSeenAt: new Date() })
    .where(eq(snippetTable.id, snippet.id));

  return (
    <CloudSnippetDataProvider snippet={snippet}>
      <Editor />
    </CloudSnippetDataProvider>
  );
}
