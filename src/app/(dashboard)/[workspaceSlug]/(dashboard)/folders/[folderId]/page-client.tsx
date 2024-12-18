"use client";

import { notFound, useParams } from "next/navigation";

import AppBar from "@/components/app-bar";
import FoldersAndSnippetsList from "@/components/folders-and-snippets-list";
import { useWorkspace } from "@/providers/workspace-provider";
import { trpc } from "@/trpc/client";

export default function PageClient() {
  const { workspace } = useWorkspace();
  const { folderId } = useParams<{ folderId: string }>();
  const folderQuery = trpc.folders.getFolder.useQuery({ folderId });

  if (folderQuery.isError) {
    if (folderQuery.error.data?.code === "NOT_FOUND") {
      notFound();
    }
    return <p>{folderQuery.error.message}</p>;
  }

  return (
    <>
      <AppBar
        links={[
          { title: "Snippets", url: `/${workspace.slug}` },
          ...(folderQuery.data?.parentFolders.map((folder) => ({
            title: folder.name,
            url: `/${workspace.slug}/folders/${folder.id}`,
          })) ?? []),
        ]}
        title={folderQuery.data?.name ?? ""}
      />
      <FoldersAndSnippetsList parentId={folderId} />
    </>
  );
}
