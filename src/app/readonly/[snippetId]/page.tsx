import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import SnippetViewer from "@/components/snippet-editor/snippet-viewer";
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

  return <SnippetViewer data={snippet.data} className="h-screen" />;
}
