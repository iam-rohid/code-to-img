"use client";

import { ChevronDownIcon } from "lucide-react";

import { SnippetCard } from "@/components/snippet-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div>
        <h2 className="text-xl font-semibold">Trash</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button variant="outline">
            Date Trashed
            <ChevronDownIcon />
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
