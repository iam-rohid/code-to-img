"use client";

import { ChevronDownIcon } from "lucide-react";

import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function TrashList() {
  const { workspace } = useWorkspace();
  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
    trashed: true,
  });

  return (
    <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
      <div className="flex gap-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="outline">
            Date Trashed
            <ChevronDownIcon />
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
