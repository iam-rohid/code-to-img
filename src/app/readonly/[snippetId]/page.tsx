import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import SnippetEditor from "@/components/editor/editor";
import { db } from "@/db";
import { snippetTable } from "@/db/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ snippetId: string }>;
}) {
  const { snippetId } = await params;
  const [snippet] = await db
    .select({ data: snippetTable.data })
    .from(snippetTable)
    .where(eq(snippetTable.id, snippetId));

  if (!snippet) {
    notFound();
  }

  return <SnippetEditor defaultValue={snippet.data} readOnly />;
}
