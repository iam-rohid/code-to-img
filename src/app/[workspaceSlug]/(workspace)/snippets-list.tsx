"use client";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export default function SnippetsList() {
  const { workspace } = useWorkspace();
  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
  });

  const router = useRouter();

  const utils = trpc.useUtils();
  const createSnippetMut = trpc.snippets.createSnippet.useMutation();

  const handleCreateSnippet = useCallback(() => {
    createSnippetMut.mutate(
      { workspaceId: workspace.id, dto: { title: "Untitled" } },
      {
        onSuccess: (snippet) => {
          toast("Snippet created");
          router.push(`/${workspace.slug}/editor/${snippet.id}`);
          utils.snippets.getSnippets.invalidate({ workspaceId: workspace.id });
        },
        onError: (error) => {
          toast("Failed to create snippet", { description: error.message });
        },
      },
    );
  }, [
    createSnippetMut,
    router,
    utils.snippets.getSnippets,
    workspace.id,
    workspace.slug,
  ]);

  return (
    <div>
      <h2>Snippets</h2>
      <Button
        onClick={handleCreateSnippet}
        disabled={createSnippetMut.isPending}
      >
        {createSnippetMut.isPending ? <Loader2 /> : <Plus />}
        Create Snippet
      </Button>

      <div>
        {snippetsQuery.isPending ? (
          <p>Loading...</p>
        ) : snippetsQuery.isError ? (
          <p>{snippetsQuery.error.message}</p>
        ) : snippetsQuery.data.length < 1 ? (
          <p>No snippets found</p>
        ) : (
          snippetsQuery.data.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/${workspace.slug}/editor/${snippet.id}`}
            >
              {snippet.title}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
