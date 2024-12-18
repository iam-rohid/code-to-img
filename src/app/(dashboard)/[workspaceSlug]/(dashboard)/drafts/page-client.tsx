"use client";

import { PlusIcon } from "lucide-react";

import AppBar from "@/components/app-bar";
import { useCreateSnippetModal } from "@/components/modals/create-snippet-modal";
import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const { workspace } = useWorkspace();

  const [CreateSnippetModal, , setCreateSnippetModalOpen] =
    useCreateSnippetModal();

  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
  });

  return (
    <>
      <AppBar
        title="Drafts"
        trailing={
          <Button onClick={() => setCreateSnippetModalOpen(true)}>
            <PlusIcon />
            Create Snippet
          </Button>
        }
      />

      <div className="mx-auto my-16 w-full max-w-screen-xl space-y-8 px-4">
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
      </div>

      <CreateSnippetModal />
    </>
  );
}
