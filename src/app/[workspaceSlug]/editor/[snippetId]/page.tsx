import { notFound } from "next/navigation";

import Editor from "@/components/editor/editor";
import { CloudEditorProvider } from "@/providers/editor-provider";
import { trpc } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ snippetId: string }>;
}) {
  const { snippetId } = await params;
  try {
    await trpc.snippets.getSnippet.prefetch({ snippetId });
    return (
      <CloudEditorProvider snippetId={snippetId}>
        <Editor />
      </CloudEditorProvider>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
