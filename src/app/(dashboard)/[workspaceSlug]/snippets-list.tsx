"use client";

import { useCallback } from "react";
import {
  ChevronDownIcon,
  FilterIcon,
  Loader2,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function MySnippets() {
  const { workspace } = useWorkspace();
  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
    trashed: false,
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
          router.push(`/editor?snippetId=${encodeURIComponent(snippet.id)}`);
          utils.snippets.getSnippets.invalidate({ workspaceId: workspace.id });
        },
        onError: (error) => {
          toast("Failed to create snippet", { description: error.message });
        },
      },
    );
  }, [createSnippetMut, router, utils.snippets.getSnippets, workspace.id]);

  return (
    <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <FilterIcon />
            Filter
            <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <form className="relative w-full max-w-sm">
            <Input className="w-full pl-10 pr-10" placeholder="Search..." />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </form>
          <Button
            onClick={handleCreateSnippet}
            disabled={createSnippetMut.isPending}
          >
            {createSnippetMut.isPending ? <Loader2 /> : <Plus />}
            Create Snippet
          </Button>
        </div>
      </div>

      {snippetsQuery.isPending ? (
        <SnippetListSkeleton />
      ) : snippetsQuery.isError ? (
        <p>{snippetsQuery.error.message}</p>
      ) : snippetsQuery.data.length < 1 ? (
        <p>No snippets found</p>
      ) : (
        <SnippetList snippets={snippetsQuery.data} />
      )}
    </div>
  );
}
