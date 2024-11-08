import Editor from "@/components/editor/editor";
import EditorProvider from "@/providers/editor-provider";
import { trpc } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ workspaceSlug: string; snippetId: string }>;
}) {
  const { snippetId } = await params;
  try {
    const snippet = await trpc.snippets.getSnippet({ snippetId });
    trpc.snippets.getSnippet.prefetch({ snippetId }, { initialData: snippet });
    return (
      <EditorProvider>
        <Editor />
      </EditorProvider>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }
}
