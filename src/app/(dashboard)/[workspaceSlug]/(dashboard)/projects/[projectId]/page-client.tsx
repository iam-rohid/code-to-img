"use client";

import { PlusIcon } from "lucide-react";
import { notFound, useParams } from "next/navigation";

import AppBar from "@/components/app-bar";
import { useCreateSnippetModal } from "@/components/modals/create-snippet-modal";
import { SnippetList, SnippetListSkeleton } from "@/components/snippet-list";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const { workspace } = useWorkspace();
  const { projectId } = useParams<{ projectId: string }>();
  const [CreateSnippetModal, , setCreateSnippetModalOpen] =
    useCreateSnippetModal();

  const projectQuery = trpc.projects.getProject.useQuery({
    projectId,
    workspaceId: workspace.id,
  });

  const snippetsQuery = trpc.snippets.getSnippets.useQuery({
    workspaceId: workspace.id,
    projectId,
  });

  if (projectQuery.isError) {
    if (projectQuery.error.data?.code === "NOT_FOUND") {
      notFound();
    }
    return <p>{projectQuery.error.message}</p>;
  }

  return (
    <>
      <AppBar
        links={[{ title: "All Projects", url: `/${workspace.slug}/projects` }]}
        title={projectQuery.data?.name ?? ""}
        trailing={
          <Button onClick={() => setCreateSnippetModalOpen(true)} size="sm">
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
                This project doesn&apos;t have any snippets.
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Create a new snippet to start from scratch.
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

      <CreateSnippetModal projectId={projectId} />
    </>
  );
}
