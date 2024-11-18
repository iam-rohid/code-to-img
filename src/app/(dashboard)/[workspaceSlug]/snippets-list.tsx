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

import { SnippetCard } from "@/components/snippet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function SnippetsList() {
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
      <div>
        <h2 className="text-xl font-semibold">My Snippets</h2>
      </div>

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

      <div>
        {snippetsQuery.isPending ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/2.5] rounded-lg" />
            ))}
          </div>
        ) : snippetsQuery.isError ? (
          <p>{snippetsQuery.error.message}</p>
        ) : snippetsQuery.data.length < 1 ? (
          <p>No snippets found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {snippetsQuery.data.map((snippet) => (
              <SnippetCard snippet={snippet} key={snippet.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
