"use client";

import { ChevronDownIcon, FilterIcon, SearchIcon } from "lucide-react";

import { useCreateSnippetModal } from "@/components/modals/create-snippet-modal";
import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function MySnippets() {
  const { workspace } = useWorkspace();
  const [CreateSnippetModal, , setCreateSnippetModalOpen] =
    useCreateSnippetModal();
  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
    trashed: false,
  });

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
          <Button onClick={() => setCreateSnippetModalOpen(true)}>
            Create Snippet
          </Button>
        </div>
      </div>

      {snippetsQuery.isPending ? (
        <SnippetListSkeleton />
      ) : snippetsQuery.isError ? (
        <p>{snippetsQuery.error.message}</p>
      ) : snippetsQuery.data.length < 1 ? (
        <div className="rounded-lg border px-6 py-16">
          <div className="container mx-auto flex max-w-screen-sm flex-col items-center">
            <h3 className="text-center text-lg font-semibold">
              Oops, No Snippets Found!
            </h3>
            <p className="mt-2 text-center text-muted-foreground">
              Don’t worry, it’s easy to fix! Create your first snippet now and
              turn your code into a beautiful, shareable visual for the web or
              your blog.
            </p>
            <Button
              className="mt-6"
              onClick={() => setCreateSnippetModalOpen(true)}
            >
              Create Snippet
            </Button>
          </div>
        </div>
      ) : (
        <SnippetList snippets={snippetsQuery.data} />
      )}

      <CreateSnippetModal />
    </div>
  );
}
